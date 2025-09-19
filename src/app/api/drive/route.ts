import { NextRequest, NextResponse } from 'next/server'
const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY
const GOOGLE_DRIVE_API_BASE = "https://www.googleapis.com/drive/v3"

export async function GET(request: NextRequest) {
  try {
    if (!GOOGLE_DRIVE_API_KEY) {
      return NextResponse.json({ error: 'Google Drive API key is not configured' }, { status: 500 })
    }
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'folderInfo') {
      const fileId = searchParams.get('fileId')
      if (!fileId) {
        return NextResponse.json({ error: 'File ID is required' }, { status: 400 })
      }

      const response = await fetch(
        `${GOOGLE_DRIVE_API_BASE}/files/${fileId}?` +
          new URLSearchParams({
            key: GOOGLE_DRIVE_API_KEY,
            fields: "id,name,parents",
          }),
      )

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch folder info: ${response.status}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    }
    
    if (action === 'folderContents') {
      const folderId = searchParams.get('folderId')
      const pageToken = searchParams.get('pageToken')
      
      if (!folderId) {
        return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 })
      }

      const params = new URLSearchParams({
        key: GOOGLE_DRIVE_API_KEY,
        q: `'${folderId}' in parents and trashed=false`,
        fields: "files(id,name,mimeType,size,modifiedTime,createdTime,owners,webViewLink,webContentLink,thumbnailLink,parents),nextPageToken",
        orderBy: "folder,modifiedTime desc",
        pageSize: "100",
      })

      if (pageToken) {
        params.append('pageToken', pageToken)
      }

      const response = await fetch(`${GOOGLE_DRIVE_API_BASE}/files?${params}`)

      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch folder contents: ${response.status}` },
          { status: response.status }
        )
      }

      const data = await response.json()
      return NextResponse.json(data)
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Drive API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
