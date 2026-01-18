import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getGoogleUserInfo } from '@/lib/google-oauth'
import { createAdminClient } from '@/lib/supabase/admin'
import { authorizeAdmin } from '@/lib/admin-operations'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('OAuth authorization was denied')}`, request.url)
      )
    }

    if (!code) {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('No authorization code received')}`, request.url)
      )
    }

    // Parse state parameter to get user ID
    let userId: number
    let isAdmin = false
    
    if (state && state.startsWith('user:')) {
      const parts = state.split(':')
      userId = parseInt(parts[1])
      isAdmin = parts.includes('admin')
    } else {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('Invalid state parameter')}`, request.url)
      )
    }

    console.log(`🔐 OAUTH CALLBACK DEBUG - Processing callback for user ${userId}, state: ${state}`)

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code) as any
    
    if (!tokens.access_token) {
      throw new Error('No access token received from Google')
    }

    console.log(`🔐 OAUTH CALLBACK DEBUG - Got tokens for user ${userId}`)

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokens.access_token)
    
    if (!userInfo.id || !userInfo.email) {
      throw new Error('Failed to get user information from Google')
    }

    console.log(`🔐 OAUTH CALLBACK DEBUG - Google user info for user ${userId}: ${userInfo.email}`)

    const supabase = createAdminClient()
    
    // Check if this Google account is already associated with another user in admins table
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('user_id')
      .eq('google_id', userInfo.id)
      .neq('user_id', userId)
      .single()

    if (existingAdmin) {
      console.log(`🚨 OAUTH CALLBACK DEBUG - Google account already associated with user ${existingAdmin.user_id}`)
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('This Google account is already connected to another user. Each user must use their own Google account.')}`, request.url)
      )
    }

    // Verify user is actually an admin
    const { data: user } = await supabase
      .from('chameleons')
      .select('is_admin, is_banned')
      .eq('user_id', userId)
      .single()

    if (!user?.is_admin || user.is_banned) {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('User is not authorized as an admin')}`, request.url)
      )
    }

    // Store tokens in admins table using the new helper function
    const result = await authorizeAdmin(userId, {
      google_id: userInfo.id,
      google_email: userInfo.email,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expiry: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : undefined
    })

    if (!result.success) {
      throw new Error(result.error || 'Failed to authorize admin')
    }

    console.log(`✅ OAUTH CALLBACK DEBUG - Admin authorized successfully for user ${userId}`)

    // Redirect back to drive page with success message
    return NextResponse.redirect(
      new URL('/drive?success=Google Drive connected successfully', request.url)
    )
    
  } catch (error) {
    console.error('Error in OAuth callback:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    return NextResponse.redirect(
      new URL(`/drive?error=${encodeURIComponent(errorMessage)}`, request.url)
    )
  }
}
