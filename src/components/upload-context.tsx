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

      console.log('Requesting upload URL for file:', {
        name: file.name,
        size: file.size,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        type: file.type,
        parentFolderId,
        userId
      })

      // Step 1: Get signed upload URL from our server
      const urlResponse = await fetch('/api/google-drive/get-upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          parentFolderId,
          userId
        }),
      })

      if (!urlResponse.ok) {
        const errorData = await urlResponse.json()
        throw new Error(errorData.error || 'Failed to get upload URL')
      }

      const urlData = await urlResponse.json()
      const uploadUrl = urlData.uploadUrl
      const accessToken = urlData.accessToken
      const uploadMethod = urlData.uploadMethod || 'direct' // Default to 'direct' for backward compatibility

      console.log('Got upload info:', {
        success: urlData.success,
        uploadMethod,
        hasUploadUrl: !!uploadUrl,
        hasAccessToken: !!accessToken,
        uploadUrlPreview: uploadUrl ? uploadUrl.substring(0, 50) + '...' : 'none'
      })

      // Handle server-proxy method (new approach)
      if (uploadMethod === 'server-proxy') {
        console.log('Using server-proxy upload method')

        // For very large files (>20MB), fall back to direct upload to avoid Next.js limits
        const isVeryLargeFile = file.size > 20 * 1024 * 1024

        if (isVeryLargeFile) {
          console.log('Very large file detected, falling back to direct Google Drive upload')

          // Use direct upload method for large files
          if (!uploadUrl || !accessToken) {
            throw new Error('Missing upload URL or access token from server for direct upload')
          }

          console.log('Starting direct multipart upload to Google Drive for large file')

          // Direct upload logic for large files
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
            console.log('Direct multipart upload completed:', {
              status: xhr.status,
              statusText: xhr.statusText,
              responseText: xhr.responseText?.substring(0, 200)
            })

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

              try {
                if (xhr.responseText && xhr.responseText.trim()) {
                  const response = JSON.parse(xhr.responseText)
                  errorMessage = response.error?.message || response.error || `Server error: ${xhr.status} ${xhr.statusText}`
                } else {
                  errorMessage = `Server error: ${xhr.status} ${xhr.statusText || 'Unknown error'}`
                }
              } catch (parseError) {
                console.error('Failed to parse error response:', parseError)
                if (xhr.statusText) {
                  errorMessage = `HTTP ${xhr.status}: ${xhr.statusText}`
                } else {
                  errorMessage = `Upload failed with HTTP ${xhr.status} error`
                }
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
            console.error('Direct upload network error:', {
              fileName: file.name,
              fileSize: file.size,
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

          // Set up timeout handling (much longer for large files)
          xhr.addEventListener('timeout', () => {
            console.error('Direct upload timeout:', {
              fileName: file.name,
              fileSize: file.size,
              timeoutMs: 900000
            })
            setUploads(prev => prev.map(u =>
              u.id === uploadId ? {
                ...u,
                status: 'error',
                error: `Upload timeout after 15 minutes. File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB may be too large or network is slow.`,
                endTime: Date.now()
              } : u
            ))
            addToast(`Upload timeout for "${file.name}". Large files may take longer.`, 'error')
          })

          // Set timeout for large files (15 minutes)
          xhr.timeout = 900000 // 15 minutes

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

          // Create multipart form data for Google Drive
          const boundary = '----FormBoundary' + Math.random().toString(36).substr(2, 9)
          const metadata = {
            name: file.name,
            ...(urlData.fileMetadata.parents && { parents: urlData.fileMetadata.parents })
          }

          // Create the multipart body
          const parts = [
            `--${boundary}`,
            'Content-Type: application/json; charset=UTF-8',
            '',
            JSON.stringify(metadata),
            '',
            `--${boundary}`,
            `Content-Type: ${file.type || 'application/octet-stream'}`,
            '',
          ].join('\r\n')

          // Convert file to array buffer and create multipart data
          const fileBuffer = await file.arrayBuffer()
          const closingBoundary = `\r\n--${boundary}--\r\n`
          const encoder = new TextEncoder()
          const partsArray = encoder.encode(parts)
          const closingArray = encoder.encode(closingBoundary)

          const multipartData = new Uint8Array(partsArray.length + fileBuffer.byteLength + closingArray.length)
          multipartData.set(partsArray, 0)
          multipartData.set(new Uint8Array(fileBuffer), partsArray.length)
          multipartData.set(closingArray, partsArray.length + fileBuffer.byteLength)

          // Configure and send multipart request
          xhr.open('POST', uploadUrl)
          xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
          xhr.setRequestHeader('Content-Type', `multipart/related; boundary=${boundary}`)
          xhr.setRequestHeader('Content-Length', multipartData.length.toString())

          console.log('Direct multipart request configuration for large file:', {
            method: 'POST',
            url: uploadUrl,
            boundary,
            contentType: `multipart/related; boundary=${boundary}`,
            contentLength: multipartData.length.toString(),
            metadataSize: JSON.stringify(metadata).length,
            fileSize: file.size,
            totalSize: multipartData.length,
            timeoutMs: 900000
          })

          // Handle abort controller
          abortController.signal.addEventListener('abort', () => {
            console.log('Upload aborted for:', file.name)
            xhr.abort()
          })

          // Send the multipart data
          xhr.send(multipartData)

        } else {
          // For smaller files, use server-proxy upload
          const formData = new FormData()
          formData.append('file', file)
          formData.append('userId', userId)
          formData.append('parentFolderId', parentFolderId)

          // Simulate progress for server-proxy uploads
          const progressInterval = setInterval(() => {
            setUploads(prev => prev.map(u => {
              if (u.id === uploadId && u.progress < 90) {
                return { ...u, progress: Math.min(u.progress + Math.random() * 10, 90) }
              }
              return u
            }))
          }, 500)

          try {
            // Upload via server proxy
            const serverResponse = await fetch('/api/google-drive/upload', {
              method: 'POST',
              body: formData,
              signal: abortController.signal
            })

            clearInterval(progressInterval)

            if (!serverResponse.ok) {
              let errorMessage = `Server upload failed with status ${serverResponse.status}`

              try {
                // Try to parse as JSON first
                const errorData = await serverResponse.json()
                errorMessage = errorData.error || errorMessage
              } catch (jsonError) {
                // Fall back to text response
                try {
                  const textResponse = await serverResponse.text()
                  if (textResponse && textResponse.trim()) {
                    errorMessage = `Server error: ${textResponse.substring(0, 200)}${textResponse.length > 200 ? '...' : ''}`
                  }
                } catch (textError) {
                  // Use status-based message
                  errorMessage = `HTTP ${serverResponse.status}: ${serverResponse.statusText || 'Unknown error'}`
                }
              }

              throw new Error(errorMessage)
            }

            const result = await serverResponse.json()

            // Update progress to 100% on success
            setUploads(prev => prev.map(u =>
              u.id === uploadId ? { ...u, progress: 100 } : u
            ))

            console.log('Server-proxy upload completed successfully:', result)

            // Mark as completed
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
          } catch (error) {
            clearInterval(progressInterval)
            throw error
          }
        }

        return // Exit early for server-proxy method
      }

      // Handle direct upload method (legacy approach)
      if (!uploadUrl || !accessToken) {
        throw new Error('Missing upload URL or access token from server')
      }

      console.log('Starting multipart upload to Google Drive')

      // Step 2: Upload directly to Google Drive using multipart upload
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
        console.log('Direct multipart upload completed:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseText: xhr.responseText?.substring(0, 200)
        })

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

          try {
            if (xhr.responseText && xhr.responseText.trim()) {
              const response = JSON.parse(xhr.responseText)
              errorMessage = response.error?.message || response.error || `Server error: ${xhr.status} ${xhr.statusText}`
            } else {
              errorMessage = `Server error: ${xhr.status} ${xhr.statusText || 'Unknown error'}`
            }
          } catch (parseError) {
            console.error('Failed to parse error response:', parseError)
            if (xhr.statusText) {
              errorMessage = `HTTP ${xhr.status}: ${xhr.statusText}`
            } else {
              errorMessage = `Upload failed with HTTP ${xhr.status} error`
            }
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
        console.error('Direct upload network error:', {
          fileName: file.name,
          fileSize: file.size,
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

      // Set up timeout handling (much longer since direct to Google Drive)
      xhr.addEventListener('timeout', () => {
        console.error('Direct upload timeout:', {
          fileName: file.name,
          fileSize: file.size,
          timeoutMs
        })
        setUploads(prev => prev.map(u =>
          u.id === uploadId ? {
            ...u,
            status: 'error',
            error: `Upload timeout after ${timeoutMs / 1000} seconds. File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB may be too large or network is slow.`,
            endTime: Date.now()
          } : u
        ))
        addToast(`Upload timeout for "${file.name}". Large files may take longer.`, 'error')
      })

      // Set timeout for large files (30 minutes for files over 50MB, 15 minutes for large files, 5 minutes for small)
      const timeoutMs = file.size > 50 * 1024 * 1024 ? 1800000 : file.size > 10 * 1024 * 1024 ? 900000 : 300000 // 30 min for >50MB, 15 min for >10MB, 5 min for small
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

      // Create multipart form data for Google Drive
      const boundary = '----FormBoundary' + Math.random().toString(36).substr(2, 9)
      const metadata = {
        name: file.name,
        ...(urlData.fileMetadata.parents && { parents: urlData.fileMetadata.parents })
      }

      // Create the multipart body
      const parts = [
        `--${boundary}`,
        'Content-Type: application/json; charset=UTF-8',
        '',
        JSON.stringify(metadata),
        '',
        `--${boundary}`,
        `Content-Type: ${file.type || 'application/octet-stream'}`,
        '',
      ].join('\r\n')

      // Convert file to array buffer and create multipart data
      const fileBuffer = await file.arrayBuffer()
      const closingBoundary = `\r\n--${boundary}--\r\n`
      const encoder = new TextEncoder()
      const partsArray = encoder.encode(parts)
      const closingArray = encoder.encode(closingBoundary)
      
      const multipartData = new Uint8Array(partsArray.length + fileBuffer.byteLength + closingArray.length)
      multipartData.set(partsArray, 0)
      multipartData.set(new Uint8Array(fileBuffer), partsArray.length)
      multipartData.set(closingArray, partsArray.length + fileBuffer.byteLength)

      // Configure and send multipart request
      xhr.open('POST', uploadUrl)
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`)
      xhr.setRequestHeader('Content-Type', `multipart/related; boundary=${boundary}`)
      xhr.setRequestHeader('Content-Length', multipartData.length.toString())

      console.log('Multipart request configuration:', {
        method: 'POST',
        url: uploadUrl,
        boundary,
        contentType: `multipart/related; boundary=${boundary}`,
        contentLength: multipartData.length.toString(),
        metadataSize: JSON.stringify(metadata).length,
        fileSize: file.size,
        totalSize: multipartData.length,
        timeoutMs
      })

      // Handle abort controller
      abortController.signal.addEventListener('abort', () => {
        console.log('Upload aborted for:', file.name)
        xhr.abort()
      })

      // Send the multipart data
      xhr.send(multipartData)

    } catch (error) {
      console.error('Upload setup error:', error)
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
