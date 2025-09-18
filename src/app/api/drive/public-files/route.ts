import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageSize = parseInt(searchParams.get('pageSize') || '20')
    const pageToken = searchParams.get('pageToken')
    const folderId = searchParams.get('folderId')
    const fileId = searchParams.get('fileId')
    const type = searchParams.get('type') // 'info' for single file info
    
    // Use API key for public access (no authentication required)
    const drive = google.drive({ 
      version: 'v3', 
      auth: process.env.GOOGLE_DRIVE_API_KEY 
    })

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
    console.error('Error listing public drive files:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    
    // If it's a permission error, fall back to the authenticated API
    if (errorMessage.includes('permission') || errorMessage.includes('access')) {
      return NextResponse.json(
        { error: 'This content requires authentication. Please contact an administrator.' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}