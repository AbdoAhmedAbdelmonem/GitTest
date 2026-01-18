import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForTokens, getGoogleUserInfo, storeUserTokens } from '@/lib/google-oauth'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

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

    // Parse and verify signed state parameter
    let userId: number
    
    if (!state) {
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('Missing state parameter')}`, request.url)
      )
    }

    try {
      const [payloadBase64, signature] = state.split('.')
      
      // Verify signature
      const expectedSignature = crypto
        .createHmac('sha256', process.env.OAUTH_STATE_SECRET!)
        .update(payloadBase64)
        .digest('base64url')
      
      if (signature !== expectedSignature) {
        throw new Error('Invalid signature')
      }
      
      // Decode payload
      const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString())
      userId = payload.userId
      
      // Optional: Check timestamp (e.g., reject if older than 10 minutes)
      const age = Date.now() - payload.ts
      if (age > 10 * 60 * 1000) {
        throw new Error('State expired')
      }
      
    } catch (error) {
      console.error('State verification failed:', error)
      return NextResponse.redirect(
        new URL(`/drive?error=${encodeURIComponent('Invalid or expired state')}`, request.url)
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

    // Check if this Google account is already associated with another user in admins table
    const supabase = createAdminClient()
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('user_id, google_email')
      .eq('google_id', userInfo.id)
      .neq('user_id', userId)
      .single()

    if (existingAdmin) {
      console.log(`🚨 OAUTH CALLBACK DEBUG - Google account ${userInfo.email} already associated with user ${existingAdmin.user_id}, but trying to associate with user ${userId}`)
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
