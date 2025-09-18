// lib/drive-mapping.ts

import * as crypto from 'crypto'

// Secret key for hashing (in production, move this to environment variables)
const HASH_SECRET = process.env.DRIVE_HASH_SECRET || 'your-secret-hash-key-change-in-production'

// Whitelist of valid drive IDs that are allowed to be accessed
export const validDriveIds = new Set([
  '1yFYYS37ERUHG6Ft_HnC17Jmgo-Zsrg06', // Add your actual drive IDs here
  '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  '1rZnj9CMp6aLsOBx_AL93l81MF9e6ds3p', // Add more drive IDs as discovered
  '1zE-aRw1YdGWcu3XirpJ9fni9htp9WslZ',
  '19wUQclQIsYucELwsw5gd0yKA83qwXDrg'
  // Add more valid drive IDs as needed
])

// Simple hash function for basic obfuscation
function createSimpleHash(input: string): string {
  return crypto.createHash('md5').update(input + HASH_SECRET).digest('hex').substring(0, 12)
}

// Create a mapping registry for drive IDs to simple hashes
const driveIdToHashMap = new Map<string, string>()
const hashToDriveIdMap = new Map<string, string>()

// Initialize the mapping for whitelisted drive IDs
for (const driveId of validDriveIds) {
  const hash = createSimpleHash(driveId)
  driveIdToHashMap.set(driveId, hash)
  hashToDriveIdMap.set(hash, driveId)
}

// Convert drive ID to hash
export function driveIdToHash(driveId: string): string | null {
  return driveIdToHashMap.get(driveId) || null
}

// Convert hash back to drive ID
export function hashToDriveId(hash: string): string | null {
  return hashToDriveIdMap.get(hash) || null
}

// Check if a string is a valid drive ID
export function isValidDriveId(id: string): boolean {
  return validDriveIds.has(id)
}

// Check if a string is a valid hash
export function isValidHash(hash: string): boolean {
  return hashToDriveIdMap.has(hash)
}

// Get the actual drive ID from URL parameter (could be hash or drive ID)
export function resolveActualDriveId(urlParam: string): string | null {
  // First check if it's a valid hash
  if (isValidHash(urlParam)) {
    return hashToDriveId(urlParam)
  }
  
  // Then check if it's a valid drive ID
  if (isValidDriveId(urlParam)) {
    return urlParam
  }
  
  // Neither valid hash nor valid drive ID
  return null
}

// For backwards compatibility with secure URLs, create simple hashed versions
export function createSecureDriveUrl(driveId: string, folderPath?: string): string | null {
  const hash = driveIdToHash(driveId)
  if (!hash) return null
  
  let url = `/drive/${hash}`
  if (folderPath) {
    url += `/${folderPath}`
  }
  
  return url
}

// Generate a shareable URL with hashed drive ID
export function createShareableUrl(driveId: string, folderPath?: string): string | null {
  return createSecureDriveUrl(driveId, folderPath)
}
