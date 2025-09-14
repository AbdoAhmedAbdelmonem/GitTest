import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import type { CookieOptions } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('Callback route called with code:', !!code)
  console.log('Request URL:', requestUrl.toString())

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options })
          },
        },
      }
    )
    
    console.log('Exchanging code for session...')
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=callback_error`)
    }

    // Get the current session after exchange
    console.log('Getting session after exchange...')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      console.log('User found in session:', session.user.email)
      
      // Check if user already exists in our database
      const { data: existingUser, error: dbError } = await supabase
        .from("chameleons")
        .select("*")
        .eq("email", session.user.email)
        .single()

      console.log('Database query result:', !!existingUser, dbError?.message)

      if (existingUser) {
        console.log('Existing user found, setting up session and redirecting to main page')
        
        // Create session data for existing user
        const sessionData = {
          user_id: existingUser.user_id,
          username: existingUser.username,
          phone_number: existingUser.phone_number,
          specialization: existingUser.specialization,
          age: existingUser.age,
          current_level: existingUser.current_level,
          is_admin: existingUser.is_admin,
          is_banned: existingUser.is_banned,
          created_at: existingUser.created_at,
          email: existingUser.email,
          profile_image: existingUser.profile_image,
        }
        
        // Redirect to a special route that will set the session and redirect
        const sessionParam = encodeURIComponent(JSON.stringify(sessionData))
        return NextResponse.redirect(`${requestUrl.origin}/auth/complete-login?session=${sessionParam}`)
      } else {
        console.log('New user, redirecting to profile completion')
        // New user - redirect to complete profile
        return NextResponse.redirect(`${requestUrl.origin}/auth?step=name-phone&mode=signup`)
      }
    } else {
      console.log('No session found after exchange')
    }
  }

  console.log('No code or session, redirecting to auth')
  // If no code or session, redirect to auth
  return NextResponse.redirect(`${requestUrl.origin}/auth`)
}