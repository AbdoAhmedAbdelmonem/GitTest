import { NextRequest, NextResponse } from "next/server";
import { getDriveClient } from "@/lib/google-service-account";

// Add a generic error handler to ensure we always return JSON
const handleError = (error: any) => {
  console.error("API Error:", error);
  
  const message = error.message || "Unknown error occurred";
  const details = error.response?.data?.error || {};
  const status = error.code || error.status || 500;
  
  return NextResponse.json(
    {
      error: message,
      details,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
};

export async function GET(request: NextRequest) {
  try {
    console.log("Drive API Route called");
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");
    const folderId = searchParams.get("fileId") || searchParams.get("folderId");
    const pageToken = searchParams.get("pageToken");
    
    console.log(`API params: action=${action}, fileId/folderId=${folderId}, pageToken=${pageToken || 'none'}`);
    
    if (!action || !folderId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    
    // Get Drive client with service account authorization
    const drive = await getDriveClient();
    
    if (action === "folderInfo") {
      try {
        console.log(`Fetching folder info for: ${folderId}`);
        
        const response = await drive.files.get({
          fileId: folderId,
          fields: "id,name,parents",
        });
        
        console.log("Folder info response:", response.data);
        return NextResponse.json(response.data);
      } catch (error) {
        return handleError(error);
      }
    }
    
    if (action === "folderContents") {
      try {
        console.log(`Fetching contents of folder: ${folderId}`);
        
        const response = await drive.files.list({
          q: `'${folderId}' in parents and trashed=false`,
          fields: "nextPageToken,files(id,name,mimeType,size,modifiedTime,createdTime,webViewLink,webContentLink,thumbnailLink,parents)",
          pageSize: 100,
          pageToken: pageToken || undefined,
        });
        
        console.log(`Retrieved ${response.data.files?.length || 0} files`);
        return NextResponse.json(response.data);
      } catch (error) {
        return handleError(error);
      }
    }
    
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return handleError(error);
  }
}