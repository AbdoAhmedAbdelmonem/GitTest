"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  FileText,
  Folder,
  FileImage,
  FileVideo,
  FileAudio,
  FileArchive,
  NotebookPen,
  FilePlus,
  FileSpreadsheet,
  FileJson,
  FileCode,
  File,
  Download,
  Search,
  Calendar,
  User,
  Eye,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Home,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react"
import Navigation from "@/components/navigation"
import { useParams, useRouter } from "next/navigation"

// Google Drive API configuration
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

interface BreadcrumbItem {
  id: string
  name: string
  path: string[]
}

interface CacheItem {
  data: DriveFile[]
  timestamp: number
}

const CACHE_EXPIRATION = 5 * 60 * 1000
const driveCache = new Map<string, CacheItem>()



function getFileIcon(mimeType: string) {
  if (mimeType.includes("folder")) return Folder
  if (mimeType.includes("image")) return FileImage
  if (mimeType.includes("video")) return FileVideo
  if (mimeType.includes("audio")) return FileAudio
  if (mimeType.includes("pdf")) return NotebookPen
  if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("7z")) return FileArchive
  if (mimeType.includes("json")) return FileJson
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return FileSpreadsheet
  if (mimeType.includes("document") || mimeType.includes("word")) return FilePlus
  if (mimeType.includes("text") || mimeType.includes("plain")) return FileText
  if (mimeType.includes("code") || mimeType.includes("javascript") || mimeType.includes("typescript")) return FileCode
  return File
}

