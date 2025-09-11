"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Upload, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

export default function PDFViewer() {
  const [pdfUrl, setPdfUrl] = useState("")
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file)
      setPdfUrl(url)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg flex-1 flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3">
            <FileText className="w-6 h-6" />
            PDF Viewer
          </CardTitle>

          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="bg-white/[0.05] border-white/[0.15] text-white"
              />
            </div>

            {pdfUrl && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  className="border-white/[0.15] text-white hover:bg-white/[0.05]"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="border-white/[0.15] text-white hover:bg-white/[0.05]"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="border-white/[0.15] text-white hover:bg-white/[0.05]"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col">
          {pdfUrl ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 bg-white/[0.03] rounded-lg border border-white/[0.08] overflow-hidden"
            >
              <iframe src={`${pdfUrl}#zoom=${zoom}&rotate=${rotation}`} className="w-full h-full" title="PDF Viewer" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 flex items-center justify-center bg-white/[0.03] rounded-lg border-2 border-dashed border-white/[0.15]"
            >
              <div className="text-center">
                <Upload className="w-16 h-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60 text-lg mb-2">Upload a PDF file</p>
                <p className="text-white/40 text-sm">Drag and drop or click to browse</p>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
