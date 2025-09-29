"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import { useToast } from '@/components/ToastProvider'

export interface UploadItem {
  id: string
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
  startTime: number
  endTime?: number
  abortController?: AbortController
  parentFolderId: string
  userId: string
}

interface UploadContextType {
  uploads: UploadItem[]
  uploadFile: (file: File, parentFolderId: string, userId: string, onComplete?: () => void) => Promise<void>
  cancelUpload: (uploadId: string) => void
  clearCompleted: () => void
  retryUpload: (uploadId: string) => void
}

const UploadContext = createContext<UploadContextType | undefined>(undefined)

export function useUpload() {
  const context = useContext(UploadContext)
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider')
  }
  return context
}

interface UploadProviderProps {
  children: React.ReactNode
}

export function UploadProvider({ children }: UploadProviderProps) {
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const { addToast } = useToast()
  const uploadCallbacksRef = useRef<Map<string, () => void>>(new Map())

  const uploadFile = useCallback(async (file: File, parentFolderId: string, userId: string, onComplete?: () => void) => {
    const uploadId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const abortController = new AbortController()

    const uploadItem: UploadItem = {
      id: uploadId,
      file,
      progress: 0,
      status: 'pending',
      startTime: Date.now(),
      abortController,
      parentFolderId,
      userId
    }

    setUploads(prev => [...prev, uploadItem])

    // Store the callback for this upload
    if (onComplete) {
      uploadCallbacksRef.current.set(uploadId, onComplete)
    }

    try {
      // Start upload
      setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading' } : u))

      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', userId)
      formData.append('parentFolderId', parentFolderId)

      // Use XMLHttpRequest for better progress tracking
      const xhr = new XMLHttpRequest()

      // Set up progress tracking
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploads(prev => prev.map(u =>
            u.id === uploadId ? { ...u, progress } : u
          ))
        }
      })

      // Set up completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploads(prev => prev.map(u =>
            u.id === uploadId ? {
              ...u,
              status: 'completed',
              progress: 100,
              endTime: Date.now()
            } : u
          ))
          addToast(`File "${file.name}" uploaded successfully`, 'success')

          // Call refresh callback if set
          const callback = uploadCallbacksRef.current.get(uploadId)
          if (callback) {
            callback()
            uploadCallbacksRef.current.delete(uploadId)
          }
        } else {
          let errorMessage = `Upload failed with status ${xhr.status}`
          console.error('Upload failed:', {
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            fileName: file.name,
            fileSize: file.size
          })

          try {
            const response = JSON.parse(xhr.responseText)
            errorMessage = response.error || `Server error: ${xhr.status} ${xhr.statusText}`
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError)
            // If response is not JSON, use the raw response or status text
            errorMessage = xhr.responseText || xhr.statusText || `HTTP ${xhr.status} error`
          }

          setUploads(prev => prev.map(u =>
            u.id === uploadId ? {
              ...u,
              status: 'error',
              error: errorMessage,
              endTime: Date.now()
            } : u
          ))
          addToast(`Failed to upload "${file.name}": ${errorMessage}`, 'error')
        }
      })

      // Set up error handling
      xhr.addEventListener('error', (event) => {
        console.error('Upload network error for:', file.name, {
          fileSize: file.size,
          fileSizeMB: (file.size / (1024 * 1024)).toFixed(2),
          readyState: xhr.readyState,
          status: xhr.status,
          event
        })
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? {
            ...u,
            status: 'error',
            error: `Network error during upload. Check your connection and try again. File: ${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            endTime: Date.now()
          } : u
        ))
        addToast(`Network error uploading "${file.name}". Please check your connection and retry.`, 'error')
      })

      // Set up timeout handling
      xhr.addEventListener('timeout', () => {
        console.error('Upload timeout for:', file.name, {
          fileSize: file.size,
          timeoutMs,
          fileSizeMB: (file.size / (1024 * 1024)).toFixed(2)
        })
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? {
            ...u,
            status: 'error',
            error: `Upload timeout after ${timeoutMs / 1000} seconds. File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB may be too large.`,
            endTime: Date.now()
          } : u
        ))
        addToast(`Upload timeout for "${file.name}". Large files may take longer.`, 'error')
      })

      // Set timeout for large files
      const timeoutMs = file.size > 50 * 1024 * 1024 ? 300000 : 120000 // 5 min for large files, 2 min for small
      xhr.timeout = timeoutMs

      // Set up abort handling
      xhr.addEventListener('abort', () => {
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? {
            ...u,
            status: 'error',
            error: 'Upload cancelled',
            endTime: Date.now()
          } : u
        ))
      })

      // Configure and send request
      xhr.open('POST', '/api/google-drive/upload')
      xhr.setRequestHeader('Accept', 'application/json')

      // Handle abort controller
      abortController.signal.addEventListener('abort', () => {
        xhr.abort()
      })

      xhr.send(formData)

    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      setUploads(prev => prev.map(u =>
        u.id === uploadId ? {
          ...u,
          status: 'error',
          error: errorMessage,
          endTime: Date.now()
        } : u
      ))
      addToast(`Failed to upload "${file.name}": ${errorMessage}`, 'error')
    }
  }, [addToast])

  const cancelUpload = useCallback((uploadId: string) => {
    setUploads(prev => prev.map(u => {
      if (u.id === uploadId && u.status === 'uploading' && u.abortController) {
        u.abortController.abort()
        return { ...u, status: 'error', error: 'Upload cancelled', endTime: Date.now() }
      }
      return u
    }))
  }, [])

  const clearCompleted = useCallback(() => {
    setUploads(prev => prev.filter(u => u.status !== 'completed'))
  }, [])

  const retryUpload = useCallback((uploadId: string) => {
    const upload = uploads.find(u => u.id === uploadId)
    if (!upload || upload.status !== 'error') return

    // Reset the upload item and retry with stored parameters
    setUploads(prev => prev.map(u =>
      u.id === uploadId ? {
        ...u,
        status: 'pending',
        progress: 0,
        error: undefined,
        startTime: Date.now(),
        endTime: undefined,
        abortController: new AbortController()
      } : u
    ))

    // Retry the upload with stored parameters
    const retryFile = new File([upload.file], upload.file.name, { type: upload.file.type })
    uploadFile(retryFile, upload.parentFolderId, upload.userId)
      .catch(error => {
        console.error('Retry failed:', error)
        addToast(`Retry failed for "${upload.file.name}"`, 'error')
      })
  }, [uploads, uploadFile, addToast])

  const value: UploadContextType = {
    uploads,
    uploadFile,
    cancelUpload,
    clearCompleted,
    retryUpload
  }

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  )
}
