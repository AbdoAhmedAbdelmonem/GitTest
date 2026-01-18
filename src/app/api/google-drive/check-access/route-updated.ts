import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { checkAdminAccess, getAdminGoogleTokens } from '@/lib/admin-operations'

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

    const userIdNum = parseInt(userId)
    
    // Use the new admin access check
    const accessCheck = await checkAdminAccess(userIdNum)
    
    if (!accessCheck.isAdmin) {
      return NextResponse.json({
        hasAccess: false,
        isAdmin: false,
        authorized: false,
        message: 'User is not an admin'
      })
    }

    // Get admin tokens from admins table
    const tokens = await getAdminGoogleTokens(userIdNum)
    
    const hasAccess = !!(tokens?.access_token && tokens?.authorized)
    
    return NextResponse.json({
      hasAccess,
      isAdmin: true,
      authorized: tokens?.authorized || false,
      hasTokens: !!tokens?.access_token
    })
    
  } catch (error) {
    console.error('Error checking Google Drive access:', error)
    return NextResponse.json(
      { hasAccess: false, error: 'Failed to check Google Drive access' },
      { status: 500 }
    )
  }
}
