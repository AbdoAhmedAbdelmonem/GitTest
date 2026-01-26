import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createAdminClient } from '@/lib/supabase/admin'
import { getValidAccessToken } from '@/lib/google-oauth'

// Check if user has admin access
async function checkAdminAccess(authId: string) {
  const supabase = createAdminClient()
  
  const { data: user, error } = await supabase
    .from('chameleons')
    .select('is_admin')
    .eq('auth_id', authId)
    .single()

  if (error || !user) {
    console.log('No user found or error:', error)
    return { hasAccess: false, isAdmin: false }
  }

  // Check if admin is authorized (has Google tokens)
  const { data: adminData } = await supabase
    .from('admins')
    .select('authorized')
    .eq('auth_id', authId)
    .single()

  console.log('User data from DB:', user, 'Admin data:', adminData)
  
  // User has admin access if they are admin AND authorized
  const hasAccess = user.is_admin && (adminData?.authorized || false)
  return { hasAccess, isAdmin: user.is_admin }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { newName, authId: authIdFromBody } = await request.json()
    
    const supabase = createAdminClient()

    // Get authId from body or query params
    const { searchParams } = new URL(request.url)
    const authIdParam = searchParams.get('authId') || authIdFromBody

    if (!authIdParam) {
      return NextResponse.json(
        { error: 'Missing authId parameter' },
        { status: 400 }
      )
    }

    const authId = authIdParam

    if (!params.fileId) {
      return NextResponse.json(
        { error: 'File ID is required' },
        { status: 400 }
      )
    }

    if (!newName || typeof newName !== 'string') {
      return NextResponse.json(
        { error: 'New name is required' },
        { status: 400 }
      )
    }

    // Check if user has admin access
    const { hasAccess } = await checkAdminAccess(authId)
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Admin authorization required.' },
        { status: 403 }
      )
    }

    // Get valid access token for the user
    const accessToken = await getValidAccessToken(authId)
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google Drive authentication required' },
        { status: 401 }
      )
    }

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // Rename file in Google Drive
    const response = await drive.files.update({
      fileId: params.fileId,
      requestBody: {
        name: newName.trim()
      },
      fields: 'id, name, mimeType, size, modifiedTime, webViewLink, webContentLink'
    })
    
    return NextResponse.json({
      success: true,
      data: response.data
    })
    
  } catch (error) {
    console.error('Error renaming file in Google Drive:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    if (errorMessage.includes('File not found')) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }
    
    if (errorMessage.includes('Permission denied')) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      )
    }
    
    if (errorMessage.includes('No access token found')) {
      return NextResponse.json(
        { error: 'Google Drive authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
