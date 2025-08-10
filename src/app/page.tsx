'use client'
import dynamic from 'next/dynamic'
import { Suspense, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Shield, Brain, Database, Users, Award, Globe, Hospital } from "lucide-react"

// Lazy load heavy components
const HeroGeometric = dynamic(() => import('@/components/hero-geometric'), {
  loading: () => <div className="h-[80vh] min-h-[600px] bg-black" />,
  ssr: false
})

const CountUp = dynamic(() => import('@/components/CountUp'), {
  ssr: false
})

const CreativeFeatureSlider = dynamic(() => import('@/components/creative-feature-slider'), {
  ssr: false
})

const ScrollAnimatedSection = dynamic(() => import('@/components/scroll-animated-section'), {
  ssr: false
})

const Navigation = dynamic(() => import('@/components/navigation'), {
  ssr: false
})

const specializations = () => useMemo(() => [
  {
    id: "computing-data-sciences",
    icon: Cloud,
    title: "Computing and Data Sciences",
    description:
      "Comprehensive foundational courses covering essential academic subjects and critical thinking skills.",
    courses: 45,
    students: "2.3k",
    color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "cybersecurity",
    icon: Shield,
    title: "Cyber Security",
    description: "Advanced security protocols, ethical hacking, and digital forensics to protect digital assets.",
    courses: 32,
    students: "1.8k",
    color: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  {
    id: "artificial-intelligence",
    icon: Brain,
    title: "Artificial Intelligence",
    description: "Machine learning, neural networks, and AI development for the future of technology.",
    courses: 28,
    students: "2.1k",
    color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "media-analytics",
    icon: BookOpen,
    title: "Media Analytics",
    description: "Full-stack development, programming languages, and modern software engineering practices.",
    courses: 52,
    students: "3.2k",
    color: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  {
    id: "business-analytics",
    icon: Database,
    title: "Business Analytics",
    description: "Management, finance, marketing, and entrepreneurship for modern business growth.",
    courses: 24,
    students: "1.5k",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  {
    id: "healthcare-informatics",
    icon: Hospital,
    title: "Healthcare Informatics",
    description: "Global politics, diplomacy, and international affairs for comprehensive understanding.",
    courses: 18,
    students: "1.2k",
    color: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  },
]

const stats = [
  { icon: Users, label: "Active Students", value: "12000" },
  { icon: BookOpen, label: "Courses Available", value: "200" },
  { icon: Award, label: "Solved Quizzes", value: "40000" },
  { icon: Globe, label: "Countries", value: "45+" },
]

export default function HomePage() {
  const specializations = useSpecializations()
  const stats = useStats()

  return (
    <div className="min-h-screen bg-[#030303]">
      {/* Simplified Navigation */}
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>

      {/* Hero Section with lazy loading */}
      <Suspense fallback={<div className="h-[80vh] min-h-[600px] bg-black" />}>
        <HeroGeometric 
          badge="Chameleon FCDS" 
          title1="Master Your" 
          title2="Future Skills" 
          simplified // Pass a prop to use a simpler version on mobile
        />
      </Suspense>

      {/* Stats Section - Simplified */}
      <section className="py-12 bg-[#030303] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 mb-2">
                  <stat.icon className="w-5 h-5 text-white/60" />
                </div>
                <div className="text-xl font-bold text-white mb-1">
                  <CountUp
                    from={0}
                    to={stat.value}
                    separator=","
                    duration={1}
                    delay={0}
                    className="count-up-text"
                  />
                </div>
                <div className="text-xs text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy-loaded Feature Slider */}
      <Suspense fallback={null}>
        <CreativeFeatureSlider mobileOptimized />
      </Suspense>

      {/* Specializations Section - Simplified */}
      <section className="py-12 bg-[#030303]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 bg-white/5 border-white/10 text-white/60 text-xs">
              Specializations
            </Badge>
            <h2 className="text-2xl font-bold text-white mb-4">Choose Your <span className="text-indigo-400">Learning Path</span></h2>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              Explore our comprehensive specializations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {specializations.map((spec, index) => (
              <div key={index} className="bg-white/[0.02] border border-white/10 rounded-lg p-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border ${spec.color} mb-3`}>
                  <spec.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white text-lg mb-1">{spec.title}</h3>
                <p className="text-white/40 text-sm mb-3">{spec.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <span>{spec.courses} Courses</span>
                    <span>{spec.students} Students</span>
                  </div>
                </div>
                <a href={`/specialization/${spec.id}`}>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 text-sm"
                  >
                    Explore
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Simplified CTA */}
      <section className="py-12 bg-[#030303] border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-sm text-white/40 mb-6">
              Join thousands of students building their future with our courses.
            </p>
            <div className="flex flex-col gap-3">
              <a href="/specialization">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 w-full">
                  Start Learning
                </Button>
              </a>
              <a href="/specialization">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 w-full"
                >
                  View Courses
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-8 bg-[#030303] border-t border-white/5 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Chameleon FCDS</h3>
              <p className="text-white/40">Empowering learners worldwide.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-2">Resources</h3>
              <ul className="space-y-1 text-white/40">
                <li><a href="#" className="hover:underline">Courses</a></li>
                <li><a href="#" className="hover:underline">Support</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-6 pt-6 text-center text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} Chameleon FCDS</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
