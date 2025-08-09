"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Youtube, ArrowRight, Info } from "lucide-react"
import Navigation from "@/components/navigation"
import { useRouter } from "next/navigation"

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
        duration: 1.2,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 0.6 },
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

export default function YouTubeHomePage() {
  const [playlistId, setPlaylistId] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (playlistId.trim()) {
      // Extract playlist ID from URL if full URL is provided
      let extractedId = playlistId.trim()
      const urlMatch = playlistId.match(/[?&]list=([^&]+)/)
      if (urlMatch) {
        extractedId = urlMatch[1]
      }
      router.push(`/youtube/${encodeURIComponent(extractedId)}`)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303]">
      <Navigation />

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.05] via-transparent to-purple-500/[0.05] blur-3xl" />
        <ElegantShape
          delay={0.1}
          width={600}
          height={140}
          rotate={12}
          gradient="from-red-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.2}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-purple-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.15}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-pink-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.25}
          width={200}
          height={60}
          rotate={20}
          gradient="from-orange-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                <Youtube className="w-4 h-4 text-red-400" />
                <span className="text-sm text-white/60 tracking-wide">YouTube Playlist Viewer</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Watch Your{" "}
                <span className="bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                  Playlists
                </span>
              </h1>

              <p className="text-lg text-white/60 leading-relaxed">
                Enter your YouTube playlist ID or URL to watch videos with our beautiful interface
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Enter Playlist Details</CardTitle>
                  <CardDescription className="text-white/60">
                    Provide the YouTube playlist ID or full URL to access its videos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="playlistId" className="text-white/80">
                        YouTube Playlist ID or URL
                      </Label>
                      <Input
                        id="playlistId"
                        type="text"
                        placeholder="e.g., PLrAXtmRdnEQy6nuLMfO2GiN8nmorjYeRo or full YouTube URL"
                        value={playlistId}
                        onChange={(e) => setPlaylistId(e.target.value)}
                        className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-red-500/50 focus:ring-red-500/20"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-300 group"
                      disabled={!playlistId.trim()}
                    >
                      Watch Playlist
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-8"
            >
              <Card className="bg-red-500/5 border-red-500/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h3 className="text-white font-medium mb-2">How to find your Playlist ID</h3>
                      <p className="text-white/60 text-sm leading-relaxed mb-3">
                        Open your YouTube playlist in a web browser. The playlist ID is the string after "list=" in the
                        URL.
                      </p>
                      <p className="text-white/60 text-sm leading-relaxed">
                        <strong>Example:</strong> In the URL
                        "https://www.youtube.com/playlist?list=PLrAXtmRdnEQy6nuLMfO2GiN8nmorjYeRo", the ID is
                        "PLrAXtmRdnEQy6nuLMfO2GiN8nmorjYeRo".
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
