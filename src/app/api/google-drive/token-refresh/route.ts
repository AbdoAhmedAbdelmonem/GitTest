import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { refreshAccessToken, storeUserTokens } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Starting automatic token refresh process...')

    const supabase = createAdminClient()

    // Get all admin users by joining chameleons and admins tables
    const { data: adminUsers, error } = await supabase
      .from('chameleons')
      .select(`
        auth_id,
        is_admin,
        admins!inner (
          google_id,
          google_email,
          access_token,
          refresh_token,
          token_expiry,
          authorized
        )
      `)
      .eq('is_admin', true)
      .eq('admins.authorized', true)
      .not('admins.refresh_token', 'is', null)

    if (error) {
      console.error('❌ Error fetching admin users:', error)
      return NextResponse.json(
        { error: 'Failed to fetch admin users' },
        { status: 500 }
      )
    }

    if (!adminUsers || adminUsers.length === 0) {
      console.log('ℹ️ No admin users with refresh tokens found')
      return NextResponse.json({
        success: true,
        message: 'No admin users with refresh tokens found',
        refreshed: 0,
        total: 0
      })
    }

    console.log(`👥 Found ${adminUsers.length} admin users with refresh tokens`)

    let successCount = 0
    let failureCount = 0
    const results = []

    // Process each admin user
    for (const user of adminUsers) {
      try {
        const adminData = Array.isArray(user.admins) ? user.admins[0] : user.admins
        
        if (!adminData) {
          console.log(`⚠️ No admin data for user ${user.auth_id}, skipping`)
          continue
        }

        console.log(`🔄 Processing user ${user.auth_id} (${adminData.google_email})`)

        // Check if token needs refresh (with 10-minute buffer)
        const needsRefresh = !adminData.token_expiry ||
          new Date(adminData.token_expiry).getTime() - (10 * 60 * 1000) <= Date.now()

        if (!needsRefresh) {
          console.log(`⏭️ Token for user ${user.auth_id} is still valid, skipping`)
          results.push({
            auth_id: user.auth_id,
            email: adminData.google_email,
            status: 'skipped',
            reason: 'Token still valid'
          })
          continue
        }

        if (!adminData.refresh_token) {
          console.log(`⚠️ No refresh token for user ${user.auth_id}, skipping`)
          results.push({
            auth_id: user.auth_id,
            email: adminData.google_email,
            status: 'skipped',
            reason: 'No refresh token'
          })
          continue
        }

        // Refresh the token using auth_id
        console.log(`🔑 Refreshing token for user ${user.auth_id}`)
        const newAccessToken = await refreshAccessToken(user.auth_id)

        if (!newAccessToken) {
          throw new Error('No access token received from refresh')
        }

        console.log(`✅ Successfully refreshed token for user ${user.auth_id}`)
        successCount++

        results.push({
          auth_id: user.auth_id,
          email: adminData.google_email,
          status: 'success'
        })

      } catch (userError) {
        console.error(`❌ Failed to refresh token for user ${user.auth_id}:`, userError)
        failureCount++

        const adminData = Array.isArray(user.admins) ? user.admins[0] : user.admins

        results.push({
          auth_id: user.auth_id,
          email: adminData?.google_email || 'unknown',
          status: 'failed',
          error: userError instanceof Error ? userError.message : 'Unknown error'
        })
      }
    }

    console.log(`📊 Token refresh completed: ${successCount} successful, ${failureCount} failed`)

    return NextResponse.json({
      success: true,
      message: `Token refresh completed: ${successCount} successful, ${failureCount} failed`,
      refreshed: successCount,
      failed: failureCount,
      total: adminUsers.length,
      results
    })

  } catch (error) {
    return NextResponse.json(
      {
        error: 'Critical error during token refresh',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request)
}
