import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = createClient()
    
    // Check if user has stored Google OAuth tokens
    const { data: user, error } = await supabase
      .from('chameleons')
      .select('user_id, access_token, refresh_token, Authorized, is_admin')
      .eq('user_id', parseInt(userId))
      .single()

    if (error) {
      console.error('Error checking user access:', error)
      return NextResponse.json(
        { hasAccess: false, error: 'Failed to check user access' },
        { status: 500 }
      )
    }

    // User has access if they have tokens and are authorized
    const hasAccess = !!(user?.access_token && user?.Authorized)
    
    return NextResponse.json({
      hasAccess,
      isAdmin: user?.is_admin || false,
      authorized: user?.Authorized || false
    })
    
  } catch (error) {
    console.error('Error checking Google Drive access:', error)
    return NextResponse.json(
      { hasAccess: false, error: 'Failed to check Google Drive access' },
      { status: 500 }
    )
  }
}