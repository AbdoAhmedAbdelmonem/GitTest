import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/client'
import { getValidAccessToken } from '@/lib/google-oauth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const pageToken = searchParams.get('pageToken')
    const folderId = searchParams.get('folderId')
    const fileId = searchParams.get('fileId')
    const type = searchParams.get('type') // 'info' for single file info
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get valid access token for the user (no authorization check for viewing)
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

    // Handle single file info request
    if (type === 'info' && fileId) {
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id, name, parents, mimeType, size, createdTime, modifiedTime, owners, webViewLink, webContentLink, thumbnailLink'
      })
      
      return NextResponse.json(response.data)
    }

    // Handle folder contents listing
    let query = 'trashed=false'
    if (folderId) {
      query += ` and '${folderId}' in parents`
    }

    const response = await drive.files.list({
      q: query,
      pageSize: pageSize,
      pageToken: pageToken || undefined,
      fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, owners, webViewLink, webContentLink, thumbnailLink, parents)',
      orderBy: 'folder,name'
    })
    
    return NextResponse.json({
      files: response.data.files || [],
      nextPageToken: response.data.nextPageToken
    })
    
  } catch (error) {
    console.error('Error listing Google Drive files:', error)
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
