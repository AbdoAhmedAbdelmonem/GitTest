import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getValidAccessToken } from '@/lib/google-oauth'
import { google } from 'googleapis'
import type { drive_v3 } from 'googleapis'
import { Readable } from 'stream'

// Use Node.js runtime for file handling
export const runtime = 'nodejs'

// Configure for large file uploads
export const maxDuration = 300 // 5 minutes timeout
export const dynamic = 'force-dynamic'

// Check if user has admin access
async function checkAdminAccess(userId: number) {
  const supabase = createAdminClient()

  const { data: user, error } = await supabase
    .from('chameleons')
    .select('is_admin')
    .eq('user_id', userId)
    .single()

  if (error || !user) {
    console.log('No user found or error:', error)
    return { hasAccess: false, isAdmin: false }
  }

  // Check if admin is authorized (has Google tokens)
  const { data: adminData } = await supabase
    .from('admins')
    .select('authorized')
    .eq('user_id', userId)
    .single()

  console.log('User data from DB:', user, 'Admin data:', adminData)

  // User has admin access if they are admin AND authorized
  const hasAccess = user.is_admin && (adminData?.authorized || false)
  return { hasAccess, isAdmin: user.is_admin }
}

export async function POST(request: NextRequest) {
  let file: File | null = null
  let userId: string = ''
  let parentFolderId: string = ''

  try {
    // Increase timeout for large file processing
    request.signal?.addEventListener('abort', () => {
      console.log('Request aborted by client')
    })

    // Try to parse FormData, but handle large files differently
    try {
      const formData = await request.formData()
      file = formData.get('file') as File
      userId = formData.get('userId') as string
      parentFolderId = formData.get('parentFolderId') as string
    } catch (formDataError) {
      console.log('FormData parsing failed, this might be due to large file size:', formDataError)
      // If FormData parsing fails, try to extract from request body directly
      // This is a fallback for very large files
      return NextResponse.json(
        { error: 'File too large for standard upload. Please use a smaller file or contact support.' },
        { status: 413 }
      )
    }

    console.log('Server-side upload request:', {
      fileName: file?.name,
      fileSize: file?.size,
      fileSizeMB: file?.size ? (file.size / (1024 * 1024)).toFixed(2) : 'unknown',
      fileType: file?.type,
      parentFolderId,
      userId,
      contentLength: request.headers.get('content-length'),
      contentType: request.headers.get('content-type')
    })

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and user ID are required' },
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

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
    oauth2Client.setCredentials({ access_token: accessToken })

    const drive = google.drive({ version: 'v3', auth: oauth2Client })

    // For large files, use streaming to avoid memory issues
    const fileSize = file.size
    console.log(`Uploading file: ${file.name} (${fileSize} bytes, ${(fileSize / (1024 * 1024)).toFixed(2)} MB)`)

    // Prepare file metadata
    const fileMetadata = {
      name: file.name,
      parents: parentFolderId ? [parentFolderId] : undefined,
    }

    // Add timeout for large files (45 minutes for files over 100MB, 15 minutes for others)
    const timeoutMs = fileSize > 100 * 1024 * 1024 ? 45 * 60 * 1000 : 15 * 60 * 1000
    console.log(`Upload timeout set to ${timeoutMs / (60 * 1000)} minutes`)

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Upload timeout after ${timeoutMs / (60 * 1000)} minutes`)), timeoutMs)
    })

    // Use simple upload for all files (reliable and handles large files well)
    console.log('Using simple upload for file')

    // Convert file to a readable stream for Google Drive API
    console.log('Converting file to buffer and stream...')
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    console.log(`File buffer created: ${fileBuffer.length} bytes`)

    const fileStream = Readable.from(fileBuffer)
    console.log('File stream created successfully')

    // Upload file to Google Drive
    console.log('Initiating Google Drive upload...')
    const uploadPromise = drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type,
        body: fileStream,
      },
      fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink',
      supportsAllDrives: true,
    })

    const response = await Promise.race([uploadPromise, timeoutPromise])

    console.log('Google Drive upload completed successfully:', {
      fileId: (response as { data: drive_v3.Schema$File }).data.id,
      fileName: (response as { data: drive_v3.Schema$File }).data.name,
      fileSize: (response as { data: drive_v3.Schema$File }).data.size
    })

    return NextResponse.json({
      success: true,
      data: (response as { data: drive_v3.Schema$File }).data
    })

  } catch (error) {
    console.error('Error uploading file to Google Drive:', {
      error,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      fileName: file?.name,
      fileSize: file?.size,
      fileSizeMB: file?.size ? (file.size / (1024 * 1024)).toFixed(2) : 'unknown',
      userId,
      parentFolderId
    })

    const errorObj = error instanceof Error ? error : new Error('Unknown error occurred')
    let errorMessage = errorObj.message

    // Provide more specific error messages for common issues
    if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
      errorMessage = `Upload timeout. File size ${(file?.size ? (file.size / (1024 * 1024)).toFixed(2) : 'unknown')} MB may be too large or network connection is slow.`
    } else if (errorMessage.includes('memory') || errorMessage.includes('out of memory')) {
      errorMessage = `Memory error during upload. File size ${(file?.size ? (file.size / (1024 * 1024)).toFixed(2) : 'unknown')} MB is too large for current memory limits.`
    } else if (errorMessage.includes('quota') || errorMessage.includes('storage')) {
      errorMessage = 'Google Drive storage quota exceeded.'
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('quota exceeded')) {
      errorMessage = 'Google Drive API rate limit exceeded. Please wait and try again.'
    }

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
