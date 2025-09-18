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

    // Exchange code for tokens
    const tokens = await exchangeCodeForTokens(code) as any
    
    if (!tokens.access_token) {
      throw new Error('No access token received from Google')
    }

    // Get user info from Google
    const userInfo = await getGoogleUserInfo(tokens.access_token)
    
    if (!userInfo.id || !userInfo.email) {
      throw new Error('Failed to get user information from Google')
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