function formatFileSize(bytes?: string) {
  if (!bytes) return "Unknown size"
  const size = Number.parseInt(bytes)
  if (size === 0) return "0 B"
  
  const units = ["B", "KB", "MB", "GB", "TB"]
  let unitIndex = 0
  let fileSize = size

  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024
    unitIndex++
  }

  return `${fileSize.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
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

type SortOption = "name" | "modified" | "size" | "type"

export default function DrivePage() {
  const params = useParams()
  const router = useRouter()
  const driveId = params.driveId as string
  const folderPath = (params.folderPath as string[]) || []

  const [files, setFiles] = useState<DriveFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredFiles, setFilteredFiles] = useState<DriveFile[]>([])
  const [currentFolder, setCurrentFolder] = useState<FolderInfo | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const [urlCopied, setUrlCopied] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [nextPageToken, setNextPageToken] = useState<string | undefined>(undefined)
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const currentFolderId = folderPath.length > 0 ? folderPath[folderPath.length - 1] : driveId
  const isRootLevel = folderPath.length === 0

  const fetchFolderInfo = async (folderId: string): Promise<FolderInfo | null> => {
    try {
      const cacheKey = `folder-info-${folderId}`
      const cached = driveCache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION) {
        return cached.data[0] as unknown as FolderInfo
      }

      const response = await fetch(
        `${GOOGLE_DRIVE_API_BASE}/files/${folderId}?` +
          new URLSearchParams({
            key: GOOGLE_DRIVE_API_KEY,
            fields: "id,name,parents",
          }),
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch folder info: ${response.statusText}`)
      }

      const data = await response.json()
      driveCache.set(cacheKey, { data: [data], timestamp: Date.now() })
      return data
    } catch (err) {
      console.error("Error fetching folder info:", err)
      setError(err instanceof Error ? err.message : "Failed to load folder information")
      return null
    }
  }

  const fetchFolderContents = useCallback(async (folderId: string, pageToken?: string) => {
    try {
      const cacheKey = `folder-contents-${folderId}-${pageToken || 'initial'}`
      const cached = driveCache.get(cacheKey)
      
      if (cached && Date.now() - cached.timestamp < CACHE_EXPIRATION) {
        setFiles(cached.data)
        setFilteredFiles(cached.data)
        return
      }

      pageToken ? setIsFetchingMore(true) : setLoading(true)
      setError(null)

      const response = await fetch(
        `${GOOGLE_DRIVE_API_BASE}/files?` +
          new URLSearchParams({
            key: GOOGLE_DRIVE_API_KEY,
            q: `'${folderId}' in parents and trashed=false`,
            fields:
              "files(id,name,mimeType,size,modifiedTime,createdTime,owners,webViewLink,webContentLink,thumbnailLink,parents)",
            orderBy: "folder,modifiedTime desc",
            pageSize: "100",
            ...(pageToken ? { pageToken } : {}),
          }),
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.statusText}`)
      }

      const data: DriveResponse = await response.json()
      
      if (pageToken) {
        setFiles(prev => [...prev, ...(data.files || [])])
        setFilteredFiles(prev => [...prev, ...(data.files || [])])
      } else {
        setFiles(data.files || [])
        setFilteredFiles(data.files || [])
      }
      
      setNextPageToken(data.nextPageToken)
      driveCache.set(cacheKey, { data: data.files || [], timestamp: Date.now() })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while loading files")
    } finally {
      pageToken ? setIsFetchingMore(false) : setLoading(false)
    }
  }, [])

  const buildBreadcrumbs = async () => {
    try {
      const breadcrumbList: BreadcrumbItem[] = []

      // Add root folder
      const rootFolder = await fetchFolderInfo(driveId)
      if (rootFolder) {
        breadcrumbList.push({
          id: driveId,
          name: rootFolder.name || "Drive Root",
          path: [],
        })
      }

      // Add each folder in the path
      if (folderPath.length > 0) {
        for (let i = 0; i < folderPath.length; i++) {
          const folderId = folderPath[i]
          const folderInfo = await fetchFolderInfo(folderId)
          if (folderInfo) {
            breadcrumbList.push({
              id: folderId,
              name: folderInfo.name,
              path: folderPath.slice(0, i + 1),
            })
          }
        }
      }

      setBreadcrumbs(breadcrumbList)
    } catch (err) {
      console.error("Error building breadcrumbs:", err)
    }
  }

  const handleFolderClick = (folder: DriveFile) => {
    if (folder.mimeType.includes("folder")) {
      const newPath = [...folderPath, folder.id]
      router.push(`/drive/${driveId}/${newPath.join("/")}`)
    }
  }

  const handleView = (file: DriveFile) => {
    if (file.mimeType.includes("folder")) {
      handleFolderClick(file)
    } else if (file.mimeType.includes("pdf")) {
      // Handle PDF files specifically
      if (file.webViewLink) {
        window.open(file.webViewLink, "_blank", "noopener,noreferrer")
      } else if (file.webContentLink) {
        window.open(
          `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(file.webContentLink)}`,
          "_blank",
          "noopener,noreferrer"
        )
      } else {
        setError("This PDF cannot be displayed directly")
      }
    } else {
      // Navigate to file viewer page for other file types
      router.push(`/drive/${driveId}/file/${file.id}`)
    }
  }

  const handleBreadcrumbClick = (breadcrumb: BreadcrumbItem) => {
    if (breadcrumb.path.length === 0) {
      router.push(`/drive/${driveId}`)
    } else {
      router.push(`/drive/${driveId}/${breadcrumb.path.join("/")}`)
    }
  }

  const handleDownload = (file: DriveFile) => {
    if (file.webContentLink) {
      window.open(file.webContentLink, "_blank", "noopener,noreferrer")
    } else if (file.webViewLink) {
      window.open(file.webViewLink, "_blank", "noopener,noreferrer")
    }
  }

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
      setError("Failed to copy URL to clipboard")
    }
  }

  const goBack = () => {
    if (folderPath.length > 0) {
      const newPath = folderPath.slice(0, -1)
      if (newPath.length === 0) {
        router.push(`/drive/${driveId}`)
      } else {
        router.push(`/drive/${driveId}/${newPath.join("/")}`)
      }
    }
  }

  const handleSort = (option: SortOption) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortOption(option)
      setSortDirection("asc")
    }
  }

  const loadMoreFiles = () => {
    if (nextPageToken && !isFetchingMore) {
      fetchFolderContents(currentFolderId, nextPageToken)
    }
  }

  // Sort files based on current sort option and direction
  useEffect(() => {
    const sorted = [...filteredFiles].sort((a, b) => {
      let comparison = 0

      switch (sortOption) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "modified":
          comparison = new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime()
          break
        case "size":
          comparison = (Number(a.size) || 0) - (Number(b.size) || 0)
          break
        case "type":
          comparison = a.mimeType.localeCompare(b.mimeType)
          break
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredFiles(sorted)
  }, [sortOption, sortDirection, files])

  // Filter files based on search
  useEffect(() => {
    const filtered = files.filter((file) => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredFiles(filtered)
  }, [searchQuery, files])

  // Load folder contents and info when path changes
  useEffect(() => {
    if (driveId) {
      fetchFolderContents(currentFolderId)
      buildBreadcrumbs()

      if (!isRootLevel) {
        fetchFolderInfo(currentFolderId).then(setCurrentFolder)
      } else {
        fetchFolderInfo(driveId).then((folder) => {
          setCurrentFolder(folder ? { ...folder, name: folder.name || "Drive Root" } : null)
        })
      }
    }
  }, [driveId, folderPath.join("/"), fetchFolderContents])

  return (
    <div className="min-h-screen bg-[#030303]">
      <Navigation />

      {/* Background Elements */}
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


      {/* Header Section */}
      <div className="pt-32 pb-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-8" style={{ marginTop: "-78px" }}>
            {/* Back Button and URL Copy */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {!isRootLevel && (
                  <Button
                    onClick={goBack}
                    variant="outline"
                    size="sm"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                    aria-label="Go back to previous folder"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
              </div>
              <Button
                onClick={copyCurrentUrl}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                aria-label="Copy current URL to clipboard"
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

            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb navigation">
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                {breadcrumbs.map((breadcrumb, index) => (
                  <div key={breadcrumb.id} className="flex items-center gap-2">
                    {index > 0 && <ChevronRight className="w-4 h-4 text-white/40" aria-hidden="true" />}
                    <button
                      onClick={() => handleBreadcrumbClick(breadcrumb)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors duration-150 ${
                        index === breadcrumbs.length - 1
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                      aria-current={index === breadcrumbs.length - 1 ? "page" : false}
                    >
                      {index === 0 ? (
                        <Home className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Folder className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span className="text-sm font-medium">{breadcrumb.name}</span>
                    </button>
                  </div>
                ))}
              </div>
            </nav>
          </div>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <Folder className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span className="text-sm text-white/60 tracking-wide">
                {isRootLevel ? "Drive Root" : "Folder Contents"}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {currentFolder ? (
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {currentFolder.name}
                </span>
              ) : (
                <>
                  Drive{" "}
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Content
                  </span>
                </>
              )}
            </h1>

            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
              {isRootLevel
                ? "Explore and manage your Google Drive files with our beautiful interface"
                : `Exploring the contents of ${currentFolder?.name || "this folder"}`}
            </p>

            {/* Search and Sort Controls */}
            <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" aria-hidden="true" />
                <Input
                  type="text"
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-blue-500/50 focus:ring-blue-500/20"
                  aria-label="Search files"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("name")}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Name {sortOption === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSort("modified")}
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  Modified {sortOption === "modified" && (sortDirection === "asc" ? "↑" : "↓")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <Card className="bg-white/[0.02] border-white/10 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white mb-1">{filteredFiles.length}</div>
                <div className="text-sm text-white/60">Total Items</div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {filteredFiles.filter((f) => f.mimeType.includes("folder")).length}
                </div>
                <div className="text-sm text-white/60">Folders</div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {filteredFiles.filter((f) => f.mimeType.includes("image")).length}
                </div>
                <div className="text-sm text-white/60">Images</div>
              </CardContent>
            </Card>

            <Card className="bg-white/[0.02] border-white/10 text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-white mb-1">
                  {filteredFiles.filter((f) => !f.mimeType.includes("folder") && !f.mimeType.includes("image")).length}
                </div>
                <div className="text-sm text-white/60">Documents</div>
              </CardContent>
            </Card>
          </div>

          {/* Loading State */}
          <AnimatePresence>
            {loading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin mb-4" />
                <p className="text-white/60">Loading folder contents...</p>
              </div>
            )}
          </AnimatePresence>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <div className="text-center py-20">
                <Card className="bg-red-500/10 border-red-500/20 max-w-md mx-auto">
                  <CardContent className="p-6">
                    <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Error Loading Files</h3>
                    <p className="text-white/60 mb-4">{error}</p>
                    <Button
                      onClick={() => fetchFolderContents(currentFolderId)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                      disabled={loading}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </AnimatePresence>

          {/* Files Grid */}
          <AnimatePresence>
            {!loading && !error && (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFiles.map((file) => {
                    const FileIcon = getFileIcon(file.mimeType)
                    const isFolder = file.mimeType.includes("folder")
                    const isImage = file.mimeType.includes("image")
                    const isPDF = file.mimeType.includes("pdf")

                    return (
                      <Card
                        key={file.id}
                        className={`bg-white/[0.02] border-white/10 hover:bg-white/[0.04] transition-colors duration-150 group h-full ${
                          isFolder ? "cursor-pointer hover:border-blue-500/30" : ""
                        }`}
                        onClick={isFolder ? () => handleFolderClick(file) : undefined}
                        role={isFolder ? "button" : "article"}
                        aria-label={isFolder ? `Open folder ${file.name}` : `File ${file.name}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-150 ${
                                isFolder
                                  ? "bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30"
                                  : isPDF
                                    ? "bg-red-500/20 text-red-400"
                                    : isImage
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-purple-500/20 text-purple-400"
                              }`}
                            >
                              {isImage && file.thumbnailLink ? (
                                <img
                                  src={file.thumbnailLink.replace('=s220', '=s500') || "/placeholder.svg"}
                                  alt={file.name}
                                  className="w-full h-full object-cover rounded-lg"
                                  loading="lazy"
                                />
                              ) : (
                                <FileIcon className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-white text-sm font-medium truncate" title={file.name}>
                                {file.name}
                                {isFolder && <ChevronRight className="inline w-4 h-4 ml-1 opacity-60" />}
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
                              aria-label={isFolder ? `Open folder ${file.name}` : `View file ${file.name}`}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              {isFolder ? "Open" : isPDF ? "View PDF" : "View"}
                            </Button>
                            {!isFolder && (
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDownload(file)
                                }}
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30 text-xs"
                                aria-label={`Download file ${file.name}`}
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Load More Button */}
                {nextPageToken && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={loadMoreFiles}
                      variant="outline"
                      className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      disabled={isFetchingMore}
                    >
                      {isFetchingMore ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More Files"
                      )}
                    </Button>
                  </div>
                )}
              </>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!loading && !error && filteredFiles.length === 0 && (
            <div className="text-center py-20">
              <Folder className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Files Found</h3>
              <p className="text-white/60">
                {searchQuery ? "No files match your search criteria." : "This folder appears to be empty."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}