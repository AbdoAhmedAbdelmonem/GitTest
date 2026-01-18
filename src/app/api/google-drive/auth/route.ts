import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-oauth'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Get userId from query params
    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')

    if (!userIdParam) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      )
    }

    // Get user data using admin client (bypasses RLS)
    const { data: userData, error: userError } = await supabase
      .from('chameleons')
      .select('user_id, is_admin')
      .eq('user_id', parseInt(userIdParam))
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
    
    // Redirect directly to Google OAuth page
    return NextResponse.redirect(authUrl)
    
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
