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
 * @param authIdOrState - Either the authId to generate state, or a pre-generated state string
 * @param isAdmin - Whether the user is an admin (only used if authIdOrState is authId)
 * @param useProvidedState - If true, authIdOrState is treated as a complete state string
 */
export function getAuthUrl(
  authIdOrState: string, 
  isAdmin: boolean = false,
  useProvidedState: boolean = false
): string {
  const scopes = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.appdata',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ]

  // Use provided state or generate new one
  const state = useProvidedState 
    ? authIdOrState 
    : `user:${authIdOrState}${isAdmin ? ':admin' : ''}`

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
export async function refreshAccessToken(authId: string): Promise<string | null> {
  try {
    const supabase = createAdminClient()
    
    // Get refresh token from admins table
    const { data: adminData, error } = await supabase
      .from('admins')
      .select('refresh_token')
      .eq('auth_id', authId)
      .single()

    if (error || !adminData?.refresh_token) {
      console.error('No refresh token found for user:', authId)
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
    await updateAdminTokens(authId, {
      access_token: credentials.access_token,
      token_expiry: credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : undefined,
    })

    console.log('✅ Access token refreshed successfully for user:', authId)
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
  authId: string,
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
    .eq('auth_id', authId)
    .single()

  if (!user?.is_admin) {
    throw new Error('User is not an admin')
  }

  // Prepare data for admins table
  const adminData: any = {
    auth_id: authId,
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
      onConflict: 'auth_id'
    })

  if (error) {
    console.error('Error storing admin tokens:', error)
    throw new Error('Failed to store tokens')
  }

  console.log(`✅ Tokens stored in admins table for user ${authId}`)
}

/**
 * Get user tokens from admins table
 * UPDATED: Now queries admins table
 */
export async function getUserTokens(authId: string) {
  const supabase = createAdminClient()
  
  // Get tokens from admins table
  const { data, error } = await supabase
    .from('admins')
    .select('google_id, google_email, access_token, refresh_token, token_expiry, authorized')
    .eq('auth_id', authId)
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
export async function getValidAccessToken(authId: string): Promise<string | null> {
  try {
    const tokens = await getUserTokens(authId)
    
    if (!tokens?.access_token) {
      console.error('No access token found for user:', authId)
      return null
    }

    // Check if token is expired
    if (isTokenExpired(tokens.token_expiry)) {
      console.log('Token expired, refreshing for user:', authId)
      return await refreshAccessToken(authId)
    }

    console.log('🔑 TOKEN DEBUG - User', authId, 'has valid token')
    return tokens.access_token

  } catch (error) {
    console.error('Error getting valid access token:', error)
    return null
  }
}

/**
 * Refresh tokens for all admins
 * ADDED: Batch refresh function for all admin users
 */
export async function refreshAllAdminTokens(): Promise<{
  refreshedCount: number
  failedCount: number
  totalUsers: number
  results: Array<{
    auth_id: string
    status: 'success' | 'failed' | 'skipped'
    reason?: string
    error?: string
  }>
}> {
  try {
    const supabase = createAdminClient()
    
    // Get all admins with refresh tokens
    const { data: admins, error } = await supabase
      .from('admins')
      .select('auth_id, google_email, refresh_token, token_expiry, authorized')
      .eq('authorized', true)
      .not('refresh_token', 'is', null)

    if (error) {
      console.error('Error fetching admins:', error)
      throw new Error('Failed to fetch admins')
    }

    if (!admins || admins.length === 0) {
      console.log('No admins with refresh tokens found')
      return {
        refreshedCount: 0,
        failedCount: 0,
        totalUsers: 0,
        results: []
      }
    }

    console.log(`📋 Found ${admins.length} admins with refresh tokens`)

    let refreshedCount = 0
    let failedCount = 0
    const results: Array<{
      auth_id: string
      status: 'success' | 'failed' | 'skipped'
      reason?: string
      error?: string
    }> = []

    // Process each admin
    for (const admin of admins as Array<{
      auth_id: string
      google_email: string
      refresh_token: string
      token_expiry: string | null
      authorized: boolean
    }>) {
      try {
        // Check if token needs refresh (with 5-minute buffer)
        const needsRefresh = !admin.token_expiry ||
          isTokenExpired(admin.token_expiry)

        if (!needsRefresh) {
          console.log(`⏭️ Token for ${admin.auth_id} is still valid, skipping`)
          results.push({
            auth_id: admin.auth_id,
            status: 'skipped',
            reason: 'Token still valid'
          })
          continue
        }

        console.log(`🔄 Refreshing token for ${admin.auth_id} (${admin.google_email})`)
        
        // Refresh the token
        const newAccessToken = await refreshAccessToken(admin.auth_id)

        if (!newAccessToken) {
          throw new Error('No access token received from refresh')
        }

        console.log(`✅ Successfully refreshed token for ${admin.auth_id}`)
        refreshedCount++

        results.push({
          auth_id: admin.auth_id,
          status: 'success'
        })

      } catch (adminError) {
        console.error(`❌ Failed to refresh token for ${admin.auth_id}:`, adminError)
        failedCount++

        results.push({
          auth_id: admin.auth_id,
          status: 'failed',
          error: adminError instanceof Error ? adminError.message : 'Unknown error'
        })
      }
    }

    console.log(`📊 Batch refresh completed: ${refreshedCount} successful, ${failedCount} failed`)

    return {
      refreshedCount,
      failedCount,
      totalUsers: admins.length,
      results
    }

  } catch (error) {
    console.error('Critical error in refreshAllAdminTokens:', error)
    throw error
  }
}

/**
 * Revoke user's Google access
 * UPDATED: Clears tokens from admins table
 */
export async function revokeUserAccess(authId: string): Promise<boolean> {
  try {
    const supabase = createAdminClient()
    
    // Get access token to revoke with Google
    const tokens = await getUserTokens(authId)
    
    if (tokens?.access_token) {
      // Revoke with Google
      try {
        await oauth2Client.revokeToken(tokens.access_token)
      } catch (error) {
        console.error('Error revoking token with Google:', error)
      }
    }

    // Clear tokens in admins table  
    const updatePayload: any = {
      access_token: null,
      refresh_token: null,
      token_expiry: null,
      authorized: false,
      updated_at: new Date().toISOString()
    }
    
    const { error } = await (supabase
      .from('admins') as any)
      .update(updatePayload)
      .eq('auth_id', authId)

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
