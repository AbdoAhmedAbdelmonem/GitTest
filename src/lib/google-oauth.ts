import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/client'

// Google OAuth2 configuration
export const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID!,
  process.env.GOOGLE_CLIENT_SECRET!,
  `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/google-drive/callback`
)

// Google Drive API scopes
export const GOOGLE_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive', // Full access to Google Drive
  'https://www.googleapis.com/auth/userinfo.email', // Get user email
  'https://www.googleapis.com/auth/userinfo.profile' // Get user profile
]

// Generate Google OAuth URL
export function getGoogleAuthUrl(state?: string): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline', // Required for refresh tokens
    scope: GOOGLE_DRIVE_SCOPES,
    prompt: 'consent', // Force consent screen to get refresh token
    state: state || 'default', // Optional state parameter
    include_granted_scopes: true
  })
}

// Exchange authorization code for tokens
export async function exchangeCodeForTokens(code: string) {
  try {
    return new Promise((resolve, reject) => {
      oauth2Client.getToken(code, (err, tokens) => {
        if (err) {
          console.error('Error getting tokens:', err)
          reject(new Error('Failed to exchange authorization code for tokens'))
        } else {
          resolve(tokens)
        }
      })
    })
  } catch (error) {
    console.error('Error exchanging code for tokens:', error)
    throw new Error('Failed to exchange authorization code for tokens')
  }
}

// Get user info from Google
export async function getGoogleUserInfo(accessToken: string) {
  try {
    oauth2Client.setCredentials({ access_token: accessToken })
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data: userInfo } = await oauth2.userinfo.get()
    return userInfo
  } catch (error) {
    console.error('Error getting Google user info:', error)
    throw new Error('Failed to get user information from Google')
  }
}

// Refresh access token using refresh token
export async function refreshAccessToken(refreshToken: string) {
  try {
    oauth2Client.setCredentials({ refresh_token: refreshToken })
    const { credentials } = await oauth2Client.refreshAccessToken()
    return credentials
  } catch (error) {
    console.error('Error refreshing access token:', error)
    throw new Error('Failed to refresh access token')
  }
}

// Store tokens in database
export async function storeUserTokens(
  userId: number,
  googleId: string,
  googleEmail: string,
  accessToken: string,
  refreshToken?: string,
  expiryDate?: number
) {
  try {
    const supabase = createClient()
    
    const updateData = {
      google_id: googleId,
      google_email: googleEmail,
      access_token: accessToken,
      token_expiry: expiryDate ? new Date(expiryDate) : null,
      Authorized: true // Set user as authorized when storing tokens
    } as any

    // Only update refresh token if provided (it's not always returned)
    if (refreshToken) {
      updateData.refresh_token = refreshToken
    }

    const { error } = await supabase
      .from('chameleons')
      .update(updateData)
      .eq('user_id', userId)

    if (error) {
      console.error('Error storing tokens in database:', error)
      throw new Error('Failed to store tokens in database')
    }

    return true
  } catch (error) {
    console.error('Error in storeUserTokens:', error)
    throw error
  }
}

// Get user tokens from database
export async function getUserTokens(userId: number) {
  try {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('chameleons')
      .select('google_id, google_email, access_token, refresh_token, token_expiry')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error getting user tokens:', error)
      throw new Error('Failed to get user tokens from database')
    }

    return data
  } catch (error) {
    console.error('Error in getUserTokens:', error)
    throw error
  }
}

// Check if access token is expired
export function isTokenExpired(expiryDate: string | Date | null): boolean {
  if (!expiryDate) return true
  
  const expiry = new Date(expiryDate)
  const now = new Date()
  
  // Add 5-minute buffer to avoid edge cases
  const buffer = 5 * 60 * 1000 // 5 minutes in milliseconds
  return (expiry.getTime() - buffer) <= now.getTime()
}

// Get valid access token (refresh if needed) - requires individual authentication
export async function getValidAccessToken(userId: number): Promise<string> {
  try {
    // Each user must have their own tokens - no token sharing
    const tokens = await getUserTokens(userId)
    
    if (!tokens?.access_token) {
      throw new Error('No access token found for user. Please authenticate with Google Drive.')
    }

    // User has their own tokens, check if valid
    if (!isTokenExpired(tokens.token_expiry)) {
      return tokens.access_token
    }

    // Token is expired, refresh it
    if (!tokens.refresh_token) {
      throw new Error('No refresh token available to refresh access token')
    }

    console.log('Access token expired, refreshing...')
    const newTokens = await refreshAccessToken(tokens.refresh_token)
    
    if (!newTokens.access_token) {
      throw new Error('Failed to get new access token')
    }

    // Store new tokens
    await storeUserTokens(
      userId,
      tokens.google_id,
      tokens.google_email,
      newTokens.access_token,
      newTokens.refresh_token || tokens.refresh_token, // Keep old refresh token if new one not provided
      newTokens.expiry_date || undefined
    )

    return newTokens.access_token
  } catch (error) {
    console.error('Error getting valid access token:', error)
    throw error
  }
}

// Configure OAuth client with user tokens
export async function configureOAuthClientForUser(userId: number) {
  try {
    const accessToken = await getValidAccessToken(userId)
    const tokens = await getUserTokens(userId)
    
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: tokens.refresh_token
    })

    return oauth2Client
  } catch (error) {
    console.error('Error configuring OAuth client for user:', error)
    throw error
  }
}
