// lib/drive-mapping.ts

import * as crypto from 'crypto'
import { departmentData } from './department-data'

// Secret key for hashing (in production, move this to environment variables)
const HASH_SECRET = process.env.DRIVE_HASH_SECRET || 'XYZ123!@#_CHANGE_ME'

// Function to extract all drive folder IDs from department data
function extractDriveIdsFromDepartmentData(): Set<string> {
  const driveIds = new Set<string>()

  for (const department of Object.values(departmentData)) {
    for (const level of Object.values(department.levels)) {
      for (const term of Object.values(level.subjects)) {
        for (const subject of term) {
          // Extract drive IDs from all material fields
          const materials = subject.materials
          const materialFields = [materials.lectures, materials.sections, materials.summaries, materials.exams]

          // Handle videos field which can be string or array
          if (materials.videos) {
            if (Array.isArray(materials.videos)) {
              materialFields.push(...materials.videos)
            } else {
              materialFields.push(materials.videos)
            }
          }

          for (const field of materialFields) {
            if (field && typeof field === 'string' && field.includes('drive.google.com/drive/folders/')) {
              // Extract drive ID from URL
              const match = field.match(/\/folders\/([^/?]+)/)
              if (match && match[1]) {
                driveIds.add(match[1])
              }
            }
          }
        }
      }
    }
  }

  return driveIds
}

// Function to extract all YouTube playlist IDs from department data
function extractYouTubeIdsFromDepartmentData(): Set<string> {
  const youtubeIds = new Set<string>()

  for (const department of Object.values(departmentData)) {
    for (const level of Object.values(department.levels)) {
      for (const term of Object.values(level.subjects)) {
        for (const subject of term) {
          // Extract YouTube IDs from videos field
          const materials = subject.materials
          if (materials.videos) {
            const videos = Array.isArray(materials.videos) ? materials.videos : [materials.videos]
            for (const video of videos) {
              if (video && typeof video === 'string' && video.includes('youtube.com/playlist')) {
                // Extract playlist ID from URL
                const match = video.match(/[?&]list=([^#\&\?]*)/)
                if (match && match[1]) {
                  youtubeIds.add(match[1])
                }
              }
            }
          }
        }
      }
    }
  }

  return youtubeIds
}

// Whitelist of valid drive IDs that are allowed to be accessed
const validDriveIds = extractDriveIdsFromDepartmentData()

// Whitelist of valid YouTube playlist IDs
export const validYouTubeIds = extractYouTubeIdsFromDepartmentData()

// Simple hash function for basic obfuscation
function createSimpleHash(input: string): string {
  return crypto.createHash('md5').update(input + HASH_SECRET).digest('hex').substring(0, 12)
}

// Create a mapping registry for drive IDs to simple hashes
const driveIdToHashMap = new Map<string, string>()
const hashToDriveIdMap = new Map<string, string>()

// Initialize the mapping for whitelisted drive IDs
for (const driveId of Array.from(validDriveIds)) {
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

// Check if a string is a valid YouTube playlist ID
export function isValidYouTubeId(id: string): boolean {
  return validYouTubeIds.has(id)
}

// Check if a URL is a valid drive or YouTube link
export function isValidLink(url: string): boolean {
  // Check if it's a drive link
  if (url.includes('drive.google.com/drive/folders/')) {
    const match = url.match(/\/folders\/([^/?]+)/)
    if (match && match[1]) {
      return isValidDriveId(match[1])
    }
  }
  
  // Check if it's a YouTube playlist link
  if (url.includes('youtube.com/playlist')) {
    const match = url.match(/[?&]list=([^#\&\?]*)/)
    if (match && match[1]) {
      return isValidYouTubeId(match[1])
    }
  }
  
  return false
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
