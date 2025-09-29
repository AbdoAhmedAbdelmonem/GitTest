"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, CheckCircle, XCircle, RotateCcw, Trash2 } from 'lucide-react'
import { useUpload } from './upload-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export function UploadProgressBar() {
  const { uploads, cancelUpload, clearCompleted, retryUpload } = useUpload()

  // Only show if there are active uploads
  const hasActiveUploads = uploads.some(u => u.status === 'uploading' || u.status === 'pending')
  const hasCompletedUploads = uploads.some(u => u.status === 'completed')

  if (uploads.length === 0) return null

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  return (
    <AnimatePresence>
      {hasActiveUploads && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 max-w-lg z-50"
        >
          <Card className="bg-black/90 backdrop-blur-xl border-white/20 text-white shadow-2xl w-full">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium">Uploads</span>
                </div>
                {hasCompletedUploads && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearCompleted}
                    className="h-6 w-6 p-0 text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {uploads.map((upload) => (
                  <motion.div
                    key={upload.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-white/90 truncate" title={upload.file.name}>
                          {upload.file.name}
                        </p>
                        <p className="text-xs text-white/60">
                          {formatFileSize(upload.file.size)}
                          {upload.endTime && upload.startTime && (
                            <span className="ml-2">
                              • {formatTime(upload.endTime - upload.startTime)}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        {upload.status === 'uploading' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => cancelUpload(upload.id)}
                            className="h-6 w-6 p-0 text-white/60 hover:text-red-400 hover:bg-red-500/20"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        )}
                        {upload.status === 'error' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => retryUpload(upload.id)}
                            className="h-6 w-6 p-0 text-white/60 hover:text-blue-400 hover:bg-blue-500/20"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                        )}
                        {upload.status === 'completed' && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                        {upload.status === 'error' && (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`capitalize ${
                          upload.status === 'completed' ? 'text-green-400' :
                          upload.status === 'error' ? 'text-red-400' :
                          upload.status === 'uploading' ? 'text-blue-400' :
                          'text-white/60'
                        }`}>
                          {upload.status}
                        </span>
                        <span className="text-white/60">{upload.progress}%</span>
                      </div>

                      <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${
                            upload.status === 'completed' ? 'bg-green-500' :
                            upload.status === 'error' ? 'bg-red-500' :
                            'bg-gradient-to-r from-blue-500 to-purple-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${upload.progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>

                      {upload.error && (
                        <p className="text-xs text-red-400 mt-1">{upload.error}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}