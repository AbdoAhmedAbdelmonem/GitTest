"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  FolderPlus,
  Upload,
  Loader2,
  Shield,
  AlertCircle,
  CloudUpload,
  FileText,
  X,
} from "lucide-react"
import { useToast } from "@/components/ToastProvider"
import { useUpload } from "./upload-context"

interface CreateActionsProps {
  currentFolderId: string
  onFileCreated?: () => void
  userSession: { auth_id: string } | null
}

export function CreateActions({ currentFolderId, onFileCreated, userSession }: CreateActionsProps) {
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({})
  const [uploadedCount, setUploadedCount] = useState(0)
  const [folderName, setFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isAutoClosing, setIsAutoClosing] = useState(false)
  const [hasGoogleAuth, setHasGoogleAuth] = useState<boolean | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const { addToast } = useToast()
  const { uploadFile, uploads } = useUpload()

  // Set up upload refresh callback
  React.useEffect(() => {
    // This effect ensures the refresh callback is available for uploads
    // The actual callback setup happens in the upload context when uploadFile is called
  }, [onFileCreated])

  // Check if user has Google Drive authentication
  useEffect(() => {
    const checkAuthentication = async () => {
      if (!userSession?.auth_id) {
        setHasGoogleAuth(false)
        return
      }

      try {
        const response = await fetch(`/api/google-drive/check-access?authId=${userSession.auth_id}`)
        const result = await response.json()

        if (response.ok && result.hasAccess) {
          setHasGoogleAuth(true)
          setAuthError(null)
        } else {
          setHasGoogleAuth(false)
          setAuthError(result.error || 'Authentication required')
        }
      } catch (err) {
        console.error('Error checking authentication:', err)
        setHasGoogleAuth(false)
        setAuthError('Failed to check authentication status')
      }
    }

    checkAuthentication()
  }, [userSession?.auth_id])

  const handleAuthenticate = async () => {
    if (!userSession?.auth_id) return

    try {
      const response = await fetch('/api/google-drive/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authId: userSession.auth_id,
          isAdmin: true
        })
      })

      const result = await response.json()

      if (response.ok && result.data?.authUrl) {
        window.location.href = result.data.authUrl
      } else {
        throw new Error(result.error || 'Failed to get auth URL')
      }
    } catch (err) {
      console.error('Authentication error:', err)
      addToast('Failed to start authentication process', 'error')
    }
  }

  const handleCreateFolder = async () => {
    
    if (!folderName.trim()) {
      addToast("Please enter a folder name", "error")
      return
    }

    setIsCreatingFolder(true)
    try {
      const response = await fetch('/api/google-drive/create-folder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderName: folderName.trim(),
          parentFolderId: currentFolderId,
          authId: userSession?.auth_id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create folder')
      }

      await response.json()
      
      addToast(`Folder "${folderName}" created successfully`, "success")
      
      // Auto-refresh immediately after successful creation
      onFileCreated?.()
      
      // Show refresh message and auto-close
      setIsAutoClosing(true)
      setTimeout(() => {
        setFolderName("")
        setShowCreateFolder(false)
        setIsAutoClosing(false)
      }, 1000)
    } catch (error) {
      console.error('Error creating folder:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create folder'
      
      // Check if it's an authentication error
      if (errorMessage.includes('authentication') || errorMessage.includes('auth')) {
        setHasGoogleAuth(false)
        setAuthError('Google Drive authentication required')
        addToast('Authentication required. Please connect your Google Drive.', "error")
      } else {
        addToast(errorMessage, "error")
      }
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!file || !userSession?.auth_id) return

    try {
      await uploadFile(file, currentFolderId, userSession.auth_id, () => {
        // Auto-refresh immediately after successful upload
        onFileCreated?.()
      })
      // The upload context will handle progress and notifications
    } catch (error) {
      console.error('Error initiating upload:', error)
      // Error handling is done in the upload context
    }
  }

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      setSelectedFiles(files)
      setShowUploadDialog(true)
    }
  }, [])

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const uploadSelectedFiles = async () => {
    if (selectedFiles.length === 0 || isUploading) return

    setIsUploading(true)
    setUploadedCount(0)
    setUploadProgress({})

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const fileKey = `${file.name}-${file.size}-${i}`
        
        // Set file as starting upload
        setUploadProgress(prev => ({ ...prev, [fileKey]: 0 }))
        
        try {
          await handleFileUpload(file)
          
          // Mark file as completed
          setUploadProgress(prev => ({ ...prev, [fileKey]: 100 }))
          setUploadedCount(prev => prev + 1)
          
        } catch (error) {
          console.error(`Error uploading ${file.name}:`, error)
          // Mark file as failed
          setUploadProgress(prev => ({ ...prev, [fileKey]: -1 }))
        }
      }
      
      // Close dialog and reset states
      setTimeout(() => {
        setSelectedFiles([])
        setShowUploadDialog(false)
        setUploadProgress({})
        setUploadedCount(0)
        addToast(`Successfully uploaded ${uploadedCount} file(s)`, "success")
      }, 1000)
      
    } catch (error) {
      console.error('Error uploading files:', error)
      addToast('Some files failed to upload', "error")
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Create folder in Google Drive
  const createFolder = async (folderName: string, parentId: string): Promise<string> => {
    try {
      const response = await fetch('/api/google-drive/create-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          folderName,
          parentFolderId: parentId,
          authId: userSession?.auth_id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to create folder: ${folderName}`)
      }

      const result = await response.json()
      return result.id
    } catch (error) {
      console.error(`Error creating folder ${folderName}:`, error)
      throw error
    }
  }

  // Check if there are any active uploads (pending or uploading)
  const hasActiveUploads = uploads.some(upload => 
    upload.status === 'pending' || upload.status === 'uploading'
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      const filesArray = Array.from(selectedFiles)
      setSelectedFiles(filesArray)
      setShowUploadDialog(true)
    }
    // Reset the input so the same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFolderChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (!selectedFiles || selectedFiles.length === 0) {
      addToast('No files selected. Please select a folder with files.', 'error')
      return
    }

    try {
      addToast('Starting folder upload...', 'info')

      console.log('Selected files count:', selectedFiles.length)

      // Get the folder name from the first file's path
      const firstFile = selectedFiles[0] as File & { webkitRelativePath?: string }
      console.log('First file:', firstFile)
      console.log('First file name:', firstFile.name)
      console.log('First file webkitRelativePath:', firstFile.webkitRelativePath)

      const relativePath = firstFile.webkitRelativePath || firstFile.name

      if (!relativePath.includes('/')) {
        // This shouldn't happen for folder uploads, but handle it
        addToast('Please select a folder, not individual files', 'error')
        return
      }

      // Extract the root folder name (e.g., "mama" from "mama/text1.txt")
      const rootFolderName = relativePath.split('/')[0]

      console.log(`Creating root folder: ${rootFolderName}`)

      // Create the root folder in the current directory
      const rootFolderId = await createFolder(rootFolderName, currentFolderId)

      addToast(`Created folder "${rootFolderName}"`, 'info')

      // Group files by their folder paths and create subfolders as needed
      const folderStructure: { [path: string]: string } = {} // path -> folderId
      folderStructure[''] = rootFolderId // root folder

      const filesArray = Array.from(selectedFiles) as (File & { webkitRelativePath?: string })[]

      // First pass: create all necessary folders
      for (const file of filesArray) {
        const relativePath = file.webkitRelativePath || file.name
        const pathParts = relativePath.split('/')

        if (pathParts.length < 2) continue // skip root level files for now

        // Remove the filename to get the folder path
        const folderPath = pathParts.slice(0, -1).join('/')
        const folderName = pathParts[pathParts.length - 2] // parent folder name

        if (!folderStructure[folderPath]) {
          // Need to create this folder
          const parentPath = pathParts.slice(0, -2).join('/')
          const parentId = folderStructure[parentPath] || rootFolderId

          console.log(`Creating subfolder: ${folderName} in parent: ${parentId}`)
          const folderId = await createFolder(folderName, parentId)
          folderStructure[folderPath] = folderId
        }
      }

      // Second pass: upload all files to their correct folders
      let uploadedCount = 0
      for (const file of filesArray) {
        console.log(`Processing file ${uploadedCount + 1}/${filesArray.length}:`, {
          name: file?.name,
          size: file?.size,
          type: file?.type,
          webkitRelativePath: file?.webkitRelativePath,
          isFile: file instanceof File,
          fileExists: !!file
        })

        if (!file || !(file instanceof File)) {
          console.error('Invalid file object:', file)
          continue
        }

        const relativePath = file.webkitRelativePath || file.name
        const pathParts = relativePath.split('/')

        let parentId: string
        if (pathParts.length < 2) {
          // File in root folder
          parentId = rootFolderId
          console.log(`Uploading root file: ${file.name} to ${parentId}`)
        } else {
          // File in subfolder
          const folderPath = pathParts.slice(0, -1).join('/')
          parentId = folderStructure[folderPath]

          if (!parentId) {
            console.error(`No parent folder found for path: ${folderPath}`)
            continue
          }

          console.log(`Uploading file: ${file.name} to folder: ${folderPath} (${parentId})`)
        }

        try {
          await uploadFile(file, parentId, userSession?.auth_id || '', () => {
            onFileCreated?.()
          })
          uploadedCount++
          console.log(`Successfully uploaded ${uploadedCount}/${filesArray.length}: ${file.name}`)
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError)
          // Continue with other files instead of failing the entire upload
        }
      }

      addToast(`Successfully uploaded ${uploadedCount} files to "${rootFolderName}" with folder structure!`, 'success')
    } catch (error) {
      console.error('Error uploading folder:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload folder'
      addToast(`Folder upload failed: ${errorMessage}`, 'error')
    }

    // Reset the input
    if (folderInputRef.current) {
      folderInputRef.current.value = ''
    }
  }

  // Show authentication requirement if user doesn't have Google auth
  if (hasGoogleAuth === false) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Shield className="w-4 h-4" />
            </motion.div>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Authentication Required
            </DialogTitle>
            <DialogDescription className="text-white/60">
              You need to connect your Google Drive to upload files
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-medium">Individual Authentication Required</span>
              </div>
              <p className="text-amber-200/80 text-sm">
                As an admin, you must authenticate with your own Google account. Files you upload will be owned by your Google account.
              </p>
            </div>

            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-300 text-sm">{authError}</p>
              </div>
            )}

            <div className="space-y-2">
              <Button
                onClick={handleAuthenticate}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
              >
                <Shield className="w-4 h-4 mr-2" />
                Connect Google Drive
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Show loading state while checking authentication
  if (hasGoogleAuth === null) {
    return (
      <Button
        size="sm"
        disabled
        className="bg-white/5 border-white/20 text-white/60"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </Button>
    )
  }

  return (
    <>
      {/* Simple dialog-based approach instead of dropdown */}
      <div className="relative flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
          <Button
            size="sm"

            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <motion.div
              whileHover={{ rotate: 45 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Plus className="w-4 h-4" />
            </motion.div>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create New
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Choose what you&apos;d like to create
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-2 py-4">
            <Button
              onClick={() => {
              setShowCreateFolder(true)
              }}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-white border-blue-500/30 justify-start"
              variant="outline"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button
              onClick={() => {
              setShowUploadDialog(true)
              }}
              className="bg-purple-500/30 hover:bg-purple-500/20 text-purple-300 hover:text-white border-purple-500/30 justify-start"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            {/* <Button
              onClick={() => {
              handleFolderSelect()
              }}
              className="bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-white border-green-500/30 justify-start"
              variant="outline"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Upload Folder
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>

      {/* Animated upload indicator */}
      {hasActiveUploads && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative"
          title={`${uploads.filter(u => u.status === 'pending' || u.status === 'uploading').length} file(s) uploading`}
        >
          <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
            <motion.div
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <CloudUpload className="w-3 h-3 text-white" />
            </motion.div>
          </div>
          {/* Pulsing ring */}
          <motion.div
            className="absolute inset-0 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        </motion.div>
      )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        multiple={true}
        aria-label="Upload files"
      />

      {/* Hidden folder input */}
      <input
        ref={folderInputRef}
        type="file"
        onChange={handleFolderChange}
        className="hidden"
        multiple={true}
        {...({ webkitdirectory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
        aria-label="Upload folder"
      />

      {/* File Upload Dialog with Drag & Drop */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Upload Files
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Drag and drop files here or click to browse
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* Drag and Drop Zone */}
            <div
              ref={dropZoneRef}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
                ${isDragActive 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-white/30 hover:border-purple-500/50 hover:bg-white/5'
                }
              `}
            >
              <motion.div
                animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <motion.div
                    animate={isDragActive ? { y: -5 } : { y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`
                      w-16 h-16 rounded-full flex items-center justify-center
                      ${isDragActive 
                        ? 'bg-purple-500/20 text-purple-400' 
                        : 'bg-white/10 text-white/60'
                      }
                    `}
                  >
                    <CloudUpload className="w-8 h-8" />
                  </motion.div>
                </div>
                
                <div>
                  <h3 className={`text-lg font-medium mb-2 ${isDragActive ? 'text-purple-300' : 'text-white'}`}>
                    {isDragActive ? 'Drop files here' : 'Upload Files'}
                  </h3>
                  <p className="text-white/60 text-sm">
                    {isDragActive 
                      ? 'Release to upload files' 
                      : 'Drag and drop files here, or click to browse'
                    }
                  </p>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    fileInputRef.current?.click()
                  }}
                  className="bg-white/5 border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </Button>
              </motion.div>
            </div>

            {/* Selected Files List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/80">
                  Selected Files ({selectedFiles.length})
                  {isUploading && (
                    <span className="ml-2 text-xs text-blue-400">
                      Uploading {uploadedCount}/{selectedFiles.length}
                    </span>
                  )}
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2 bg-white/5 rounded-lg p-3 custom-scrollbar">
                  {selectedFiles.map((file, index) => {
                    const fileKey = `${file.name}-${file.size}-${index}`
                    const progress = uploadProgress[fileKey]
                    const isFileUploading = progress !== undefined && progress >= 0 && progress < 100
                    const isFileCompleted = progress === 100
                    const isFileFailed = progress === -1
                    
                    return (
                      <motion.div
                        key={fileKey}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="relative"
                      >
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded border border-white/10 relative overflow-hidden">
                          {/* Progress background */}
                          {isFileUploading && (
                            <div 
                              className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          )}
                          {isFileCompleted && (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20" />
                          )}
                          {isFileFailed && (
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20" />
                          )}
                          
                          <div className="flex items-center gap-2 flex-1 min-w-0 relative z-10">
                            <div className="flex-shrink-0">
                              {isFileCompleted ? (
                                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 8 8">
                                    <path d="M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z"/>
                                  </svg>
                                </div>
                              ) : isFileFailed ? (
                                <X className="w-4 h-4 text-red-400" />
                              ) : isFileUploading ? (
                                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FileText className="w-4 h-4 text-blue-400" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white truncate" title={file.name}>
                                {file.name}
                              </p>
                              <div className="flex items-center gap-2">
                                <p className="text-xs text-white/60">
                                  {formatFileSize(file.size)}
                                </p>
                                {isFileUploading && (
                                  <p className="text-xs text-blue-400">
                                    {progress}%
                                  </p>
                                )}
                                {isFileCompleted && (
                                  <p className="text-xs text-green-400">
                                    ✓ Uploaded
                                  </p>
                                )}
                                {isFileFailed && (
                                  <p className="text-xs text-red-400">
                                    ✗ Failed
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          {!isUploading && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-8 w-8 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/10 relative z-10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (!isUploading) {
                  setShowUploadDialog(false)
                  setSelectedFiles([])
                  setUploadProgress({})
                  setUploadedCount(0)
                }
              }}
              disabled={isUploading}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 disabled:opacity-50 hover:text-red"
            >
              {isUploading ? 'Uploading...' : 'Cancel'}
            </Button>
            <Button
              onClick={uploadSelectedFiles}
              disabled={selectedFiles.length === 0 || isUploading}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>
                    {uploadedCount}/{selectedFiles.length}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>
                    Upload {selectedFiles.length > 0 ? `${selectedFiles.length} ` : ''}Files
                  </span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={showCreateFolder} onOpenChange={(open) => {
        if (!isAutoClosing) {
          setShowCreateFolder(open)
        }
      }}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Create New Folder
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Enter a name for your new folder
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="folderName" className="text-white/80">
                Folder Name
              </Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="Enter folder name..."
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isCreatingFolder) {
                    handleCreateFolder()
                  }
                }}
                disabled={isCreatingFolder || isAutoClosing}
              />
            </div>
            
            {isAutoClosing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <Loader2 className="w-4 h-4" />
                </motion.div>
                <span>The page will be refreshed for loading the new content...</span>
              </motion.div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (!isAutoClosing) {
                  setShowCreateFolder(false)
                  setFolderName("")
                }
              }}
              disabled={isCreatingFolder || isAutoClosing}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={isCreatingFolder || isAutoClosing || !folderName.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
            >
              {isCreatingFolder ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
