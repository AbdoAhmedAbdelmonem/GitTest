import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Get authenticated user from auth token (prevents IDOR)
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - No auth token' },
        { status: 401 }
      )
    }

    // Parse user from JWT token
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Get user data using auth_id (prevents IDOR)
    const { data: user, error: userError } = await supabase
      .from('chameleons')
      .select('user_id, is_admin')
      .eq('auth_id', authUser.id)
      .single()

    if (userError) {
      console.error('Error checking user:', userError)
      return NextResponse.json(
        { hasAccess: false, error: 'Failed to check user' },
        { status: 500 }
      )
    }

    // If user is not an admin, they don't have Google Drive access
    if (!user?.is_admin) {
      return NextResponse.json({
        hasAccess: false,
        isAdmin: false,
        authorized: false
      })
    }

    // Check if admin has Google OAuth tokens in admins table
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('access_token, refresh_token, authorized')
      .eq('user_id', user.user_id)
      .single()

    if (adminError && adminError.code !== 'PGRST116') {
      console.error('Error checking admin access:', adminError)
      return NextResponse.json(
        { hasAccess: false, error: 'Failed to check admin access' },
        { status: 500 }
      )
    }

    // Admin has access if they have tokens and are authorized
    const hasAccess = !!(adminData?.access_token && adminData?.authorized)
    
    return NextResponse.json({
      hasAccess,
      isAdmin: user?.is_admin || false,
      authorized: adminData?.authorized || false
    })
    
  } catch (error) {
    console.error('Error checking Google Drive access:', error)
    return NextResponse.json(
      { hasAccess: false, error: 'Failed to check Google Drive access' },
      { status: 500 }
    )
  }
}
