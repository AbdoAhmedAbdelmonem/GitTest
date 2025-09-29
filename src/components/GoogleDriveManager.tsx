"use client"

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  File, 
  Upload, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Shield, 
  AlertCircle,
  Loader2,
  FolderOpen,
  Image as ImageIcon,
  FileText,
  Video,
  Music
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useUpload } from '@/components/upload-context'

interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  createdTime: string
  modifiedTime: string
  webViewLink: string
  thumbnailLink?: string
}

interface GoogleDriveManagerProps {
  userId?: number
  isAdmin?: boolean
  folderId?: string // Optional folder ID to work with specific folder
  currentFolderId?: string // Alternative prop name for current folder
  onFilesChange?: () => void // Callback when files change
  showTitle?: boolean // Whether to show the title
}

export function GoogleDriveManager({ 
  userId, 
  isAdmin = false, 
  folderId, 
  currentFolderId, 
  onFilesChange, 
  showTitle = true 
}: GoogleDriveManagerProps) {
  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [renamingFileId, setRenamingFileId] = useState<string | null>(null)
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
  const [hasGoogleAccess, setHasGoogleAccess] = useState<boolean | null>(null)
  const [autoAuthInProgress, setAutoAuthInProgress] = useState(false)

  // Get user session if userId not provided
  const [currentUserId, setCurrentUserId] = useState<number | null>(userId || null)
  const [currentIsAdmin, setCurrentIsAdmin] = useState<boolean>(isAdmin)

  useEffect(() => {
    if (!userId) {
      // Get from session storage
      import('@/lib/auth').then(({ getStudentSession }) => {
        const session = getStudentSession()
        if (session) {
          setCurrentUserId(session.user_id)
          // For now, just check is_admin to allow debugging
          // TODO: Add back Authorized check once OAuth is properly set up
          setCurrentIsAdmin(session.is_admin || false)
        }
      })
    }
  }, [userId])

  // Use the effective folder ID
  const effectiveFolderId = currentFolderId || folderId

  // Load user's Google Drive files
  const loadFiles = useCallback(async () => {
    if (!currentUserId) return

    setLoading(true)
    setError(null)

    try {
      let url = `/api/google-drive/files?userId=${currentUserId}&pageSize=20`
      if (effectiveFolderId) {
        url += `&folderId=${effectiveFolderId}`
      }

      const response = await fetch(url)
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to load files')
      }

      setFiles(result.files || [])
      if (onFilesChange) onFilesChange()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files')
    } finally {
      setLoading(false)
    }
  }, [currentUserId, effectiveFolderId, onFilesChange])

  const { uploadFile: uploadFileContext } = useUpload()

  // Upload file to Google Drive (Admin only) - now using direct upload
  const uploadFile = async () => {
    if (!selectedFile || !currentIsAdmin || !currentUserId) return

    setUploading(true)
    setError(null)

    try {
      await uploadFileContext(selectedFile, effectiveFolderId || 'root', currentUserId.toString(), async () => {
        // Reload files after successful upload
        await loadFiles()
      })

      setSelectedFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file')
    } finally {
      setUploading(false)
    }
  }

  // Check if user has Google Drive access
  const checkGoogleAccess = useCallback(async () => {
    if (!currentUserId) return false

    try {
      const response = await fetch(`/api/google-drive/check-access?userId=${currentUserId}`)
      const result = await response.json()

      if (response.ok) {
        setHasGoogleAccess(result.hasAccess)
        return result.hasAccess
      } else {
        setHasGoogleAccess(false)
        return false
      }
    } catch (err) {
      console.error('Error checking Google access:', err)
      setHasGoogleAccess(false)
      return false
    }
  }, [currentUserId])

  // Auto-authorize Google Drive (Admin only)
  const autoAuthorizeGoogleDrive = useCallback(async () => {
    if (!currentIsAdmin || !currentUserId) return

    setAutoAuthInProgress(true)

    try {
      const response = await fetch(`/api/google-drive/auth?userId=${currentUserId}`, {
        method: 'GET'
      })

      const result = await response.json()

      if (response.ok && result.authUrl) {
        // Redirect to Google OAuth for automatic authorization
        window.location.href = result.authUrl
      } else {
        throw new Error(result.error || 'Failed to initiate auto-authorization')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to auto-authorize Google Drive')
      setAutoAuthInProgress(false)
    }
  }, [currentIsAdmin, currentUserId])

  // Manual authorize Google Drive (Non-admin users)
  const authorizeGoogleDrive = async () => {
    if (!currentUserId) return
    
    try {
      const response = await fetch(`/api/google-drive/auth?userId=${currentUserId}`, {
        method: 'GET'
      })
      
      const result = await response.json()
      
      if (response.ok && result.authUrl) {
        window.location.href = result.authUrl
      } else {
        throw new Error(result.error || 'Failed to get authorization URL')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to authorize Google Drive')
    }
  }

  // Rename file (Admin only)
  const renameFile = async (fileId: string, currentName: string) => {
    if (!currentIsAdmin || !currentUserId) return
    
    const newName = prompt('Enter new filename:', currentName)
    if (!newName || newName === currentName) return
    
    setRenamingFileId(fileId)
    setError(null)
    
    try {
      const response = await fetch(`/api/google-drive/rename/${fileId}?userId=${currentUserId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to rename file')
      }
      
      // Reload files after successful rename
      await loadFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename file')
    } finally {
      setRenamingFileId(null)
    }
  }

  // Delete file (Admin only)
  const deleteFile = async (fileId: string, fileName: string) => {
    if (!currentIsAdmin || !currentUserId) return
    
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return
    
    setDeletingFileId(fileId)
    setError(null)
    
    try {
      const response = await fetch(`/api/google-drive/delete/${fileId}?userId=${currentUserId}`, {
        method: 'DELETE'
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete file')
      }
      
      // Reload files after successful deletion
      await loadFiles()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete file')
    } finally {
      setDeletingFileId(null)
    }
  }

  // Get file icon based on mimeType
  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-400" />
    if (mimeType.startsWith('video/')) return <Video className="w-5 h-5 text-purple-400" />
    if (mimeType.startsWith('audio/')) return <Music className="w-5 h-5 text-green-400" />
    if (mimeType.includes('text') || mimeType.includes('document')) return <FileText className="w-5 h-5 text-yellow-400" />
    return <File className="w-5 h-5 text-gray-400" />
  }

  // Format file size
  const formatFileSize = (bytes?: string) => {
    if (!bytes) return 'Unknown'
    const size = parseInt(bytes)
    if (size === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(size) / Math.log(k))
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Initialize component
  useEffect(() => {
    const initializeComponent = async () => {
      if (!currentUserId) return

      // For admin users, check Google Drive access and auto-authorize if needed
      if (currentIsAdmin) {
        const hasAccess = await checkGoogleAccess()
        if (!hasAccess) {
          // Auto-authorize Google Drive for admin users
          await autoAuthorizeGoogleDrive()
          return // Don't load files yet, will happen after OAuth redirect
        }
      } else {
        // For regular users, just check access
        await checkGoogleAccess()
      }

      // Load files if user has access
      if (hasGoogleAccess !== false) {
        loadFiles()
      }
    }

    if (currentUserId) {
      initializeComponent()
    }
  }, [currentUserId, currentIsAdmin, hasGoogleAccess, autoAuthorizeGoogleDrive, checkGoogleAccess, loadFiles])

  if (!currentUserId) {
    return (
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60">Please log in to access Google Drive</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {showTitle && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Google Drive Manager</h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            {currentIsAdmin 
              ? "Full admin access to upload, update, delete, and manage files in Google Drive."
              : "Read-only access to view Google Drive files."
            }
          </p>
        </motion.div>
      )}

      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Google Drive Integration</CardTitle>
                <CardDescription className="text-white/60 mt-2">
                  {currentIsAdmin 
                    ? "Full admin access: upload, update, delete, and manage files" 
                    : "Read-only access to view Google Drive files"
                  }
                </CardDescription>
              </div>
            </div>
            {currentIsAdmin && (
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Admin Access
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="bg-red-500/10 border-red-500/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {/* Authorization Status */}
          {currentIsAdmin ? (
            <Card className="bg-blue-500/10 border-blue-500/20">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    hasGoogleAccess === null ? "bg-yellow-400" :
                    hasGoogleAccess ? "bg-green-400" : "bg-blue-400"
                  }`}></div>
                  <div>
                    <p className={`font-medium ${
                      hasGoogleAccess ? "text-green-300" : "text-blue-300"
                    }`}>
                      {hasGoogleAccess === null ? "Checking Google Drive Access..." :
                       hasGoogleAccess ? "Google Drive Connected" : 
                       autoAuthInProgress ? "Auto-Authorizing..." : "Authorization Required"}
                    </p>
                    <p className="text-xs text-white/60">
                      {hasGoogleAccess 
                        ? "Ready to manage files" 
                        : autoAuthInProgress 
                          ? "Redirecting to Google for automatic authorization..."
                          : "Admin users get automatic access"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            !hasGoogleAccess && hasGoogleAccess !== null && (
              <Card className="bg-yellow-500/10 border-yellow-500/20">
                <CardContent className="pt-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div>
                      <p className="font-medium text-yellow-300">Manual Authorization Required</p>
                      <p className="text-xs text-white/60">
                        Click the button below to authorize Google Drive access.
                      </p>
                    </div>
                  </div>
                  <Button onClick={authorizeGoogleDrive} variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                    Authorize Google Drive Access
                  </Button>
                </CardContent>
              </Card>
            )
          )}

          {/* File Upload (Admin Only) */}
          {currentIsAdmin && hasGoogleAccess && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Upload File</h3>
              <div className="flex space-x-3">
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  disabled={uploading}
                  className="text-white bg-white/5 border-white/20"
                />
                <Button
                  onClick={uploadFile}
                  disabled={!selectedFile || uploading}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Refresh Files Button */}
          <Button 
            onClick={loadFiles} 
            disabled={loading} 
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Loading...' : 'Refresh Files'}
          </Button>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">
            {effectiveFolderId ? 'Folder Contents' : 'Your Google Drive Files'}
          </CardTitle>
          <CardDescription className="text-white/60">
            {loading ? 'Loading...' : `${files.length} file(s) found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-white/40 mx-auto mb-4 animate-spin" />
              <p className="text-white/60">Loading files...</p>
            </div>
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">No files found</h3>
              <p className="text-white/60 mb-4">
                {currentIsAdmin ? "Upload some files to get started!" : "No files available in this location."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="flex-shrink-0">
                        {file.thumbnailLink ? (
                          <Image
                            src={file.thumbnailLink}
                            alt={file.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded border border-white/10"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                            {getFileIcon(file.mimeType)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{file.name}</p>
                        <p className="text-sm text-white/60">
                          {formatFileSize(file.size)} • Modified {formatDate(file.modifiedTime)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => window.open(file.webViewLink, '_blank')}
                        variant="outline"
                        size="sm"
                        className="text-white border-white/20 hover:bg-white/10"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {currentIsAdmin && (
                        <>
                          <Button
                            onClick={() => renameFile(file.id, file.name)}
                            variant="outline"
                            size="sm"
                            disabled={renamingFileId === file.id}
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            {renamingFileId === file.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Edit2 className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            onClick={() => deleteFile(file.id, file.name)}
                            variant="destructive"
                            size="sm"
                            disabled={deletingFileId === file.id}
                            className="bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30"
                          >
                            {deletingFileId === file.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


