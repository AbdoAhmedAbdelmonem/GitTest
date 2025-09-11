import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

let supabase: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  return createClient()
}

export function createClient() {
  if (!supabase) {
    supabase = createSupabaseBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
  }
  return supabase
}
