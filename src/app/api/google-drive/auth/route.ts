import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-oauth'
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

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

    if (authError || !authUser) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      )
    }

    // Get user_id and admin status from database using auth_id
    const { data: userData, error: userError } = await supabase
      .from('chameleons')
      .select('user_id, is_admin')
      .eq('auth_id', authUser.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userData.user_id
    const isAdmin = userData.is_admin

    // Generate state parameter with user info
    const state = `user:${userId}${isAdmin ? ':admin' : ''}`
    
    // Generate Google OAuth URL
    const authUrl = getGoogleAuthUrl(state)
    
    return NextResponse.json({
      success: true,
      authUrl
    })
    
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, isAdmin } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Generate state parameter with user info
    const state = `user:${userId}${isAdmin ? ':admin' : ''}`
    
    // Generate Google OAuth URL
    const authUrl = getGoogleAuthUrl(state)
    
    return NextResponse.json({
      success: true,
      data: { authUrl }
    })
    
  } catch (error) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }
}
