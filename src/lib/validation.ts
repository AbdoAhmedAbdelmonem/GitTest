import { z } from 'zod'

/**
 * Input Validation Schemas
 * 
 * Prevents injection attacks, malformed data, and validates business logic.
 * All API inputs should be validated against these schemas.
 */

// Common validators
export const authIdSchema = z.string().uuid()
export const emailSchema = z.string().email().max(255)
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
export const usernameSchema = z.string().min(3).max(50).regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, dashes and underscores')

// Auth schemas
export const loginSchema = z.object({
  phoneNumber: phoneSchema,
  email: emailSchema.optional(),
})

export const signupSchema = z.object({
  username: usernameSchema,
  phoneNumber: phoneSchema,
  email: emailSchema,
  specialization: z.string().min(1).max(100),
  age: z.number().int().min(13).max(120),
  currentLevel: z.number().int().min(0).max(6),
})

export const passwordResetSchema = z.object({
  email: emailSchema,
})

// Google Drive schemas
export const fileIdSchema = z.string().min(1).max(200).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid file ID')
export const folderIdSchema = z.string().min(1).max(200).regex(/^[a-zA-Z0-9_-]+$/, 'Invalid folder ID')

export const fileUploadSchema = z.object({
  fileName: z.string().min(1).max(255).regex(/^[^<>:"|?*\x00-\x1F]+$/, 'Invalid file name'),
  fileSize: z.number().int().positive().max(100 * 1024 * 1024), // 100MB max
  mimeType: z.string().regex(/^[a-z]+\/[a-z0-9\-\+\.]+$/i, 'Invalid MIME type'),
  parentFolderId: folderIdSchema.optional(),
})

export const createFolderSchema = z.object({
  folderName: z.string().min(1).max(255).regex(/^[^<>:"|?*\x00-\x1F]+$/, 'Invalid folder name'),
  parentFolderId: folderIdSchema.optional(),
})

export const renameFileSchema = z.object({
  fileId: fileIdSchema,
  newName: z.string().min(1).max(255).regex(/^[^<>:"|?*\x00-\x1F]+$/, 'Invalid file name'),
})

export const searchFoldersSchema = z.object({
  folderName: z.string().min(1).max(255),
  parentFolderId: folderIdSchema.optional(),
})

export const getFilesSchema = z.object({
  folderId: folderIdSchema.optional(),
  fileId: fileIdSchema.optional(),
  pageSize: z.number().int().positive().max(100).default(20),
  pageToken: z.string().optional(),
  type: z.enum(['info', 'list']).optional(),
})

// Allowed file types for uploads (whitelist approach)
export const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'text/csv',
  
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  
  // Videos
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
  
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  
  // Archives (be careful with these)
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  
  // Code files
  'text/html',
  'text/css',
  'text/javascript',
  'application/json',
  'application/xml',
]

// Dangerous file extensions (blacklist approach - secondary check)
export const BLOCKED_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar',
  '.msi', '.dll', '.sys', '.drv', '.bin', '.sh', '.app', '.deb', '.rpm',
  '.apk', '.ipa', '.dmg', '.pkg', '.ps1', '.psm1', '.vb', '.reg',
]

/**
 * Validate file upload
 */
export function validateFileUpload(fileName: string, mimeType: string, fileSize: number) {
  // Check file size (100MB max)
  if (fileSize > 100 * 1024 * 1024) {
    return { valid: false, error: 'File size exceeds 100MB limit' }
  }

  // Check MIME type whitelist
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return { valid: false, error: `File type ${mimeType} is not allowed` }
  }

  // Check file extension blacklist
  const extension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
  if (BLOCKED_EXTENSIONS.includes(extension)) {
    return { valid: false, error: `File extension ${extension} is not allowed for security reasons` }
  }

  // Check for suspicious file names
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return { valid: false, error: 'File name contains invalid characters' }
  }

  // Additional checks for specific file types
  if (mimeType.startsWith('text/html') || mimeType === 'text/javascript') {
    console.warn(`⚠️ Uploading potentially dangerous file type: ${mimeType} - ${fileName}`)
  }

  return { valid: true }
}

/**
 * Sanitize user input (remove potential XSS)
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validate and parse query parameters safely
 */
export function safeParseInt(value: string | null, defaultValue: number = 0): number {
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Check if string contains SQL injection patterns
 */
export function detectSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(UNION.*SELECT)/gi,
    /(;.*--)/g,
    /('.*OR.*'.*=.*')/gi,
    /(--.*)/g,
    /(\bOR\b.*\d+.*=.*\d+)/gi,
  ]

  return sqlPatterns.some(pattern => pattern.test(input))
}

/**
 * Validate request origin (CSRF protection)
 */
export function validateOrigin(request: Request, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  
  if (!origin && !referer) {
    // Allow requests without origin (could be same-origin or API clients)
    return true
  }

  const requestOrigin = origin || new URL(referer!).origin
  
  return allowedOrigins.some(allowed => {
    if (allowed === '*') return true
    if (allowed.includes('*')) {
      const regex = new RegExp('^' + allowed.replace('*', '.*') + '$')
      return regex.test(requestOrigin)
    }
    return requestOrigin === allowed
  })
}
