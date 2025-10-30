'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Compass, MapPin, Ghost, Rocket, Coffee, PartyPopper } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const notFoundScenarios = [
  {
    title: "404: This Page is Playing Hide & Seek! 🙈",
    description: "And it's winning... It's REALLY good at hiding!",
    gif: "https://media.giphy.com/media/3o7TKB3oifq46DDhOE/giphy.gif", // Confused/Lost
    color: "from-blue-500 to-purple-500"
  },
  {
    title: "Oops! Page Went on Vacation 🏖️",
    description: "It left no forwarding address. Probably in the Bahamas.",
    gif: "https://media.giphy.com/media/3o6Mb5yDNg6W0MA7gA/giphy.gif", // Beach/Vacation
    color: "from-orange-500 to-pink-500"
  },
  {
    title: "404: Lost in the Digital Wilderness 🗺️",
    description: "This page is more lost than me looking for my keys on Monday morning.",
    gif: "https://media.giphy.com/media/xUPGcz2H1TXdCz4suY/giphy.gif", // Lost/Confused
    color: "from-green-500 to-teal-500"
  },
  {
    title: "This Page is in Another Castle 🏰",
    description: "Sorry Mario, but your princess... I mean page, is somewhere else!",
    gif: "https://media.giphy.com/media/Lopx9eUi34rbq/giphy.gif", // Mario/Gaming
    color: "from-red-500 to-orange-500"
  },
  {
    title: "Error 404: Page Ghosted You 👻",
    description: "Left on read. Left on URL. Same energy.",
    gif: "https://media.giphy.com/media/3o7TKnO6Wve6502iJ2/giphy.gif", // Ghost
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Beam Me Up Scotty! Wrong Coordinates 🛸",
    description: "Houston, we've landed on the wrong page of the internet.",
    gif: "https://media.giphy.com/media/3oEjHWXddcCOGZNmFO/giphy.gif", // Space/UFO
    color: "from-cyan-500 to-blue-500"
  }
]

export default function NotFound() {
  const [scenario, setScenario] = useState(notFoundScenarios[0])
  const [clicks, setClicks] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    setScenario(notFoundScenarios[Math.floor(Math.random() * notFoundScenarios.length)])
  }, [])

  const handle404Click = () => {
    setClicks(clicks + 1)
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 1000)
    
    if (clicks + 1 === 5) {
      setScenario({
        title: "🎉 Secret Achievement Unlocked! 🎊",
        description: "You found the hidden easter egg! (Still didn't find the page though) 🏆",
        gif: "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
        color: "from-yellow-500 to-orange-500"
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#030303] via-[#0a0a0a] to-[#030303] flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-24 sm:-left-48 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 -right-24 sm:-right-48 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      <Card className="relative z-10 max-w-4xl w-full mx-auto bg-black/60 backdrop-blur-xl border-white/20 shadow-2xl hover:border-white/30 transition-all duration-300">
        <CardHeader className="text-center space-y-4 sm:space-y-6 pb-4 sm:pb-6 px-3 sm:px-6 pt-6 sm:pt-8">
          {/* GIF Container - Responsive */}
          <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden border-4 border-white/10 shadow-2xl hover:border-white/30 transition-all duration-300 group">
            <Image
              src={scenario.gif}
              alt="404 Animation"
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized
              priority
            />
            {/* Overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Clickable 404 Number */}
          <div className="relative group">
            <h1 
              onClick={handle404Click}
              className={`text-7xl sm:text-8xl md:text-9xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent cursor-pointer select-none transition-all duration-1000 hover:scale-110 ${isSpinning ? 'animate-spin-slow' : 'animate-pulse'}`}
            >
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            </div>
          </div>

          {/* Fun Emoji Row */}
          <div className="flex justify-center gap-2 sm:gap-4 text-xl sm:text-2xl md:text-3xl">
            
          </div>

          {/* Dynamic Title */}
          <CardTitle className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent leading-tight px-2 animate-fade-in`}>
            {scenario.title}
          </CardTitle>

          {/* Dynamic Description */}
          <CardDescription className="text-sm sm:text-base md:text-lg text-white/70 px-2 animate-fade-in">
            {scenario.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 pb-6 sm:pb-8">
          {/* Funny Troubleshooting Tips */}
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3 sm:p-4 space-y-2">
            <h3 className="text-xs sm:text-sm font-semibold text-white/80 flex items-center gap-2">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Troubleshooting Tips (Professional Edition):</span>
              <span className="sm:hidden">Troubleshooting Tips:</span>
            </h3>
            <ul className="text-xs sm:text-sm text-white/60 space-y-1 ml-4 sm:ml-6 list-disc">
              <li>Check if caps lock is on 🔤</li>
              <li>Try turning it off and on again 🔌</li>
              <li>Maybe the page is just camera shy? 📸</li>
              <li>Have you tried asking nicely? Please? 🙏</li>
              <li className="text-white/40 italic">Actually, just click home below 😂</li>
            </ul>
          </div>

          {/* Click Counter Achievement */}
          {clicks > 0 && (
            <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-3 sm:p-4 text-center animate-fade-in">
              <p className="text-xs sm:text-sm text-white/70">
                🎮 <span className="font-bold text-yellow-300">404 Clicks:</span> {clicks}/5
                {clicks >= 5 && " 🎉 Achievement Unlocked: Page Not Finder Master!"}
              </p>
            </div>
          )}

          {/* Action Buttons - Fully Responsive */}
          <div className="space-y-3">
            {/* Primary Action - Go Back */}
            <Button
              onClick={() => window.location.href = '/'}
              className={`w-full group bg-gradient-to-r ${scenario.color} hover:opacity-90 text-white border-0 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 py-6 sm:py-7 text-base sm:text-lg font-bold shadow-lg hover:shadow-xl`}
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>
          </div>

          {/* Popular Pages - Responsive Grid */}
          <div className="pt-3 sm:pt-4 border-t border-white/10">
            <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              Pages That Actually Exist:
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/explo" className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs sm:text-sm py-4 sm:py-5 hover:scale-[1.02]"
                >
                  <Coffee className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Explo</span>
                </Button>
              </Link>
              <Link href="/Tournment" className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs sm:text-sm py-4 sm:py-5 hover:scale-[1.02]"
                >
                  <PartyPopper className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Tournament</span>
                </Button>
              </Link>
              <Link href="/profile" className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs sm:text-sm py-4 sm:py-5 hover:scale-[1.02]"
                >
                  <Ghost className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">Profile</span>
                </Button>
              </Link>
              <Link href="/about" className="w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-white/60 hover:text-white hover:bg-white/5 transition-all text-xs sm:text-sm py-4 sm:py-5 hover:scale-[1.02]"
                >
                  <Rocket className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                  <span className="truncate">About</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Fun Footer */}
          <div className="text-center pt-3 sm:pt-4 border-t border-white/10 space-y-2">
            <p className="text-xs sm:text-sm text-white/50">
              💡 <span className="font-semibold">Pro Tip:</span> The URL bar is not a search engine. We learned that the hard way.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Animations */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-spin-slow {
          animation: spin-slow 1s ease-in-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
