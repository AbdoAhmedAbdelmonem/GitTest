import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/client'
import { getValidAccessToken } from '@/lib/google-oauth'

// Check if user has admin access
async function checkAdminAccess(userId: number) {
  const supabase = createClient()

  const { data: user, error } = await supabase
    .from('chameleons')
    .select('is_admin, Authorized')
    .eq('user_id', userId)
    .single()

  if (error || !user) {
    console.log('No user found or error:', error)
    return { hasAccess: false, isAdmin: false }
  }

  console.log('User data from DB:', user)

  // User has admin access if they are admin AND authorized
  const hasAccess = user.is_admin && user.Authorized
  return { hasAccess, isAdmin: user.is_admin }
}

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileSize, mimeType, parentFolderId, userId } = await request.json()

    console.log('Generating upload URL for:', {
      fileName,
      fileSize,
      mimeType,
      parentFolderId,
      userId
    })

    if (!fileName || !userId) {
      return NextResponse.json(
        { error: 'File name and user ID are required' },
        { status: 400 }
      )
    }

    // Check if user has admin access
    const { hasAccess } = await checkAdminAccess(parseInt(userId))

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Admin authorization required.' },
        { status: 403 }
      )
    }

    // Get valid access token for the user
    const accessToken = await getValidAccessToken(parseInt(userId))
    if (!accessToken) {
      return NextResponse.json(
        {
          error: 'Google Drive authentication required for your account. Please connect your Google Drive.',
          needsAuth: true
        },
        { status: 401 }
      )
    }

    console.log('Got access token, length:', accessToken.length, 'starts with:', accessToken.substring(0, 10) + '...')

    // Initiate resumable upload session using Google Drive API
    // We need to make a direct HTTP request to get the proper session URL
    const metadata = {
      name: fileName,
      ...(parentFolderId && { parents: [parentFolderId] })
    }

    console.log('Initiating resumable upload with metadata:', metadata)

    // For server-side proxy upload to avoid CORS issues
    // Return info needed for server-side upload
    console.log('Preparing server-side proxy upload info')

    return NextResponse.json({
      success: true,
      uploadMethod: 'server-proxy',
      fileMetadata: {
        name: fileName,
        size: fileSize,
        mimeType: mimeType,
        parents: parentFolderId ? [parentFolderId] : undefined
      }
    })

  } catch (error) {
    console.error('Error generating upload URL:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'

    if (errorMessage.includes('No access token found') || errorMessage.includes('invalid_grant')) {
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
