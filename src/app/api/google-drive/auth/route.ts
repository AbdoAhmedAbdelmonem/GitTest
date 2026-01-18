import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createAdminClient } from '@/lib/supabase/admin'
import { getGoogleAuthUrl } from '@/lib/google-oauth'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  try {
    /* ------------------------------------------------------------------
     * 1) Create Supabase server client (cookie-based auth)
     * ------------------------------------------------------------------ */
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    /* ------------------------------------------------------------------
     * 2) Ensure user is authenticated
     * ------------------------------------------------------------------ */
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    /* ------------------------------------------------------------------
     * 3) Validate query param
     * ------------------------------------------------------------------ */
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')

    if (!userIdParam || isNaN(Number(userIdParam))) {
      return NextResponse.json(
        { error: 'Invalid userId' },
        { status: 400 }
      )
    }

    const userId = Number(userIdParam)

    /* ------------------------------------------------------------------
     * 4) Fetch user record using ADMIN client (server only)
     * ------------------------------------------------------------------ */
    const admin = createAdminClient()

    const { data: userData, error: userError } = await admin
      .from('chameleons')
      .select('user_id, auth_id, is_admin')
      .eq('user_id', userId)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    /* ------------------------------------------------------------------
     * 5) Ownership check (CRITICAL)
     * ------------------------------------------------------------------ */
    if (userData.auth_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    /* ------------------------------------------------------------------
     * 6) Generate a SAFE state (signed, non-forgeable)
     * ------------------------------------------------------------------ */
    const payload = {
      userId: userData.user_id,
      ts: Date.now(),
    }

    const payloadBase64 = Buffer
      .from(JSON.stringify(payload))
      .toString('base64url')

    const signature = crypto
      .createHmac('sha256', process.env.OAUTH_STATE_SECRET!)
      .update(payloadBase64)
      .digest('base64url')

    const state = `${payloadBase64}.${signature}`

    /* ------------------------------------------------------------------
     * 7) Generate Google OAuth URL
     * ------------------------------------------------------------------ */
    const authUrl = getGoogleAuthUrl(state)

    return NextResponse.redirect(authUrl)

  } catch (error) {
    console.error('OAuth init error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
