'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getStudentSession } from '@/lib/auth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import RecapAudio from '@/components/recap/recap-audio'
import { type RecapData } from '@/lib/recap-types'
import { X, Share2, ChevronRight, Trophy, Target, Flame, Calendar, Users, Award, Zap, Clock } from 'lucide-react'
import Image from 'next/image'

const SLIDE_DURATION = 5500 // 5.5 seconds per slide

// Gradient backgrounds for each slide
const gradients = [
  'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #2d1b4e 100%)',
  'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  'linear-gradient(135deg, #134e4a 0%, #115e59 50%, #0d9488 100%)',
  'linear-gradient(135deg, #7c2d12 0%, #9a3412 50%, #ea580c 100%)',
  'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #8b5cf6 100%)',
  'linear-gradient(135deg, #831843 0%, #be185d 50%, #ec4899 100%)',
  'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #3b82f6 100%)',
  'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a78bfa 100%)',
  'linear-gradient(135deg, #78350f 0%, #b45309 50%, #f59e0b 100%)',
  'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
]

// Complex animation variants for slides
const slideVariants = {
  initial: (direction: number) => ({
    opacity: 0,
    scale: 0.8,
    rotateY: direction > 0 ? 45 : -45,
    filter: 'blur(20px)',
  }),
  animate: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 1.2,
    rotateY: direction > 0 ? -45 : 45,
    filter: 'blur(20px)',
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Content animation variants with stagger
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.9,
    rotateX: -15,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

const numberVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.3,
    rotate: -180,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    rotate: 0,
    transition: {
      duration: 1,
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
}

export default function RecapPage() {
  const router = useRouter()
  const [recapData, setRecapData] = useState<RecapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [direction, setDirection] = useState(1)

  const totalSlides = 10

  useEffect(() => {
    const fetchRecapData = async () => {
      const session = getStudentSession()
      if (!session) {
        router.push('/auth')
        return
      }

      try {
        const response = await fetch(`/api/recap/${session.user_id}`)
        if (!response.ok) throw new Error('Failed to fetch recap data')
        const data = await response.json()
        setRecapData(data)
      } catch (err) {
        setError('Failed to load your recap. Please try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecapData()
  }, [router])

  // Auto-advance slides
  useEffect(() => {
    if (!hasStarted || isComplete) return

    const timer = setInterval(() => {
      setDirection(1)
      setCurrentSlide(prev => {
        if (prev >= totalSlides - 1) {
          setIsComplete(true)
          return prev
        }
        return prev + 1
      })
    }, SLIDE_DURATION)

    return () => clearInterval(timer)
  }, [hasStarted, isComplete])

  const handleStart = useCallback(() => {
    setHasStarted(true)
  }, [])

  const handleExit = useCallback(() => {
    router.push('/')
  }, [router])

  const handleShare = async () => {
    if (navigator.share && recapData) {
      try {
        await navigator.share({
          title: 'My Chameleon 2025 Recap',
          text: `I'm a ${recapData.personalizedTitle}! I took ${recapData.totalQuizzes} quizzes with ${recapData.averageScore}% avg on Chameleon FCDS! 🦎`,
          url: window.location.origin
        })
      } catch {
        console.log('Share cancelled')
      }
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: gradients[0] }}>
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="text-6xl mb-6"
          >
            🦎
          </motion.div>
          <LoadingSpinner size="lg" />
          <p className="font-space text-white/60 mt-4">Loading your epic recap...</p>
        </div>
      </div>
    )
  }

  if (error || !recapData) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ background: gradients[0] }}>
        <div className="text-center space-y-6 px-4">
          <div className="text-6xl mb-4">😔</div>
          <p className="font-poppins text-white text-xl">{error || 'Something went wrong'}</p>
          <button onClick={handleExit} className="px-8 py-3 bg-white/10 rounded-full font-space text-white hover:bg-white/20 transition">
            Go Home
          </button>
        </div>
      </div>
    )
  }

  // Render current slide content based on index
  const renderSlideContent = () => {
    switch (currentSlide) {
      case 0: // Intro
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.div variants={numberVariants} className="text-7xl sm:text-8xl md:text-9xl mb-6">👋</motion.div>
            <motion.h1 variants={itemVariants} className="font-fleur text-5xl sm:text-7xl md:text-9xl text-white mb-4">
              Hey, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">{recapData.username}!</span>
            </motion.h1>
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl md:text-3xl text-white/70">
              Let&apos;s look back at your incredible 2025
            </motion.p>
          </motion.div>
        )

      case 1: // Journey Start
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 mb-8 backdrop-blur-sm">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              <span className="font-space text-white/80 text-sm sm:text-base">Your Journey Began On</span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-fleur text-4xl sm:text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-6">
              {recapData.memberSince}
            </motion.h2>
            <motion.div variants={numberVariants} className="flex items-center justify-center gap-3">
              <span className="font-orbitron text-6xl sm:text-8xl md:text-9xl font-black text-white">
                {recapData.daysSinceJoined}
              </span>
              <span className="font-space text-xl sm:text-2xl md:text-3xl text-white/60 text-left">
                days as a<br />Chameleon 🦎
              </span>
            </motion.div>
          </motion.div>
        )

      case 2: // Quiz Stats
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/70 mb-6">
              This year, you tackled
            </motion.p>
            <motion.div variants={numberVariants} className="relative inline-block">
              <span className="font-orbitron text-8xl sm:text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                {recapData.totalQuizzes}
              </span>
              <motion.div 
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-4 -right-4 text-4xl sm:text-5xl"
              >
                📝
              </motion.div>
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-fleur text-4xl sm:text-6xl text-white mt-4">
              Quizzes!
            </motion.h2>
            <motion.p variants={itemVariants} className="font-space text-base sm:text-xl text-white/60 mt-4">
              That&apos;s <span className="text-emerald-400 font-bold">{recapData.totalQuestionsAnswered.toLocaleString()}</span> questions answered! 🤯
            </motion.p>
          </motion.div>
        )

      case 3: // Scores
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl w-full px-4">
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-2 mb-8">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-orange-300" />
              <span className="font-fleur text-3xl sm:text-4xl text-white/80">Your Scoring Game 🔥</span>
            </motion.div>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto">
              <motion.div variants={numberVariants} className="bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-sm border border-white/10">
                <p className="font-space text-xs sm:text-sm text-white/60 mb-2">Best Score</p>
                <p className="font-orbitron text-4xl sm:text-6xl md:text-7xl font-black text-white">
                  {recapData.bestScore}<span className="text-2xl sm:text-4xl">%</span>
                </p>
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl sm:text-3xl mt-2">🏆</motion.div>
              </motion.div>
              <motion.div variants={numberVariants} className="bg-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-8 backdrop-blur-sm border border-white/10">
                <p className="font-space text-xs sm:text-sm text-white/60 mb-2">Average</p>
                <p className="font-orbitron text-4xl sm:text-6xl md:text-7xl font-black text-white">
                  {recapData.averageScore}<span className="text-2xl sm:text-4xl">%</span>
                </p>
                <div className="text-2xl sm:text-3xl mt-2">📊</div>
              </motion.div>
            </div>
            {recapData.perfectScoreCount > 0 && (
              <motion.div variants={itemVariants} className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-xl sm:text-2xl">⭐</motion.span>
                <span className="font-poppins text-sm sm:text-lg font-bold">{recapData.perfectScoreCount} Perfect Scores!</span>
              </motion.div>
            )}
          </motion.div>
        )

      case 4: // Tournament
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.div variants={itemVariants}>
              <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-400 mb-4" />
            </motion.div>
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/70 mb-4">
              In the tournament arena...
            </motion.p>
            <motion.div variants={numberVariants}>
              <span className="font-orbitron text-7xl sm:text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400">
                {recapData.tournamentPoints}
              </span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-fleur text-4xl sm:text-5xl text-white mt-4">
              Tournament Points ⚔️
            </motion.h2>
            {recapData.tournamentRank && (
              <motion.p variants={itemVariants} className="font-space text-base sm:text-lg text-white/60 mt-4">
                Ranking <span className="text-yellow-400 font-bold">#{recapData.tournamentRank}</span> on the leaderboard
              </motion.p>
            )}
          </motion.div>
        )

      case 5: // Learning Style
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/70 mb-6">
              Your learning style?
            </motion.p>
            <motion.div variants={numberVariants} className="mb-6">
              {recapData.favoriteMode === 'speed' && (
                <div>
                  <motion.div animate={{ x: [-5, 5, -5], rotate: [-5, 5, -5] }} transition={{ duration: 0.5, repeat: Infinity }}>
                    <Zap className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-yellow-400 mb-4" />
                  </motion.div>
                  <h2 className="font-fleur text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                    Speed Demon
                  </h2>
                </div>
              )}
              {recapData.favoriteMode === 'traditional' && (
                <div>
                  <Target className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-pink-400 mb-4" />
                  <h2 className="font-fleur text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                    Precision Master
                  </h2>
                </div>
              )}
              {recapData.favoriteMode === 'balanced' && (
                <div>
                  <Award className="w-16 h-16 sm:w-24 sm:h-24 mx-auto text-purple-400 mb-4" />
                  <h2 className="font-fleur text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Balanced Pro
                  </h2>
                </div>
              )}
            </motion.div>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-8">
              <div className="flex items-center gap-2 text-white/60 bg-white/5 px-4 py-2 rounded-full">
                <Clock className="w-5 h-5" />
                <span className="font-space">Avg: {recapData.averageQuizDuration}</span>
              </div>
              {recapData.longestStreak > 1 && (
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }} className="flex items-center gap-2 text-orange-400 bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/30">
                  <Flame className="w-5 h-5" />
                  <span className="font-space font-bold">{recapData.longestStreak} day streak!</span>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )

      case 6: // Peak Performance
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/70 mb-8">
              You were most active on
            </motion.p>
            <motion.h2 variants={numberVariants} className="font-fleur text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-8">
              {recapData.mostActiveDay}s
            </motion.h2>
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/60 mb-4">
              And your power month was
            </motion.p>
            <motion.h2 variants={numberVariants} className="font-fleur text-5xl sm:text-7xl md:text-8xl text-white">
              {recapData.mostActiveMonth} 📅
            </motion.h2>
          </motion.div>
        )

      case 7: // Specialization
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/70 mb-6">
              Proudly representing
            </motion.p>
            <motion.h2 variants={itemVariants} className="font-fleur text-4xl sm:text-6xl md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-6">
              {recapData.specialization}
            </motion.h2>
            <motion.div variants={numberVariants} className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl">🎓</motion.span>
              <span className="font-orbitron text-2xl sm:text-3xl font-bold text-white">
                Level {recapData.level} Scholar
              </span>
            </motion.div>
          </motion.div>
        )

      case 8: // Community
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl px-4">
            <motion.div variants={itemVariants}>
              <Users className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-amber-300 mb-4" />
            </motion.div>
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/70 mb-4">
              You&apos;re one of
            </motion.p>
            <motion.div variants={numberVariants}>
              <span className="font-orbitron text-7xl sm:text-8xl md:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                3,000+
              </span>
            </motion.div>
            <motion.h2 variants={itemVariants} className="font-fleur text-4xl sm:text-6xl text-white mt-4">
              Chameleons! 🦎
            </motion.h2>
            <motion.p variants={itemVariants} className="font-space text-base sm:text-lg text-white/60 mt-6">
              Thank you for being part of our community ❤️
            </motion.p>
          </motion.div>
        )

      case 9: // Celebration
        return (
          <motion.div variants={contentVariants} initial="hidden" animate="visible" className="text-center max-w-4xl w-full px-4">
            {recapData.profileImage && (
              <motion.div variants={numberVariants} className="mb-6">
                <div className="w-20 h-20 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden p-1 bg-gradient-to-r from-purple-500 to-pink-500">
                  <Image src={recapData.profileImage} alt={recapData.username} width={112} height={112} unoptimized className="w-full h-full object-cover rounded-full" />
                </div>
              </motion.div>
            )}
            <motion.p variants={itemVariants} className="font-space text-lg sm:text-2xl text-white/70 mb-4">
              {recapData.username}, you are a
            </motion.p>
            <motion.h2 variants={numberVariants} className="font-fleur text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 mb-6">
              {recapData.personalizedTitle}
            </motion.h2>
            <motion.p variants={itemVariants} className="font-poppins text-base sm:text-xl text-white/70 max-w-md mx-auto mb-8">
              {recapData.personalizedMessage}
            </motion.p>
            
            {isComplete && (
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
              >
                <button onClick={handleShare} className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 rounded-full font-poppins text-white hover:bg-white/20 transition backdrop-blur-sm border border-white/10">
                  <Share2 className="w-5 h-5" />
                  <span className="font-semibold">Share</span>
                </button>
                <button onClick={handleExit} className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-poppins text-white hover:opacity-90 transition">
                  <span className="font-semibold">Done</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
            
            <motion.p variants={itemVariants} className="font-fleur text-3xl sm:text-4xl text-white/40 mt-8">
              See you in 2026! 🚀
            </motion.p>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: gradients[currentSlide] || gradients[0] }}>
      {/* Audio Controller */}
      <RecapAudio onReady={handleStart} />

      {/* Progress Bar */}
      {hasStarted && (
        <div className="fixed top-0 left-0 right-0 z-50 flex gap-1 p-2 sm:p-3 md:p-4">
          {[...Array(totalSlides)].map((_, i) => (
            <div key={i} className="flex-1 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400"
                initial={{ width: '0%' }}
                animate={{ width: i < currentSlide ? '100%' : i === currentSlide ? '100%' : '0%' }}
                transition={{ duration: i === currentSlide ? SLIDE_DURATION / 1000 : 0.3, ease: 'linear' }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Exit Button */}
      {isComplete && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={handleExit}
          className="fixed top-4 right-4 z-50 p-3 bg-white/10 rounded-full hover:bg-white/20 transition backdrop-blur-sm border border-white/10"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </motion.button>
      )}

      {/* Slides with smooth transitions (no white flash) */}
      {hasStarted && (
        <div className="fixed inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="w-full h-full flex items-center justify-center"
          >
            {renderSlideContent()}
          </motion.div>
        </div>
      )}

      {/* Floating particles background */}
      {hasStarted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 sm:w-2 sm:h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              }}
              animate={{
                y: [null, Math.random() * -300, Math.random() * 300],
                x: [null, Math.random() * 150, Math.random() * -150],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 10 + Math.random() * 15,
                repeat: Infinity,
                repeatType: 'reverse',
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
