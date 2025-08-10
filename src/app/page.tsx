'use client'
import dynamic from 'next/dynamic'
import { Suspense, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Shield, Brain, Database, Users, Award, Globe, Hospital } from "lucide-react"

// Lazy load heavy components with SSR disabled for better mobile performance
const HeroGeometric = dynamic(() => import('@/components/hero-geometric'), {
  loading: () => <div className="h-[80vh] min-h-[500px] bg-black" />,
  ssr: false
})

const CountUp = dynamic(() => import('@/components/CountUp'), {
  ssr: false,
  loading: () => <span className="inline-block w-12 h-6 bg-white/10 animate-pulse rounded" />
})

const CreativeFeatureSlider = dynamic(() => import('@/components/creative-feature-slider'), {
  ssr: false,
  loading: () => <div className="h-64 bg-black/20" />
})

const ScrollAnimatedSection = dynamic(() => import('@/components/scroll-animated-section'), {
  ssr: false
})

const Navigation = dynamic(() => import('@/components/navigation'), {
  ssr: false,
  loading: () => <nav className="h-16 bg-black" />
})

// Memoize static data to prevent unnecessary re-renders
const useSpecializations = () => useMemo(() => [
  {
    id: "computing-data-sciences",
    icon: Shield,
    title: "Computing and Data Sciences",
    description: "Essential courses covering academic subjects and critical thinking.",
    courses: 45,
    students: "2.3k",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "cybersecurity",
    icon: Shield,
    title: "Cyber Security",
    description: "Security protocols, ethical hacking, and digital forensics.",
    courses: 32,
    students: "1.8k",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    id: "artificial-intelligence",
    icon: Brain,
    title: "Artificial Intelligence",
    description: "Machine learning, neural networks, and AI development.",
    courses: 28,
    students: "2.1k",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "media-analytics",
    icon: BookOpen,
    title: "Media Analytics",
    description: "Programming languages and software engineering practices.",
    courses: 52,
    students: "3.2k",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    id: "business-analytics",
    icon: Database,
    title: "Business Analytics",
    description: "Management, finance, and entrepreneurship for business growth.",
    courses: 24,
    students: "1.5k",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    id: "healthcare-informatics",
    icon: Hospital,
    title: "Healthcare Informatics",
    description: "Global politics, diplomacy, and international affairs.",
    courses: 18,
    students: "1.2k",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
], [])

const useStats = () => useMemo(() => [
  { icon: Users, label: "Active Students", value: "12000" },
  { icon: BookOpen, label: "Courses", value: "200" },
  { icon: Award, label: "Solved Quizzes", value: "40000" },
  { icon: Globe, label: "Countries", value: "45+" },
], [])

export default function HomePage() {
  const specializations = useSpecializations()
  const stats = useStats()

  return (
    <div className="min-h-screen bg-[#030303]">
      {/* Simplified Navigation with loading state */}
      <Suspense fallback={<nav className="h-16 bg-black" />}>
        <Navigation />
      </Suspense>

      {/* Hero Section with mobile-optimized fallback */}
      <Suspense fallback={<div className="h-[80vh] min-h-[500px] bg-black flex items-center justify-center">
        <h1 className="text-2xl text-white font-bold">Chameleon FCDS</h1>
      </div>}>
        <HeroGeometric 
          badge="Chameleon FCDS" 
          title1="Master Your" 
          title2="Future Skills"
          mobileOptimized
        />
      </Suspense>

      {/* Stats Section - Simplified grid and animations */}
      <section className="py-10 bg-[#030303] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-3 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 mb-2 mx-auto">
                  <stat.icon className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  <Suspense fallback={<span className="inline-block w-12 h-6 bg-white/10 animate-pulse rounded" />}>
                    <CountUp
                      from={0}
                      to={stat.value}
                      separator=","
                      duration={1}
                      delay={0.2}
                    />
                  </Suspense>
                </div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy-loaded Feature Slider with skeleton */}
      <Suspense fallback={<div className="h-64 bg-black/20 flex items-center justify-center">
        <span className="text-white/40">Loading featured content...</span>
      </div>}>
        <CreativeFeatureSlider 
          mobileOptimized 
          autoplayInterval={5000} // Reduced from default for mobile
        />
      </Suspense>

      {/* Specializations Section - Simplified cards */}
      <section className="py-12 bg-[#030303]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 bg-white/5 border-white/10 text-white/60 text-xs">
              Specializations
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-3">Choose Your <span className="text-indigo-400">Learning Path</span></h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Explore our comprehensive specializations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {specializations.map((spec, index) => (
              <div 
                key={index}
                className="bg-white/[0.02] border border-white/10 rounded-lg p-4 transition-all hover:bg-white/[0.04]"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${spec.color} mb-3`}>
                  <spec.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-1">{spec.title}</h3>
                <p className="text-white/40 text-sm mb-3">{spec.description}</p>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="text-white/60">{spec.courses} Courses</span>
                  <span className="text-white/60">{spec.students} Students</span>
                </div>
                <a 
                  href={`/specialization/${spec.id}`}
                  className="block w-full"
                  aria-label={`Explore ${spec.title} courses`}
                >
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 text-sm py-2"
                  >
                    Explore Courses
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified CTA with reduced text */}
      <section className="py-12 bg-[#030303] border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-3">Start Learning Today</h2>
            <p className="text-sm text-white/40 mb-6">
              Join thousands of students building their future
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="/specialization"
                className="flex-1"
                aria-label="Start learning"
              >
                <Button 
                  size="sm" 
                  className="w-full bg-white text-black hover:bg-white/90"
                >
                  Get Started
                </Button>
              </a>
              <a 
                href="/specialization"
                className="flex-1"
                aria-label="View all courses"
              >
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-white/20 text-white hover:bg-white/10"
                >
                  View Courses
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer with essential links only */}
      <footer className="py-8 bg-[#030303] border-t border-white/5 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Chameleon FCDS</h3>
              <p className="text-white/40 text-xs">Empowering learners with future skills</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Quick Links</h3>
              <ul className="space-y-1 text-white/40 text-xs">
                <li><a href="/courses" className="hover:underline">Courses</a></li>
                <li><a href="/about" className="hover:underline">About</a></li>
                <li><a href="/contact" className="hover:underline">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 text-center text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} Chameleon FCDS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Simple CSS animations in the head (would be better in CSS file) */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
