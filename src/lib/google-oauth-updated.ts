// Updated google-oauth.ts to work with new admins table structure
import { google } from 'googleapis'
import { createAdminClient } from './supabase/admin'
import { updateAdminTokens } from './admin-operations'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

/**
 * Generate authorization URL for OAuth flow
 */
export function getAuthUrl(userId: number, isAdmin: boolean = false): string {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ]

  const state = `user:${userId}${isAdmin ? ':admin' : ''}`

  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    state,
    prompt: 'consent', // Force consent to get refresh token
  })
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

/**
 * Get user info from Google
 */
export async function getGoogleUserInfo(accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken })
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
  const { data } = await oauth2.userinfo.get()
  return data
}

/**
 * Refresh access token using refresh token
 * Now queries admins table for tokens
 */
export async function refreshAccessToken(userId: number): Promise<string | null> {
  try {
    const supabase = createAdminClient()
    
    // Get refresh token from admins table
    const { data: adminData, error } = await supabase
      .from('admins')
      .select('refresh_token')
      .eq('user_id', userId)
      .single()

    if (error || !adminData?.refresh_token) {
      console.error('No refresh token found for user:', userId)
      return null
    }

    // Use refresh token to get new access token
    oauth2Client.setCredentials({ refresh_token: adminData.refresh_token })
    const { credentials } = await oauth2Client.refreshAccessToken()

    if (!credentials.access_token) {
      console.error('Failed to refresh access token')
      return null
    }

    // Update tokens in admins table
    await updateAdminTokens(userId, {
      access_token: credentials.access_token,
      token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : undefined,
    })

    console.log('✅ Access token refreshed successfully for user:', userId)
    return credentials.access_token

  } catch (error) {
    console.error('Error refreshing access token:', error)
    return null
  }
}

/**
 * Store user tokens in the admins table
 * UPDATED: Now stores in admins table instead of chameleons
 */
export async function storeUserTokens(
  userId: number,
  googleId: string,
  googleEmail: string,
  accessToken: string,
  refreshToken: string | null | undefined,
  expiryDate: number | null | undefined
): Promise<void> {
  const supabase = createAdminClient()

  // First verify user is admin
  const { data: user } = await supabase
    .from('chameleons')
    .select('is_admin')
    .eq('user_id', userId)
    .single()

  if (!user?.is_admin) {
    throw new Error('User is not an admin')
  }

  // Prepare data for admins table
  const adminData: any = {
    user_id: userId,
    google_id: googleId,
    google_email: googleEmail,
    access_token: accessToken,
    authorized: true,
    updated_at: new Date().toISOString()
  }

  if (refreshToken) {
    adminData.refresh_token = refreshToken
  }

  if (expiryDate) {
    adminData.token_expiry = new Date(expiryDate).toISOString()
  }

  // Upsert into admins table
  const { error } = await supabase
    .from('admins')
    .upsert(adminData, {
      onConflict: 'user_id'
    })

  if (error) {
    console.error('Error storing admin tokens:', error)
    throw new Error('Failed to store tokens')
  }

  console.log(`✅ Tokens stored in admins table for user ${userId}`)
}

/**
 * Get user tokens from admins table
 * UPDATED: Now queries admins table
 */
export async function getUserTokens(userId: number) {
  const supabase = createAdminClient()
  
  // Get tokens from admins table
  const { data, error } = await supabase
    .from('admins')
    .select('google_id, google_email, access_token, refresh_token, token_expiry, authorized')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Check if token is expired
 */
export function isTokenExpired(expiryDate: string | null | undefined): boolean {
  if (!expiryDate) return true
  
  const expiry = new Date(expiryDate).getTime()
  const now = Date.now()
  const bufferTime = 5 * 60 * 1000 // 5 minutes buffer
  
  return expiry - now < bufferTime
}

/**
 * Get valid access token (refresh if needed)
 * UPDATED: Works with admins table
 */
export async function getValidAccessToken(userId: number): Promise<string | null> {
  try {
    const tokens = await getUserTokens(userId)
    
    if (!tokens?.access_token) {
      console.error('No access token found for user:', userId)
      return null
    }

    // Check if token is expired
    if (isTokenExpired(tokens.token_expiry)) {
      console.log('Token expired, refreshing for user:', userId)
      return await refreshAccessToken(userId)
    }

    console.log('🔑 TOKEN DEBUG - User', userId, 'has valid token')
    return tokens.access_token

  } catch (error) {
    console.error('Error getting valid access token:', error)
    return null
  }
}

/**
 * Revoke user's Google access
 * UPDATED: Clears tokens from admins table
 */
export async function revokeUserAccess(userId: number): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    
    // Get access token to revoke with Google
    const tokens = await getUserTokens(userId)
    
    if (tokens?.access_token) {
      // Revoke with Google
      try {
        await oauth2Client.revokeToken(tokens.access_token)
      } catch (error) {
        console.error('Error revoking token with Google:', error)
      }
    }

    // Clear tokens in admins table
    const { error } = await supabase
      .from('admins')
      .update({
        access_token: null,
        refresh_token: null,
        token_expiry: null,
        authorized: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error clearing admin tokens:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error revoking user access:', error)
    return false
  }
}
