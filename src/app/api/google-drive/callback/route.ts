import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getGoogleUserInfo, storeUserTokens } from '@/lib/google-oauth'
import { createClient } from '@/lib/supabase/client'

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

    console.log(`🔐 OAUTH CALLBACK DEBUG - Got tokens for user ${userId}: access_token starts with ${tokens.access_token.substring(0, 20)}..., refresh_token starts with ${tokens.refresh_token ? tokens.refresh_token.substring(0, 20) + '...' : 'NONE'}`)

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokens.access_token)
    
    if (!userInfo.id || !userInfo.email) {
      throw new Error('Failed to get user information from Google')
    }

    console.log(`🔐 OAUTH CALLBACK DEBUG - Google user info for user ${userId}: ${userInfo.email} (ID: ${userInfo.id})`)

    // Check if this Google account is already associated with another user
    const supabase = createClient()
    const { data: existingUser } = await supabase
      .from('chameleons')
      .select('user_id, google_email')
      .eq('google_id', userInfo.id)
      .neq('user_id', userId)
      .single()

    if (existingUser) {
      console.log(`🚨 OAUTH CALLBACK DEBUG - Google account ${userInfo.email} already associated with user ${existingUser.user_id}, but trying to associate with user ${userId}`)
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('This Google account is already connected to another user. Each user must use their own Google account.')}`, request.url)
      )
    }

    // Store tokens in database
    await storeUserTokens(
      userId,
      userInfo.id,
      userInfo.email,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expiry_date
    )

    console.log(`✅ OAUTH CALLBACK DEBUG - Tokens stored successfully for user ${userId} with Google account ${userInfo.email}`)

    // For admin users, also set Authorized to true
    if (isAdmin) {
      const supabase = createClient()
      await supabase
        .from('chameleons')
        .update({ Authorized: true, is_banned: false })
        .eq('user_id', userId)
    }

    console.log(`✅ OAuth tokens stored successfully for user ${userId}`)
    
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
