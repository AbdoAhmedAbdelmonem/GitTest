import { NextRequest, NextResponse } from 'next/server'
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

export async function POST(request: NextRequest) {
  try {
    const { fileName, fileSize, mimeType, parentFolderId, authId } = await request.json()

    console.log('Generating upload URL for:', {
      fileName,
      fileSize,
      mimeType,
      parentFolderId,
      authId
    })

    if (!fileName || !authId) {
      return NextResponse.json(
        { error: 'File name and auth ID are required' },
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
        {
          error: 'Google Drive authentication required for your account. Please connect your Google Drive.',
          needsAuth: true
        },
        { status: 401 }
      )
    }

    console.log('🔑 TOKEN DEBUG - User', authId, 'getting access token:', {
      tokenLength: accessToken.length,
      tokenStart: accessToken.substring(0, 20) + '...',
      tokenEnd: '...' + accessToken.substring(accessToken.length - 20)
    })

    // Always use direct multipart upload to avoid server limits (Vercel, etc.)
    console.log(`File size: ${fileSize} bytes (${(fileSize / (1024 * 1024)).toFixed(2)} MB), using direct multipart upload method`)

    // For multipart uploads, use the standard Google Drive upload URL
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&supportsAllDrives=true`

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
