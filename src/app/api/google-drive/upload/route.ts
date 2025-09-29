import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/client'
import { getValidAccessToken } from '@/lib/google-oauth'
import { Readable } from 'stream'
import type { drive_v3 } from 'googleapis'

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
    const formData = await request.formData()
    const file = formData.get('file') as File
    const userId = formData.get('userId') as string
    const parentFolderId = formData.get('parentFolderId') as string
    
    console.log('Upload request received:', {
      hasFile: !!file,
      fileType: typeof file,
      fileName: file?.name,
      fileSize: file?.size,
      userId,
      parentFolderId,
      formDataKeys: Array.from(formData.keys())
    })
    
    if (!file) {
      console.error('File validation failed:', {
        file,
        typeofFile: typeof file,
        formDataEntries: Array.from(formData.entries()).map(([key, value]) => ({
          key,
          valueType: typeof value,
          isFile: value instanceof File,
          fileName: value instanceof File ? value.name : 'N/A'
        }))
      })
      return NextResponse.json(
        { error: 'File not found: ' + typeof file },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
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

    // Get valid access token for the user - no token sharing
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

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // For large files, process in chunks to avoid memory issues
    const fileSize = file.size
    console.log(`Uploading file: ${file.name} (${fileSize} bytes)`)

    // Prepare file metadata
    const fileMetadata = {
      name: file.name,
      parents: parentFolderId ? [parentFolderId] : undefined,
    }

    // Convert file to buffer for upload
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileStream = Readable.from(fileBuffer)

    // Upload file to Google Drive
    const uploadPromise = drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type,
        body: fileStream,
      },
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink',
      supportsAllDrives: true,
    })

    // Add timeout for large files (30 minutes for files over 100MB)
    const timeoutMs = fileSize > 100 * 1024 * 1024 ? 30 * 60 * 1000 : 10 * 60 * 1000

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Upload timeout')), timeoutMs)
    })

    const response = await Promise.race([uploadPromise, timeoutPromise])
    
    return NextResponse.json({
      success: true,
      data: (response as { data: drive_v3.Schema$File }).data
    })
    
  } catch (error) {
    console.error('Error uploading file to Google Drive:', error)
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
