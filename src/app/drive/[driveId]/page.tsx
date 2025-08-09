"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Folder,
  ImageIcon,
  Video,
  Music,
  Archive,
  Download,
  Search,
  Calendar,
  User,
  Eye,
  AlertCircle,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react"
import Navigation from "@/components/navigation"
import ScrollAnimatedSection from "@/components/scroll-animated-section"
import { useParams, useRouter } from "next/navigation"

const GOOGLE_DRIVE_API_KEY = "AIzaSyALQYyTG9yMs9Xd2leIqYgcxybOzFWciY0"
const GOOGLE_DRIVE_API_BASE = "https://www.googleapis.com/drive/v3"

interface DriveFile {
  id: string
  name: string
  mimeType: string
  size?: string
  modifiedTime: string
  createdTime: string
  owners?: Array<{ displayName: string; emailAddress: string }>
  webViewLink?: string
  webContentLink?: string
  thumbnailLink?: string
  parents?: string[]
}

interface DriveResponse {
  files: DriveFile[]
  nextPageToken?: string
}

interface FolderInfo {
  id: string
  name: string
  parents?: string[]
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  )
}

function getFileIcon(mimeType: string) {
  if (mimeType.includes("folder")) return Folder
  if (mimeType.includes("image")) return ImageIcon
  if (mimeType.includes("video")) return Video
  if (mimeType.includes("audio")) return Music
  if (mimeType.includes("zip") || mimeType.includes("rar")) return Archive
  return FileText
}

