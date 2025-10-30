'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCw, ArrowLeft, Zap, Bug, Heart, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const errorScenarios = [
  {
    title: "Oops! Our Hamster Fell Off The Wheel! 🐹",
    description: "Don't worry, he's okay. Just needs a coffee break ☕",
    gif: "https://media.giphy.com/media/3o7TKSjRrfIPjeiVyg/giphy.gif", // Cute hamster
    color: "from-orange-500 to-red-500"
  },
  {
    title: "404: Brain.exe Has Stopped Working 🤖",
    description: "Our AI is having an existential crisis. Give it a moment.",
    gif: "https://media.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif", // Robot error
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "Houston, We Have a Problem! 🚀",
    description: "The code decided to take an unexpected vacation to Mars.",
    gif: "https://media.giphy.com/media/3o6Mb9fY5TRhe1kCnC/giphy.gif", // Space/rocket
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "The Internet Gremlins Struck Again! 👾",
    description: "They're having a party in our servers. Uninvited, of course.",
    gif: "https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif", // Glitch effect
    color: "from-green-500 to-teal-500"
  },
  {
    title: "Ctrl+Z! Ctrl+Z! CTRL+Z!!! ⌨️",
    description: "That moment when you realize you broke production...",
    gif: "https://media.giphy.com/media/HUkOv6BNWc1HO/giphy.gif", // Panic
    color: "from-red-500 to-orange-500"
  },
  {
    title: "Error: Success Not Found 🎯",
    description: "We tried so hard, and got so far... but in the end, it didn't even compile.",
    gif: "https://media.giphy.com/media/3o7TKB3oifq46DDhOE/giphy.gif", // Confused
    color: "from-yellow-500 to-orange-500"
  }
]

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [scenario, setScenario] = useState(errorScenarios[0])
  const [isShaking, setIsShaking] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  useEffect(() => {
    console.error('🔥 Error boundary caught:', error)
    setScenario(errorScenarios[Math.floor(Math.random() * errorScenarios.length)])
  }, [error])

  const handleShuffleScenario = () => {
    setIsShaking(true)
    setClickCount(clickCount + 1)
    setTimeout(() => {
      setScenario(errorScenarios[Math.floor(Math.random() * errorScenarios.length)])
      setIsShaking(false)
    }, 300)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0a0a] to-[#030303] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-24 sm:-left-48 w-48 sm:w-96 h-48 sm:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-24 sm:-right-48 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <Card className={`relative z-10 max-w-4xl w-full mx-auto bg-black/60 backdrop-blur-xl border-white/20 shadow-2xl transition-all duration-300 ${isShaking ? 'animate-shake' : ''}`}>
        <CardHeader className="text-center space-y-4 sm:space-y-6 pb-4 sm:pb-6 px-3 sm:px-6 pt-6 sm:pt-8">
          {/* GIF Container - Responsive */}
          <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300 group">
            <Image
              src={scenario.gif}
              alt="Error Animation"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized
              priority
            />
            {/* Overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Animated Icon */}
          <div className="flex justify-center gap-2 sm:gap-3">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center animate-bounce hover:scale-110 transition-transform cursor-pointer">
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
            </div>
          </div>

          {/* Dynamic Title */}
          <CardTitle className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent leading-tight px-2 animate-fade-in`}>
            {scenario.title}
          </CardTitle>

          {/* Dynamic Description */}
          <CardDescription className="text-sm sm:text-base md:text-lg text-white/70 px-2 animate-fade-in">
            {scenario.description}
          </CardDescription>

          {/* Fun Emoji Row */}
          <div className="flex justify-center gap-2 sm:gap-4 text-2xl sm:text-3xl md:text-4xl">
            {['😱', '🤯', '😅', '🎪', '🎭'].map((emoji, i) => (
              <span
                key={i}
                className="animate-bounce cursor-pointer hover:scale-125 transition-transform"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {emoji}
              </span>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-6 sm:pb-8">
          {/* Technical Details - Collapsible */}
          <details className="bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 group cursor-pointer hover:bg-white/10 transition-all">
            <summary className="text-xs sm:text-sm font-semibold text-white/80 mb-2 flex items-center justify-between select-none">
              <span className="flex items-center gap-2">
                <Bug className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Nerdy Technical Details</span>
                <span className="sm:hidden">Technical Details</span>
                <span className="text-white/40 text-xs">(Click if you dare)</span>
              </span>
              <span className="text-white/40 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <div className="mt-3 space-y-2 animate-fade-in">
              <p className="text-xs sm:text-sm text-white/60 font-mono break-all bg-black/40 p-2 sm:p-3 rounded border border-white/5">
                {error.message || 'An unknown error occurred (spooky! 👻)'}
              </p>
              {error.digest && (
                <div className="text-xs text-white/40 bg-black/20 p-2 rounded">
                  <p className="font-semibold text-red-300 mb-1">Error ID:</p>
                  <p className="font-mono text-white/50">{error.digest}</p>
                  <p className="text-[10px] text-white/30 mt-2">
                    (Show this to a developer. They&apos;ll pretend to understand it 🤓)
                  </p>
                </div>
              )}
            </div>
          </details>

          {/* Fun Stats */}
          {clickCount > 0 && (
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-3 sm:p-4 text-center animate-fade-in">
              <p className="text-xs sm:text-sm text-white/70">
                🎉 <span className="font-bold text-purple-300">Achievement Progress:</span> {clickCount}/10 clicks
                {clickCount >= 10 && " 🏆 Master Error Clicker Unlocked!"}
              </p>
            </div>
          )}

          {/* Fun Fact */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-white/70 text-center leading-relaxed">
              💡 <span className="font-semibold text-cyan-300">Fun Fact:</span>{' '}
              <span className="text-white/60">
                90% of coding is Googling error messages. The other 10% is pretending you knew the answer all along 😎
              </span>
            </p>
          </div>

          {/* Action Buttons - Fully Responsive */}
          <div className="space-y-3">
            {/* Primary Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <Button
                onClick={reset}
                className={`group w-full bg-gradient-to-r ${scenario.color} hover:opacity-90 text-white border-0 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 py-5 sm:py-6 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl`}
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-180 transition-transform duration-500" />
                Magic Fix Button ✨
              </Button>

              <Button
                onClick={handleShuffleScenario}
                className="group w-full bg-white/5 hover:bg-white/10 border-2 border-white/20 hover:border-white/40 text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-95 py-5 sm:py-6 text-sm sm:text-base font-semibold"
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Change Scenario
              </Button>
            </div>

            {/* Secondary Actions Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 py-4 sm:py-5 text-xs sm:text-sm"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Go Back
              </Button>

              <Link href="/" className="w-full">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 py-4 sm:py-5 text-xs sm:text-sm"
                >
                  <Home className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Home
                </Button>
              </Link>

              <Button
                onClick={handleShuffleScenario}
                variant="outline"
                className="col-span-2 sm:col-span-1 border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-300 transition-all duration-300 hover:scale-[1.02] active:scale-95 py-4 sm:py-5 text-xs sm:text-sm"
              >
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Panic Mode!
              </Button>
            </div>
          </div>

          {/* Support Section */}
          <div className="text-center pt-3 sm:pt-4 border-t border-white/10 space-y-2">
            <p className="text-xs sm:text-sm text-white/50">
              Still broken? Send carrier pigeons 🐦 or{' '}
              <Link href="/about" className="text-blue-400 hover:text-blue-300 underline font-semibold transition-colors">
                contact our support wizards 🧙‍♂️
              </Link>
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-white/40">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-400 animate-pulse" />
              <span>and bugs</span>
              <Bug className="w-3 h-3 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-10px) rotate(-1deg); }
          50% { transform: translateX(10px) rotate(1deg); }
          75% { transform: translateX(-10px) rotate(-1deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
