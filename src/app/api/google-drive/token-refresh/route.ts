import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { refreshAccessToken, storeUserTokens, getUserTokens } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Starting automatic token refresh process...')

    const supabase = createClient()

    // Get all admin users with tokens
    const { data: adminUsers, error } = await supabase
      .from('chameleons')
      .select('user_id, google_email, access_token, refresh_token, token_expiry, is_admin, Authorized')
      .eq('is_admin', true)
      .eq('Authorized', true)
      .not('refresh_token', 'is', null)

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
        console.log(`🔄 Processing user ${user.user_id} (${user.google_email})`)

        // Check if token needs refresh (with 10-minute buffer)
        const needsRefresh = !user.token_expiry ||
          new Date(user.token_expiry).getTime() - (10 * 60 * 1000) <= Date.now()

        if (!needsRefresh) {
          console.log(`⏭️ Token for user ${user.user_id} is still valid, skipping`)
          results.push({
            user_id: user.user_id,
            email: user.google_email,
            status: 'skipped',
            reason: 'Token still valid'
          })
          continue
        }

        if (!user.refresh_token) {
          console.log(`⚠️ No refresh token for user ${user.user_id}, skipping`)
          results.push({
            user_id: user.user_id,
            email: user.google_email,
            status: 'skipped',
            reason: 'No refresh token'
          })
          continue
        }

        // Refresh the token
        console.log(`🔑 Refreshing token for user ${user.user_id}`)
        const newTokens = await refreshAccessToken(user.refresh_token)

        if (!newTokens.access_token) {
          throw new Error('No access token received from refresh')
        }

        // Store the new tokens
        await storeUserTokens(
          user.user_id,
          user.google_email, // Using email as google_id for simplicity
          user.google_email,
          newTokens.access_token,
          newTokens.refresh_token || user.refresh_token,
          newTokens.expiry_date || undefined
        )

        console.log(`✅ Successfully refreshed token for user ${user.user_id}`)
        successCount++

        results.push({
          user_id: user.user_id,
          email: user.google_email,
          status: 'success',
          new_expiry: newTokens.expiry_date
        })

      } catch (userError) {
        console.error(`❌ Failed to refresh token for user ${user.user_id}:`, userError)
        failureCount++

        results.push({
          user_id: user.user_id,
          email: user.google_email,
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
    console.error('💥 Critical error in token refresh:', error)
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