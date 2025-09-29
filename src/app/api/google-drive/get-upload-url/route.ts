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

    // Always use direct multipart upload to avoid server limits (Vercel, etc.)
    console.log(`File size: ${fileSize} bytes (${(fileSize / (1024 * 1024)).toFixed(2)} MB), using direct multipart upload method`)

    // For multipart uploads, we don't need to initiate a session - just return the upload URL
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`

    console.log('Using multipart upload URL:', uploadUrl)

    return NextResponse.json({
      success: true,
      uploadMethod: 'direct',
      uploadUrl: uploadUrl,
      accessToken: accessToken,
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
