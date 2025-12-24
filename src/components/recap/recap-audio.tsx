'use client'

import { useRef, useEffect, useState } from 'react'
import { Volume2, Music, Sparkles } from 'lucide-react'

interface RecapAudioProps {
  onReady?: () => void
}

export default function RecapAudio({ onReady }: RecapAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showStartButton, setShowStartButton] = useState(true)

  const startExperience = async () => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = 0.5
        await audioRef.current.play()
        setIsPlaying(true)
        setShowStartButton(false)
        onReady?.()
      } catch (error) {
        console.error('Failed to play audio:', error)
        // Even if audio fails, still start the experience
        setShowStartButton(false)
        onReady?.()
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  if (showStartButton) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
           style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0d0d1f 100%)' }}>
        
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Floating particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-2xl mx-auto">
          {/* Floating emoji icons */}
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex gap-8">
            <span className="text-4xl sm:text-5xl animate-float-icon" style={{ animationDelay: '0s' }}>🎉</span>
            <span className="text-5xl sm:text-6xl animate-float-icon" style={{ animationDelay: '0.5s' }}>🦎</span>
            <span className="text-4xl sm:text-5xl animate-float-icon" style={{ animationDelay: '1s' }}>✨</span>
          </div>

          {/* Year badge */}
          <div className="mb-6 sm:mb-8 animate-zoom-fade">
            <span className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300 font-space text-sm sm:text-base">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              END OF YEAR SPECIAL
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
          </div>

          {/* Main title */}
          <h1 
            className="text-4xl sm:text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-4 sm:mb-6 animate-text-reveal tracking-tight"
            style={{ fontFamily: "'forte', sans-serif" }}
          >
            CHAMELEON
          </h1>
          
          <h2 className="font-poppins text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 animate-text-reveal" style={{ animationDelay: '0.2s' }}>
            Recap <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">2025</span>
          </h2>

          <p className="font-space text-base sm:text-lg md:text-xl text-white/60 max-w-md mx-auto mb-8 sm:mb-12 animate-text-reveal px-4" style={{ animationDelay: '0.4s' }}>
            Get ready for an epic journey through your year of learning and achievements
          </p>

          {/* Start button */}
          <div className="animate-text-reveal" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={startExperience}
              className="group relative px-8 sm:px-16 py-4 sm:py-6 rounded-full font-poppins text-lg sm:text-2xl font-bold text-white overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95"
            >
              {/* Button gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-gradient" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              
              {/* Button content */}
              <span className="relative flex items-center gap-3 sm:gap-4">
                <Music className="w-5 h-5 sm:w-7 sm:h-7 animate-pulse" />
                <span>Start Your Recap</span>
                <Volume2 className="w-5 h-5 sm:w-7 sm:h-7" />
              </span>
            </button>
          </div>

          {/* Sound hint */}
          <p className="font-space text-xs sm:text-sm text-white/40 mt-6 sm:mt-8 animate-text-reveal flex items-center justify-center gap-2" style={{ animationDelay: '0.8s' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Best experienced with sound on
          </p>
        </div>

        {/* Hidden audio element with preload */}
        <audio
          ref={audioRef}
          src="/audio/recap-audio.mp3"
          loop
          preload="auto"
        />
      </div>
    )
  }

  return (
    <audio
      ref={audioRef}
      src="/audio/recap-audio.mp3"
      loop
      autoPlay
      className="hidden"
    />
  )
}
