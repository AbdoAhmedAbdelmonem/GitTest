const credentials = {
  web: {
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
    redirect_uris: ["http://localhost:3000/api/auth/callback/google"],
  }
};

/**
 * @typedef {Object} GoogleDriveAuth
 * @property {string} access_token
 * @property {number} expires_at
 */

/** @type {GoogleDriveAuth|null} */
let authToken = null;

export async function getGoogleDriveAccessToken() {
  // Check if we have a valid cached token
  if (authToken && authToken.expires_at > Date.now()) {
    return authToken.access_token
  }

  try {
    // Get new access token using client credentials
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: credentials.web.client_id,
        client_secret: credentials.web.client_secret,
        scope: "https://www.googleapis.com/auth/drive",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to get access token")
    }

    const data = await response.json()

    // Cache the token (expires in 1 hour)
    authToken = {
      access_token: data.access_token,
      expires_at: Date.now() + data.expires_in * 1000,
    }

    return data.access_token
  } catch (error) {
    console.error("Error getting Google Drive access token:", error)
    throw error
  }
}

export async function uploadFileToDrive(file, parentId) {
  const accessToken = await getGoogleDriveAccessToken()

  const metadata = {
    name: file.name,
    parents: [parentId],
  }

  const form = new FormData()
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }))
  form.append("file", file)

  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form,
  })

  if (!response.ok) {
    throw new Error("Failed to upload file")
  }

  return response.json()
}

export async function deleteFileFromDrive(fileId) {
  const accessToken = await getGoogleDriveAccessToken()

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to delete file")
  }
}

export async function renameFileInDrive(fileId, newName) {
  const accessToken = await getGoogleDriveAccessToken()

  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: newName,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to rename file")
  }

  return response.json()
}
