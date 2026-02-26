'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'

interface CardData {
  id: number
  title: string
  description: string
  link: string
  gradient: string
  image: string
}

const cards: CardData[] = [
  {
    id: 1,
    title: 'Chameleon Guide',
    description: 'Comprehensive Manual for New Students',
    link: 'https://drive.google.com/file/d/1iKEMw2rx6nxVTfNiIX4pKFiEkKV-V52-/view?usp=drive_link',
    gradient: 'from-purple-600 via-pink-500 to-rose-400',
    image: '/images/thumbnail.png'
  },
  {
    id: 2,
    title: 'Internal Regulations',
    description: 'Faculty Guidelines and Policies',
    link: 'https://drive.google.com/file/d/1x7pupdeFrJZd-Sz5tiKoudSRRsBP96e3/view?usp=drive_link',
    gradient: 'from-blue-600 via-blue-500 to-cyan-400',
    image: '/images/Layha.png'
  },
  {
    id: 3,
    title: 'FCDS 2025/2026 Schedule',
    description: 'Academic Calendar for Lectures and Sections',
    link: 'https://drive.google.com/file/d/11hdn4wst2ckEQmXU-8fZrBjTTHErdlC8/view?usp=drive_link',
    gradient: 'from-orange-500 via-red-500 to-pink-500',
    image: '/images/Sched.png'
  },
  {
    id: 4,
    title: 'Morx - Team Management System',
    description: 'Monitor your Teams and learning analytics',
    link: 'https://morx-team.vercel.app',
    gradient: 'from-emerald-500 via-green-500 to-teal-400',
    image: 'https://morx-team.vercel.app/Blue%20and%20White%20Illustration%20Build%20a%20Business%20Team%20Presentation.png'
  }
]

export default function GsapStackedCards() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)
  const animationRef = useRef<number | null>(null)

  // Duplicate cards for infinite scrolling
  const duplicatedCards = [...cards, ...cards, ...cards]

  // Auto-scroll effect
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    const scroll = () => {
      if (!isPaused && scrollContainer) {
        const currentScroll = scrollContainer.scrollLeft
        const maxScroll = scrollContainer.scrollWidth / 3
        
        // Reset position when reaching the end of first duplicate set
        if (currentScroll >= maxScroll) {
          scrollContainer.scrollLeft = 0
        } else {
          scrollContainer.scrollLeft = currentScroll + 1
        }
      }
      animationRef.current = requestAnimationFrame(scroll)
    }

    animationRef.current = requestAnimationFrame(scroll)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPaused])

  const handleScroll = (direction: 'left' | 'right') => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return
    
    const scrollAmount = 420 // card width + gap
    const newPosition = direction === 'left' 
      ? scrollContainer.scrollLeft - scrollAmount
      : scrollContainer.scrollLeft + scrollAmount
    
    scrollContainer.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
  }

  return (
    <div ref={sectionRef} className="relative py-24 bg-[#030303] overflow-hidden border-t border-white/5">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(99,102,241,0.05)_0%,_transparent_70%)]" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white/80 font-medium">Your Learning Hub</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6" >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Explore our comprehensive features and tools designed for your success
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={() => handleScroll('left')}
            className="group p-3 rounded-full bg-white/5 border-2 border-blue-500/30 hover:border-blue-500/60 hover:bg-white/10 transition-all duration-300"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
          </button>
          
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="group p-3 rounded-full bg-white/5 border-2 border-purple-500/30 hover:border-purple-500/60 hover:bg-white/10 transition-all duration-300"
            aria-label={isPaused ? "Resume scrolling" : "Pause scrolling"}
          >
            {isPaused ? (
              <Play className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            ) : (
              <Pause className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
            )}
          </button>

          <button
            onClick={() => handleScroll('right')}
            className="group p-3 rounded-full bg-white/5 border-2 border-pink-500/30 hover:border-pink-500/60 hover:bg-white/10 transition-all duration-300"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-pink-400 group-hover:text-pink-300 transition-colors" />
          </button>
        </div>

        {/* Cards Slider */}
        <div 
          ref={scrollRef}
          className="w-full overflow-x-auto scrollbar-hide pb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-6 px-4">
            {duplicatedCards.map((card, index) => (
              <Link key={`${card.id}-${index}`} href={card.link} className="flex-shrink-0">
                <div 
                  className="group relative w-[400px] h-[225px] rounded-2xl overflow-hidden bg-[#0a0a0a] transition-all duration-500 cursor-pointer shadow-2xl hover:shadow-blue-500/20 hover:scale-105"
                  style={{
                    border: '2px solid transparent',
                    backgroundImage: `linear-gradient(#0a0a0a, #0a0a0a), linear-gradient(135deg, ${card.gradient.split(' ').join(', ')})`,
                    backgroundOrigin: 'border-box',
                    backgroundClip: 'padding-box, border-box'
                  }}
                >
                  {/* Image Background */}
                  <div className="absolute inset-0">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                  </div>
                  
                  {/* Animated Border Gradient */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-20 blur-xl`} />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-between p-6 z-10">
                    {/* Top - Arrow Icon */}
                    <div className="flex justify-end">
                      <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                    </div>

                    {/* Bottom - Text Content */}
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300">
                        {card.title}
                      </h3>
                      <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300 leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden">
                    <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className="text-center text-sm text-white/40 mt-8">
          {isPaused ? 'Paused - Hover over cards to pause' : 'Auto-scrolling - Use controls or hover to pause'}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}


