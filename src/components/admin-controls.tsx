"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, Edit, Trash2, Plus } from "lucide-react"
import { uploadFileToDrive, deleteFileFromDrive, renameFileInDrive } from "@/lib/google-drive"

interface AdminControlsProps {
  currentFolderId: string
  onFileUploaded: () => void
  onFileDeleted: () => void
  onFileRenamed: () => void
}

interface FileActionsProps {
  fileId: string
  fileName: string
  onDeleted: () => void
  onRenamed: () => void
}

export function FileActions({ fileId, fileName, onDeleted, onRenamed }: FileActionsProps) {
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState(fileName)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleRename = async () => {
    if (newName.trim() === fileName) {
      setIsRenaming(false)
      return
    }

    try {
      await renameFileInDrive(fileId, newName.trim())
      onRenamed()
      setIsRenaming(false)
    } catch (error) {
      console.error("Error renaming file:", error)
      alert("Failed to rename file")
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteFileFromDrive(fileId)
      onDeleted()
    } catch (error) {
      console.error("Error deleting file:", error)
      alert("Failed to delete file")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex gap-1">
      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border-amber-500/30 text-xs"
          >
            <Edit className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Rename File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter new name"
            />
            <div className="flex gap-2">
              <Button onClick={handleRename} className="bg-blue-600 hover:bg-blue-700">
                Rename
              </Button>
              <Button variant="outline" onClick={() => setIsRenaming(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="outline"
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30 text-xs"
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  )
}

export function AdminControls({ currentFolderId, onFileUploaded }: AdminControlsProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        await uploadFileToDrive(file, currentFolderId)
      }
      onFileUploaded()
      setUploadDialogOpen(false)
    } catch (error) {
      console.error("Error uploading files:", error)
      alert("Failed to upload files")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Upload Files</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
              <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white mb-4">Select files to upload</p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                disabled={isUploading}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>
            {isUploading && (
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-white/60">Uploading files...</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
