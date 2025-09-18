// lib/secure-drive-urls.ts

import { createSecureDriveUrl as createHashedUrl } from './drive-mapping'

// Generate a secure URL for internal navigation
export function createSecureDriveUrl(driveId: string, folderPath?: string): string | null {
  return createHashedUrl(driveId, folderPath)
}

// Generate a shareable URL (same as secure URL for now)
export function createShareableUrl(driveId: string, folderPath?: string): string | null {
  return createHashedUrl(driveId, folderPath)
}

// Validate if a URL uses secure hashes
export function isSecureUrl(url: string): boolean {
  const urlPath = url.startsWith('/') ? url : new URL(url).pathname
  const pathParts = urlPath.split('/').filter(Boolean)
  
  if (pathParts[0] !== 'drive' || !pathParts[1]) return false
  
  // Check if the drive parameter looks like a hash (12 characters)
  const driveParam = pathParts[1]
  return driveParam.length === 12 && /^[a-f0-9]+$/.test(driveParam)
}