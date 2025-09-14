import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

let supabase: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  return createClient()
}

export function createClient() {
  if (!supabase) {
    // Check if environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables')
      throw new Error('Supabase configuration is missing. Please check your environment variables.')
    }

    supabase = createSupabaseBrowserClient(
      supabaseUrl,
      supabaseAnonKey,
    )
  }
  return supabase
}