function formatFileSize(bytes?: string) {
  if (!bytes) return "Unknown size"
  const size = Number.parseInt(bytes)
  const units = ["B", "KB", "MB", "GB", "TB"]
  let unitIndex = 0
  let fileSize = size

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }

  return `${fileSize.toFixed(1)} ${units[unitIndex]}`
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function DriveRootPage() {
  const params = useParams()
  const router = useRouter()
  const driveId = params.driveId as string

  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFiles, setFilteredFiles] = useState<DriveFile[]>([])
  const [driveInfo, setDriveInfo] = useState<FolderInfo | null>(null)
  const [urlCopied, setUrlCopied] = useState(false)

  const fetchDriveInfo = async () => {
    try {
      const response = await fetch(
        `${GOOGLE_DRIVE_API_BASE}/files/${driveId}?` +
          new URLSearchParams({
            key: GOOGLE_DRIVE_API_KEY,
            fields: "id,name,parents",
          }),
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch drive info: ${response.status}`)
      }

      const data = await response.json()
      setDriveInfo(data)
    } catch (err) {
      console.error("Error fetching drive info:", err)
    }
  }

  const fetchDriveFiles = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `${GOOGLE_DRIVE_API_BASE}/files?` +
          new URLSearchParams({
            key: GOOGLE_DRIVE_API_KEY,
            q: `'${driveId}' in parents and trashed=false`,
            fields: "files(id,name,mimeType,size,modifiedTime,createdTime,owners,webViewLink,webContentLink,thumbnailLink,parents)",
            orderBy: "folder,modifiedTime desc",
            pageSize: "100",
          }),
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status} ${response.statusText}`)
      }

      const data: DriveResponse = await response.json()
      setFiles(data.files || [])
      setFilteredFiles(data.files || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching files")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (driveId) {
      fetchDriveInfo()
      fetchDriveFiles()
    }
  }, [driveId])

  useEffect(() => {
    const filtered = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredFiles(filtered)
  }, [searchQuery, files])

  const handleFolderClick = (folder: DriveFile) => {
    if (folder.mimeType.includes("folder")) {
      // Navigate to the folder using the new structure
      router.push(`/drive/${driveId}/${folder.id}`)
    }
  }

  const handleView = (file: DriveFile) => {
    if (file.mimeType.includes("folder")) {
      handleFolderClick(file)
    } else if (file.webViewLink) {
      window.open(file.webViewLink, "_blank")
    }
  }

  const handleDownload = (file: DriveFile) => {
    if (file.webContentLink) {
      window.open(file.webContentLink, "_blank")
    } else if (file.webViewLink) {
      window.open(file.webViewLink, "_blank")
    }
  }

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303]">
      <Navigation />

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      <ScrollAnimatedSection className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex items-center justify-end mb-6">
              <Button
                onClick={copyCurrentUrl}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                {urlCopied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Folder className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-white/60 tracking-wide">Drive Root</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              {driveInfo ? (
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {driveInfo.name}
                </span>
              ) : (
                <>
                  Drive{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Content
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-white/60 max-w-2xl mx-auto mb-8"
            >
              Explore and manage your Google Drive files with our beautiful interface
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-md mx-auto relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </motion.div>
          </div>
        </div>
      </ScrollAnimatedSection>

      <ScrollAnimatedSection className="pb-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <ScrollAnimatedSection animation="slideUp" delay={0.1}>
              <Card className="bg-white/[0.02] border-white/10 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-white mb-1">{filteredFiles.length}</div>
                  <div className="text-sm text-white/60">Total Items</div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection animation="slideUp" delay={0.2}>
              <Card className="bg-white/[0.02] border-white/10 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {filteredFiles.filter((f) => f.mimeType.includes("folder")).length}
                  </div>
                  <div className="text-sm text-white/60">Folders</div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection animation="slideUp" delay={0.3}>
              <Card className="bg-white/[0.02] border-white/10 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {filteredFiles.filter((f) => f.mimeType.includes("image")).length}
                  </div>
                  <div className="text-sm text-white/60">Images</div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>

            <ScrollAnimatedSection animation="slideUp" delay={0.4}>
              <Card className="bg-white/[0.02] border-white/10 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-white mb-1">
                    {
                      filteredFiles.filter((f) => !f.mimeType.includes("folder") && !f.mimeType.includes("image"))
                        .length
                    }
                  </div>
                  <div className="text-sm text-white/60">Documents</div>
                </CardContent>
              </Card>
            </ScrollAnimatedSection>
          </div>

          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-12 h-12 border-4 border-white/20 border-t-blue-500 rounded-full mb-4"
                />
                <p className="text-white/60">Loading drive contents...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-20"
              >
                <Card className="bg-red-500/10 border-red-500/20 max-w-md mx-auto">
                  <CardContent className="p-6">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Error Loading Files</h3>
                    <p className="text-white/60 mb-4">{error}</p>
                    <Button
                      onClick={fetchDriveFiles}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      disabled={loading}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {!loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredFiles.map((file, index) => {
                  const FileIcon = getFileIcon(file.mimeType)
                  const isFolder = file.mimeType.includes("folder")
                  const isImage = file.mimeType.includes("image")

                  return (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-all duration-300 group h-full ${
                          isFolder ? "cursor-pointer hover:border-blue-500/30" : ""
                        }`}
                        onClick={isFolder ? () => handleFolderClick(file) : undefined}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                                isFolder
                                  ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
                                  : isImage
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-purple-500/20 text-purple-400"
                              }`}
                            >
                              {isImage && file.thumbnailLink ? (
                                <img
                                  src={file.thumbnailLink}
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <FileIcon className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-white text-sm font-medium truncate" title={file.name}>
                                {file.name}
                              </CardTitle>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant="outline"
                                  className={`text-xs bg-white/5 border-white/20 text-white/60 ${
                                    isFolder ? "border-blue-500/30 text-blue-400" : ""
                                  }`}
                                >
                                  {isFolder ? "Folder" : file.mimeType.split("/")[1]?.toUpperCase() || "File"}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <div className="space-y-2 text-xs text-white/50 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3" />
                              <span>Modified: {formatDate(file.modifiedTime)}</span>
                            </div>
                            {file.size && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                <span>Size: {formatFileSize(file.size)}</span>
                              </div>
                            )}
                            {file.owners?.[0] && (
                              <div className="flex items-center gap-2">
                                <User className="w-3 h-3" />
                                <span className="truncate">Owner: {file.owners[0].displayName}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleView(file)
                              }}
                              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {isFolder ? "Open" : "View"}
                            </Button>
                            {!isFolder && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDownload(file)
                                }}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 text-xs"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && !error && filteredFiles.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <Folder className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Files Found</h3>
              <p className="text-white/60">
                {searchQuery ? "No files match your search criteria." : "This drive appears to be empty."}
              </p>
            </motion.div>
          )}
        </div>
      </ScrollAnimatedSection>
    </div>
  )
}