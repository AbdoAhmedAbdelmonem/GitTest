"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
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
} from "lucide-react"
import { useToast } from "@/components/ToastProvider"
import { useUpload } from "./upload-context"

interface CreateActionsProps {
  currentFolderId: string
  onFileCreated?: () => void
  userSession: any
}

export function CreateActions({ currentFolderId, onFileCreated, userSession }: CreateActionsProps) {
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [isAutoClosing, setIsAutoClosing] = useState(false)
  const [hasGoogleAuth, setHasGoogleAuth] = useState<boolean | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { addToast } = useToast()
  const { uploadFile, uploads } = useUpload()

  // Check if user has Google Drive authentication
  useEffect(() => {
    const checkAuthentication = async () => {
      if (!userSession?.user_id) {
        setHasGoogleAuth(false)
        return
      }

      try {
        const response = await fetch(`/api/google-drive/check-access?userId=${userSession.user_id}`)
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
  }, [userSession?.user_id])

  const handleAuthenticate = async () => {
    if (!userSession?.user_id) return

    try {
      const response = await fetch('/api/google-drive/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userSession.user_id,
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
          userId: userSession?.user_id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create folder')
      }

      await response.json()
      
      addToast(`Folder "${folderName}" created successfully`, "success")
      
      // Show refresh message and auto-close
      setIsAutoClosing(true)
      setTimeout(() => {
        addToast("The page will be refreshed for loading the new content", "info")
        
        setTimeout(() => {
          setFolderName("")
          setShowCreateFolder(false)
          setIsAutoClosing(false)
          onFileCreated?.() // This should refresh the file list
          
          // Force a page refresh to ensure new content is loaded
          window.location.reload()
        }, 1500) // Give time to read the refresh message
      }, 1000) // Show success message first
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
    if (!file || !userSession?.user_id) return

    try {
      await uploadFile(file, currentFolderId, userSession.user_id.toString())
      // The upload context will handle progress and notifications
      // Refresh the file list after successful upload
      setTimeout(() => {
        onFileCreated?.()
      }, 1000) // Small delay to ensure upload is processed
    } catch (error) {
      console.error('Error initiating upload:', error)
      // Error handling is done in the upload context
    }
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  // Check if there are any active uploads (pending or uploading)
  const hasActiveUploads = uploads.some(upload => 
    upload.status === 'pending' || upload.status === 'uploading'
  )

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files
    if (selectedFiles && selectedFiles.length > 0) {
      // Handle multiple files
      Array.from(selectedFiles).forEach(file => {
        handleFileUpload(file)
      })
    }
    // Reset the input so the same files can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
              handleFileSelect()
              }}
              className="bg-purple-500/30 hover:bg-purple-500/20 text-purple-300 hover:text-white border-purple-500/30 justify-start"
              variant="outline"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
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