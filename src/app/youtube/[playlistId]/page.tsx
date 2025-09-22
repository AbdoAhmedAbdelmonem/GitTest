"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Play,
  Search,
  Clock,
  Eye,
  ThumbsUp,
  Calendar,
  ArrowLeft,
  Copy,
  Check,
  AlertCircle,
  RefreshCw,
  Youtube,
  List,
  ExternalLink,
} from "lucide-react"
import Navigation from "@/components/navigation"
import ScrollAnimatedSection from "@/components/scroll-animated-section"
import { useParams, useRouter } from "next/navigation"

// YouTube API configuration
const YOUTUBE_API_KEY = "AIzaSyCBwCuVsuYAPoT4lkCoqBMiL3CwT439KnQ"
const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3"

interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnails: {
    default: { url: string }
    medium: { url: string }
    high: { url: string }
  }
  publishedAt: string
  duration: string
  viewCount?: string
  likeCount?: string
  channelTitle: string
  videoId: string
}

interface PlaylistInfo {
  id: string
  title: string
  description: string
  channelTitle: string
  publishedAt: string
  thumbnails: {
    high: { url: string }
  }
  itemCount: number
}

function formatDuration(duration: string) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return "0:00"

  const hours = Number.parseInt(match[1]?.replace("H", "") || "0")
  const minutes = Number.parseInt(match[2]?.replace("M", "") || "0")
  const seconds = Number.parseInt(match[3]?.replace("S", "") || "0")

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function formatNumber(num: string | undefined) {
  if (!num) return "0"
  const number = Number.parseInt(num)
  if (number >= 1000000) {
    return `${(number / 1000000).toFixed(1)}M`
  }
  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`
  }
  return number.toString()
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function YouTubePlaylistPage() {
  const params = useParams()
  const router = useRouter()
  const playlistId = params.playlistId as string

  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [playlistInfo, setPlaylistInfo] = useState<PlaylistInfo | null>(null)
  const [currentVideo, setCurrentVideo] = useState<YouTubeVideo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([])
  const [urlCopied, setUrlCopied] = useState(false)

  const fetchPlaylistInfo = async () => {
    try {
      const response = await fetch(
        `${YOUTUBE_API_BASE}/playlists?` +
          new URLSearchParams({
            key: YOUTUBE_API_KEY,
            id: playlistId,
            part: "snippet,contentDetails",
          }),
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist info: ${response.status}`)
      }

      const data = await response.json()
      if (data.items && data.items.length > 0) {
        const playlist = data.items[0]
        setPlaylistInfo({
          id: playlist.id,
          title: playlist.snippet.title,
          description: playlist.snippet.description,
          channelTitle: playlist.snippet.channelTitle,
          publishedAt: playlist.snippet.publishedAt,
          thumbnails: playlist.snippet.thumbnails,
          itemCount: playlist.contentDetails.itemCount,
        })
      }
    } catch (err) {
      console.error("Error fetching playlist info:", err)
    }
  }

  const fetchPlaylistVideos = async () => {
    try {
      setLoading(true)
      setError(null)

      const playlistResponse = await fetch(
        `${YOUTUBE_API_BASE}/playlistItems?` +
          new URLSearchParams({
            key: YOUTUBE_API_KEY,
            playlistId: playlistId,
            part: "snippet",
            maxResults: "50",
          }),
      )

      if (!playlistResponse.ok) {
        throw new Error(`Failed to fetch playlist: ${playlistResponse.status}`)
      }

      const playlistData = await playlistResponse.json()
      const videoIds = playlistData.items
        .map((item: any) => item.snippet.resourceId.videoId)
        .filter(Boolean)
        .join(",")

      if (!videoIds) {
        setVideos([])
        setFilteredVideos([])
        return
      }

      const videosResponse = await fetch(
        `${YOUTUBE_API_BASE}/videos?` +
          new URLSearchParams({
            key: YOUTUBE_API_KEY,
            id: videoIds,
            part: "snippet,contentDetails,statistics",
          }),
      )

      if (!videosResponse.ok) {
        throw new Error(`Failed to fetch video details: ${videosResponse.status}`)
      }

      const videosData = await videosResponse.json()
      const processedVideos: YouTubeVideo[] = videosData.items.map((video: any) => ({
        id: video.id,
        videoId: video.id,
        title: video.snippet.title,
        description: video.snippet.description,
        thumbnails: video.snippet.thumbnails,
        publishedAt: video.snippet.publishedAt,
        duration: video.contentDetails.duration,
        viewCount: video.statistics.viewCount,
        likeCount: video.statistics.likeCount,
        channelTitle: video.snippet.channelTitle,
      }))

      setVideos(processedVideos)
      setFilteredVideos(processedVideos)

      if (processedVideos.length > 0 && !currentVideo) {
        setCurrentVideo(processedVideos[0])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while fetching videos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (playlistId) {
      fetchPlaylistInfo()
      fetchPlaylistVideos()
    }
  }, [playlistId])

  useEffect(() => {
    const filtered = videos.filter((video) => video.title.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredVideos(filtered)
  }, [searchQuery, videos])

  const copyCurrentUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setUrlCopied(true)
      setTimeout(() => setUrlCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  const goBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-[#030303] overflow-x-hidden font-rubik">
      <Navigation />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
        {/* Static background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: "url(/images/Background.png)" }}
        />
      </div>

      {/* Header Section */}
      <ScrollAnimatedSection className="pt-24 md:pt-32 pb-6 md:pb-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="mb-6 md:mb-8" style={{ marginTop: "-80px" }}>
            {/* Back Button and Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4 md:mb-6">
              <Button
                onClick={goBack}
                variant="outline"
                size="sm"
                className="w-full md:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white/80 font-rubik"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Materials
              </Button>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                  onClick={copyCurrentUrl}
                  variant="outline"
                  size="sm"
                  className="w-1/2 md:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 hover:text-white/80 font-rubik"
                >
                  {urlCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
                {playlistInfo && (
                  <Button
                    onClick={() => window.open(`https://www.youtube.com/playlist?list=${playlistId}`, "_blank")}
                    size="sm"
                    className="w-1/2 md:w-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-rubik"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="truncate">Open in YouTube</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="text-center mb-6 md:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6"
            >
              <Youtube className="w-4 h-4 text-red-400" />
              <span className="text-sm text-white/60 tracking-wide font-rubik">YouTube Playlist</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-white mb-4 font-rubik"
            >
              <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                {playlistInfo?.title || "Loading Playlist..."}
              </span>
            </motion.h1>

            {playlistInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-white/60 mb-4 md:mb-6 text-sm md:text-base font-rubik"
              >
                <span className="flex items-center gap-1 font-rubik">
                  <List className="w-4 h-4" />
                  {playlistInfo.itemCount} videos
                </span>
                <span className="flex items-center gap-1 font-rubik">
                  <Calendar className="w-4 h-4" />
                  {formatDate(playlistInfo.publishedAt)}
                </span>
                <span className="truncate max-w-xs font-rubik">{playlistInfo.channelTitle}</span>
              </motion.div>
            )}

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="max-w-md mx-auto relative"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-red-500/50 focus:ring-red-500/20 font-rubik"
              />
            </motion.div>
          </div>
        </div>
      </ScrollAnimatedSection>

      {/* Main Content */}
      <ScrollAnimatedSection className="pb-20 relative z-10">
        <div className="container mx-auto px-4">
          {/* Loading State */}
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
                  className="w-12 h-12 border-4 border-white/20 border-t-red-500 rounded-full mb-4"
                />
                <p className="text-white/60 font-rubik">Loading playlist videos...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error State */}
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
                    <h3 className="text-lg font-semibold text-white mb-2 font-rubik">Error Loading Playlist</h3>
                    <p className="text-white/60 mb-4 font-rubik">{error}</p>
                    <Button
                      onClick={fetchPlaylistVideos}
                      className="bg-red-500 hover:bg-red-600 text-white font-rubik"
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

          {/* Two Column Layout */}
          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {/* Video List - Left Side */}
              <div className="lg:col-span-1 order-2 lg:order-1">
                <Card className="bg-white/[0.02] border-white/10 h-fit max-h-[600px] lg:max-h-[800px] overflow-hidden">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-white flex items-center gap-2 font-rubik">
                      <List className="w-5 h-5" />
                      Videos ({filteredVideos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-y-auto max-h-[550px] lg:max-h-[700px] custom-youtube-scrollbar">
                      {filteredVideos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                          onClick={() => setCurrentVideo(video)}
                          className={`p-3 sm:p-4 border-b border-white/5 cursor-pointer transition-all duration-300 hover:bg-white/5 ${
                            currentVideo?.id === video.id ? "bg-red-500/10 border-l-4 border-l-red-500" : ""
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className="relative flex-shrink-0">
                              <img
                                src={video.thumbnails.medium?.url || "/placeholder.svg"}
                                alt={video.title}
                                className="w-16 h-12 sm:w-20 sm:h-14 object-cover rounded-lg"
                              />
                              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded font-rubik">
                                {formatDuration(video.duration)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className={`font-medium text-sm leading-tight mb-1 sm:mb-2 truncate font-rubik ${
                                  currentVideo?.id === video.id ? "text-red-400" : "text-white"
                                }`}
                                title={video.title}
                              >
                                {video.title}
                              </h3>
                              <div className="flex items-center gap-2 sm:gap-3 text-xs text-white/50 font-rubik">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {formatNumber(video.viewCount)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(video.publishedAt)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Video Player - Right Side */}
              <div className="lg:col-span-2 order-1 lg:order-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Card className="bg-white/[0.02] border-white/10">
                    <CardContent className="p-4 md:p-6">
                      {currentVideo ? (
                        <div>
                          {/* Video Player */}
                          <div className="aspect-video w-full mb-4 md:mb-6 rounded-lg overflow-hidden bg-black">
                            <iframe
                              src={`https://www.youtube.com/embed/${currentVideo.videoId}?autoplay=1&rel=0`}
                              title={currentVideo.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>

                          {/* Video Info */}
                          <div>
                            <h2 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4 font-rubik">{currentVideo.title}</h2>

                            <div className="flex flex-wrap items-center gap-3 md:gap-6 mb-3 md:mb-4 text-white/60 text-sm md:text-base font-rubik">
                              <span className="flex items-center gap-2">
                                <Eye className="w-3 h-3 md:w-4 md:h-4" />
                                {formatNumber(currentVideo.viewCount)} views
                              </span>
                              <span className="flex items-center gap-2">
                                <ThumbsUp className="w-3 h-3 md:w-4 md:h-4" />
                                {formatNumber(currentVideo.likeCount)} likes
                              </span>
                              <span className="flex items-center gap-2">
                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                {formatDuration(currentVideo.duration)}
                              </span>
                              <span className="flex items-center gap-2">
                                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                                {formatDate(currentVideo.publishedAt)}
                              </span>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-3 md:mb-4">
                              <Badge variant="outline" className="bg-red-500/20 border-red-500/30 text-red-400 font-rubik">
                                {currentVideo.channelTitle}
                              </Badge>
                              <Button
                                onClick={() =>
                                  window.open(`https://www.youtube.com/watch?v=${currentVideo.videoId}`, "_blank")
                                }
                                variant="outline"
                                size="sm"
                                className="w-full md:w-auto bg-white/5 border-white/20 text-white hover:bg-white/10 font-rubik"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Watch on YouTube
                              </Button>
                            </div>

                            {currentVideo.description && (
                              <div className="bg-white/5 rounded-lg p-3 md:p-4">
                                <h3 className="text-white font-medium mb-1 md:mb-2 font-rubik">Description</h3>
                                <p className="text-white/70 text-sm leading-relaxed truncate font-rubik">
                                  {currentVideo.description}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="aspect-video flex items-center justify-center bg-white/5 rounded-lg">
                          <div className="text-center">
                            <Play className="w-12 h-12 md:w-16 md:h-16 text-white/40 mx-auto mb-3 md:mb-4" />
                            <p className="text-white/60 font-rubik">Select a video to start watching</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredVideos.length === 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
              <Youtube className="w-12 h-12 md:w-16 md:h-16 text-white/20 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2 font-rubik">No Videos Found</h3>
              <p className="text-white/60 font-rubik">
                {searchQuery ? "No videos match your search criteria." : "This playlist appears to be empty."}
              </p>
            </motion.div>
          )}
        </div>
      </ScrollAnimatedSection>

      <style jsx>{`
        .custom-youtube-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-youtube-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-youtube-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #ef4444, #ec4899);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-youtube-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #dc2626, #db2777);
        }
        .custom-youtube-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  )
}
