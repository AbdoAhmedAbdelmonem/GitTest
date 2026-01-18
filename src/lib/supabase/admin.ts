// Server-side Supabase client with Service Role Key
// ⚠️ NEVER use this in client-side code!
// This bypasses Row Level Security (RLS)

import { createClient } from "@supabase/supabase-js"

let adminClient: ReturnType<typeof createClient> | null = null

/**
 * Creates a Supabase client with Service Role Key (admin privileges)
 * Use this ONLY in:
 * - API Routes (app/api/...)
 * - Server Actions
 * - Server Components that need full access
 * 
 * ⚠️ NEVER expose this to the client!
 */
export function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('createAdminClient cannot be used in browser!')
  }

  if (!adminClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
    }

    if (!serviceRoleKey) {
      console.warn('⚠️ SUPABASE_SERVICE_ROLE_KEY not found, falling back to ANON key (limited access)')
      // Fallback to anon key if service role not available
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!anonKey) {
        throw new Error('Missing Supabase keys')
      }
      adminClient = createClient(supabaseUrl, anonKey)
    } else {
      adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    }
  }

  return adminClient
}

/**
 * Check if we're running on the server
 */
export function isServer() {
  return typeof window === 'undefined'
}
