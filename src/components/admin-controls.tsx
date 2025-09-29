"use client"

import React, { useState } from "react"
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
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Edit, Trash2, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { getStudentSession } from "@/lib/auth"
import { useToast } from "@/components/ToastProvider"

interface FileActionsProps {
  fileId: string
  fileName: string
  onDeleted: () => void
  onRenamed: () => void
}

export function FileActions({ fileId, fileName, onDeleted, onRenamed }: FileActionsProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newName, setNewName] = useState(fileName)
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [renameSuccess, setRenameSuccess] = useState(false)
  const { addToast } = useToast()

  const handleRename = async () => {
    if (newName.trim() === fileName) {
      setShowRenameDialog(false)
      return
    }

    if (!newName.trim()) {
      addToast("Please enter a valid name", "error")
      return
    }

    setIsRenaming(true)
    setRenameSuccess(false)

    try {
      const session = getStudentSession()
      if (!session) throw new Error('No session found')

      const response = await fetch(`/api/google-drive/rename/${fileId}?userId=${session.user_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newName.trim() })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to rename file')
      }

      setRenameSuccess(true)
      
      // Auto-refresh immediately after successful rename
      onRenamed()
      
      // Show success animation for a moment
      setTimeout(() => {
        setShowRenameDialog(false)
        setRenameSuccess(false)
        addToast(`Renamed to "${newName.trim()}"`, "success")
      }, 1000)

    } catch (error) {
      console.error("Error renaming file:", error)
      addToast(error instanceof Error ? error.message : 'Failed to rename file', "error")
    } finally {
      setIsRenaming(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const session = getStudentSession()
      if (!session) throw new Error('No session found')

      const response = await fetch(`/api/google-drive/delete/${fileId}?userId=${session.user_id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete file')
      }

      // Auto-refresh immediately after successful delete
      onDeleted()
      
      // Show success and then close dialog
      setTimeout(() => {
        setShowDeleteDialog(false)
        addToast(`"${fileName}" has been deleted`, "success")
      }, 1500)

    } catch (error) {
      console.error("Error deleting file:", error)
      addToast(error instanceof Error ? error.message : 'Failed to delete file', "error")
      setIsDeleting(false)
    }
  }

  const openRenameDialog = () => {
    setNewName(fileName)
    setShowRenameDialog(true)
    setRenameSuccess(false)
  }

  return (
    <>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={openRenameDialog}
          className="bg-yellow-400/20 hover:bg-yellow-400/40 text-yellow-500 border-yellow-400/30 hover:text-yellow-600 hover:border-yellow-400/50 text-xs transition-all duration-300 hover:scale-105"
        >
          <Edit className="w-3 h-3" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowDeleteDialog(true)}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-500 border-red-500/30 hover:border-red-500/50 text-xs transition-all duration-300 hover:scale-105"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Rename File
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Enter a new name for "{fileName}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newFileName" className="text-white/80">
                New Name
              </Label>
              <Input
                id="newFileName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-amber-500/50 focus:ring-amber-500/20"
                placeholder="Enter new name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isRenaming && !renameSuccess) {
                    handleRename()
                  }
                }}
                disabled={isRenaming || renameSuccess}
              />
            </div>

            <AnimatePresence>
              {(isRenaming || renameSuccess) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm"
                >
                  {isRenaming && (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4 text-amber-500" />
                      </motion.div>
                      <span className="text-amber-400">Renaming in progress...</span>
                    </>
                  )}
                  {renameSuccess && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-400">Renamed successfully!</span>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRenameDialog(false)
                setNewName(fileName)
                setRenameSuccess(false)
              }}
              disabled={isRenaming}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={isRenaming || renameSuccess || !newName.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
            >
              {isRenaming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Renaming...
                </>
              ) : renameSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Renamed!
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2 hover:text-amber-600" />
                  Rename
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-red-500/20 text-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Delete File
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete "{fileName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AnimatePresence>
            {isDeleting && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
              >
                <motion.div
                  animate={{ 
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.5, 
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }}
                >
                  <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                </motion.div>
                <div>
                  <p className="text-red-400 font-medium">Deleting in progress...</p>
                  <p className="text-red-300/60 text-sm">Please wait while we remove the file</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white/80"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
            >
              {isDeleting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Trash2 className="w-4 h-4 hover:text-red-600" />
                  </motion.div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2 hover:text-red-600" />
                  Delete
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// AdminControls is now deprecated - replaced by CreateActions component
// Keeping this for backward compatibility but it no longer renders anything
interface AdminControlsProps {
  currentFolderId: string
  onFileUploaded: () => void
  onFileDeleted: () => void
  onFileRenamed: () => void
}

export function AdminControls({ }: AdminControlsProps) {
  // This component is now empty as CreateActions handles all admin creation functionality
  return null
}

interface FolderActionsProps {
  folderId: string
  folderName: string
  onDeleted: () => void
  onRenamed: () => void
}

export function FolderActions({ folderId, folderName, onDeleted, onRenamed }: FolderActionsProps) {
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newName, setNewName] = useState(folderName)
  const [isRenaming, setIsRenaming] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [renameSuccess, setRenameSuccess] = useState(false)
  const { addToast } = useToast()

  const handleRename = async () => {
    if (newName.trim() === folderName) {
      setShowRenameDialog(false)
      return
    }

    if (!newName.trim()) {
      addToast("Please enter a valid folder name", "error")
      return
    }

    setIsRenaming(true)
    setRenameSuccess(false)

    try {
      const session = getStudentSession()
      if (!session) throw new Error('No session found')

      const response = await fetch(`/api/google-drive/rename/${folderId}?userId=${session.user_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: newName.trim() })
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to rename folder')
      }

      setRenameSuccess(true)
      
      // Auto-refresh immediately after successful rename
      onRenamed()
      
      // Show success animation for a moment
      setTimeout(() => {
        setShowRenameDialog(false)
        setRenameSuccess(false)
        addToast(`Folder renamed to "${newName.trim()}"`, "success")
      }, 1000)

    } catch (error) {
      console.error("Error renaming folder:", error)
      addToast(error instanceof Error ? error.message : 'Failed to rename folder', "error")
    } finally {
      setIsRenaming(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const session = getStudentSession()
      if (!session) throw new Error('No session found')

      const response = await fetch(`/api/google-drive/delete/${folderId}?userId=${session.user_id}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete folder')
      }

      // Auto-refresh immediately after successful delete
      onDeleted()
      
      // Show success and then close dialog
      setTimeout(() => {
        setShowDeleteDialog(false)
        addToast(`Folder "${folderName}" has been deleted`, "success")
      }, 1500)

    } catch (error) {
      console.error("Error deleting folder:", error)
      addToast(error instanceof Error ? error.message : 'Failed to delete folder', "error")
      setIsDeleting(false)
    }
  }

  const openRenameDialog = () => {
    setNewName(folderName)
    setShowRenameDialog(true)
    setRenameSuccess(false)
  }

  return (
    <>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={openRenameDialog}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 text-xs transition-all duration-300 hover:scale-105 hover:text-blue-500 hover:border-blue-500/50"
        >
          <Edit className="w-3 h-3 hover:text-blue-500" />
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setShowDeleteDialog(true)}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 text-xs transition-all duration-300 hover:scale-105 hover:text-red-500 hover:border-red-500/50"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Rename Folder
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Enter a new name for "{folderName}"
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newFolderName" className="text-white/80">
                New Name
              </Label>
              <Input
                id="newFolderName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20"
                placeholder="Enter new folder name..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isRenaming && !renameSuccess) {
                    handleRename()
                  }
                }}
                disabled={isRenaming || renameSuccess}
              />
            </div>

            <AnimatePresence>
              {(isRenaming || renameSuccess) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm"
                >
                  {isRenaming && (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      >
                        <Loader2 className="w-4 h-4 text-blue-500" />
                      </motion.div>
                      <span className="text-blue-400">Renaming folder...</span>
                    </>
                  )}
                  {renameSuccess && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-green-400">Folder renamed successfully!</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowRenameDialog(false)}
              disabled={isRenaming || renameSuccess}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white/80"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRename}
              disabled={isRenaming || renameSuccess || !newName.trim()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
            >
              {isRenaming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Renaming...
                </>
              ) : renameSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Renamed!
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2 hover:text-amber-600" />
                  Rename Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-black/90 backdrop-blur-xl border-white/20 text-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Folder
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              Are you sure you want to delete the folder "{folderName}"? 
              <br /><br />
              <span className="text-red-400 font-medium">Warning: This will also delete all files and subfolders inside this folder. This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel 
              disabled={isDeleting}
              className="bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white/80"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
            >
              {isDeleting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="mr-2"
                  >
                    <Trash2 className="w-4 h-4 hover:text-red-600" />
                  </motion.div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2 hover:text-red-600" />
                  Delete Folder
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
