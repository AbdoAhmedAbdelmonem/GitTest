// Admin operations helper library
// Use this for all admin-related database operations after migration

import { createServerClient } from '@/lib/supabase/server'
import type { AdminData } from './auth-updated'

/**
 * Check if a user is an authorized admin
 * Uses the new admins table structure
 */
export async function checkAdminAccess(userId: number): Promise<{
  hasAccess: boolean
  isAdmin: boolean
  authorized: boolean
}> {
  const supabase = await createServerClient()
  
  // Query both chameleons and admins tables
  const { data: user, error } = await supabase
    .from('chameleons')
    .select(`
      is_admin,
      is_banned,
      admins (
        authorized
      )
    `)
    .eq('user_id', userId)
    .single()
  
  if (error || !user) {
    return { hasAccess: false, isAdmin: false, authorized: false }
  }
  
  const isAdmin = user.is_admin === true
  const notBanned = user.is_banned === false
  const authorized = user.admins?.[0]?.authorized === true
  const hasAccess = isAdmin && notBanned && authorized
  
  return { hasAccess, isAdmin, authorized }
}

/**
 * Get admin data including Google Drive tokens
 */
export async function getAdminData(userId: number): Promise<AdminData | null> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error || !data) {
    return null
  }
  
  return data as AdminData
}

/**
 * Update admin Google Drive tokens
 */
export async function updateAdminTokens(
  userId: number,
  tokens: {
    access_token?: string
    refresh_token?: string
    token_expiry?: string
    authorized?: boolean
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  // First ensure user is admin
  const { data: user } = await supabase
    .from('chameleons')
    .select('is_admin')
    .eq('user_id', userId)
    .single()
  
  if (!user?.is_admin) {
    return { success: false, error: 'User is not an admin' }
  }
  
  // Update or insert admin record
  const { error } = await supabase
    .from('admins')
    .upsert({
      user_id: userId,
      ...tokens,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

/**
 * Get admin Google Drive tokens for API calls
 */
export async function getAdminGoogleTokens(userId: number): Promise<{
  access_token?: string
  refresh_token?: string
  token_expiry?: string
  authorized: boolean
} | null> {
  const supabase = await createServerClient()
  
  // Use the database function we created
  const { data, error } = await supabase.rpc('get_admin_tokens', {
    p_user_id: userId
  })
  
  if (error || !data || data.length === 0) {
    return null
  }
  
  return data[0]
}

/**
 * Check if admin is authorized (simplified check)
 */
export async function isAdminAuthorized(userId: number): Promise<boolean> {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase.rpc('is_admin_authorized', {
    p_user_id: userId
  })
  
  if (error) {
    return false
  }
  
  return data === true
}

/**
 * Authorize an admin for Google Drive access
 */
export async function authorizeAdmin(
  userId: number,
  googleData: {
    google_id: string
    google_email: string
    access_token: string
    refresh_token?: string
    token_expiry?: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  // Verify user is admin
  const { data: user } = await supabase
    .from('chameleons')
    .select('is_admin')
    .eq('user_id', userId)
    .single()
  
  if (!user?.is_admin) {
    return { success: false, error: 'User is not an admin' }
  }
  
  // Insert or update admin record
  const { error } = await supabase
    .from('admins')
    .upsert({
      user_id: userId,
      google_id: googleData.google_id,
      google_email: googleData.google_email,
      access_token: googleData.access_token,
      refresh_token: googleData.refresh_token,
      token_expiry: googleData.token_expiry,
      authorized: true,
      updated_at: new Date().toISOString()
    })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

/**
 * Revoke admin authorization
 */
export async function revokeAdminAccess(userId: number): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  
  const { error } = await supabase
    .from('admins')
    .update({
      authorized: false,
      access_token: null,
      refresh_token: null,
      token_expiry: null,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  return { success: true }
}

/**
 * Get user with admin info using secure function
 */
export async function getUserWithAdminInfo(userId: number) {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .rpc('get_user_with_admin_info', { p_user_id: userId })
  
  if (error || !data || data.length === 0) {
    return null
  }
  
  return data[0]
}

/**
 * List all authorized admins
 */
export async function getAuthorizedAdmins() {
  const supabase = await createServerClient()
  
  const { data, error } = await supabase
    .rpc('get_admin_users')
  
  if (error) {
    return []
  }
  
  return data
}
