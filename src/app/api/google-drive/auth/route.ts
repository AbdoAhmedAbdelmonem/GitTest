import { NextRequest, NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const isAdmin = searchParams.get('isAdmin') === 'true'
    
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
