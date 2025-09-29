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
  let file: File | null = null
  let userId: string = ''
  let parentFolderId: string = ''
  
  try {
    const formData = await request.formData()
    file = formData.get('file') as File
    userId = formData.get('userId') as string
    parentFolderId = formData.get('parentFolderId') as string
    
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

    // For large files, use streaming to avoid memory issues
    const fileSize = file.size
    console.log(`Uploading file: ${file.name} (${fileSize} bytes, ${(fileSize / (1024 * 1024)).toFixed(2)} MB)`)

    // Prepare file metadata
    const fileMetadata = {
      name: file.name,
      parents: parentFolderId ? [parentFolderId] : undefined,
    }

    let fileStream: Readable

    // For files larger than 10MB, use streaming to avoid memory issues
    if (fileSize > 10 * 1024 * 1024) {
      console.log('Using streaming upload for large file')
      // Create a readable stream from the file's web stream
      const webStream = file.stream()
      const reader = webStream.getReader()

      fileStream = new Readable({
        async read() {
          try {
            const { done, value } = await reader.read()
            if (done) {
              console.log('Stream reading completed for file:', file!.name)
              this.push(null)
            } else {
              console.log(`Read ${value.length} bytes from stream for file:`, file!.name)
              this.push(Buffer.from(value))
            }
          } catch (error) {
            console.error('Error reading from stream for file:', file!.name, error)
            this.destroy(error as Error)
          }
        }
      })
    } else {
      console.log('Using buffer upload for small file')
      // For smaller files, use buffer approach
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      fileStream = Readable.from(fileBuffer)
    }

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

    // Add timeout for large files (45 minutes for files over 100MB, 15 minutes for others)
    const timeoutMs = fileSize > 100 * 1024 * 1024 ? 45 * 60 * 1000 : 15 * 60 * 1000
    console.log(`Upload timeout set to ${timeoutMs / (60 * 1000)} minutes`)

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`Upload timeout after ${timeoutMs / (60 * 1000)} minutes`)), timeoutMs)
    })

    const response = await Promise.race([uploadPromise, timeoutPromise])
    
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
