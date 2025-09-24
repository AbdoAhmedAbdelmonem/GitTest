// components/navigation.tsx (updated)
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X, LogIn, UserPlus, BookOpen, BrainCircuit, SquareUserRound, User as UserIcon, LogOut, Home, Folder, HelpCircle, ChevronDown, Lock } from "lucide-react"
import Link from "next/link"
import { getStudentSession, clearStudentSession } from "@/lib/auth"
import { NotificationBell } from "./notification-bell"
import { User } from "@/lib/types"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Tournament", href: "/Tournment", icon: BookOpen },
  { name: "Specializations", href: "#", icon: SquareUserRound },
  { name: "About", href: "/about", icon: HelpCircle  },
  { name: "Explo", href: "/explo", icon: BrainCircuit, target: "_blank" }
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isSpecializationsOpen, setIsSpecializationsOpen] = useState(false)
  const [isTournamentLocked, setIsTournamentLocked] = useState(false)
  const [daysRemaining, setDaysRemaining] = useState(0)

  const specializations = [
    {
      name: "Computing and Data Sciences",
      href: "/specialization/computing-data-sciences",
      description: "Advanced computing and data science methodologies"
    },
    {
      name: "Cybersecurity",
      href: "/specialization/cybersecurity",
      description: "Protecting information systems and networks"
    },
    {
      name: "Intelligent Systems",
      href: "/specialization/artificial-intelligence",
      description: "Advanced AI systems and intelligent automation"
    },
    {
      name: "Media Analytics",
      href: "/specialization/media-analytics",
      description: "Analyzing and interpreting media content"
    },
    {
      name: "Business Analytics",
      href: "/specialization/business-analytics",
      description: "Data-driven business intelligence and analytics"
    },
    {
      name: "Healthcare Informatics",
      href: "/specialization/healthcare-informatics",
      description: "Leveraging data and technology to improve patient care"
    },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    
    // Check if user is logged in
    const session = getStudentSession()
    if (session) {
      setUser(session)
    }

    // Check tournament lock status
    const targetDate = new Date('2025-10-07')
    const currentDate = new Date()
    if (currentDate < targetDate) {
      setIsTournamentLocked(true)
      const diffTime = targetDate.getTime() - currentDate.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setDaysRemaining(diffDays)
    } else {
      setIsTournamentLocked(false)
      setDaysRemaining(0)
    }
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle clicks outside the specializations menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isSpecializationsOpen && !target.closest('.specializations-menu') && !target.closest('.specializations-trigger')) {
        setIsSpecializationsOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isSpecializationsOpen) {
        setIsSpecializationsOpen(false)
      }
    }

    if (isSpecializationsOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isSpecializationsOpen])

  const handleLogout = () => {
    clearStudentSession()
    setUser(null)
    window.location.reload() // Refresh the page to update the UI
  }

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    if (item.name === "Specializations") {
      e.preventDefault()
      setIsSpecializationsOpen(!isSpecializationsOpen)
      return
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#030303]/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
        }`}
        dir="ltr"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src="/images/1212-removebg-preview.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                />
              </div>
              <span className="text-xl font-bold text-white">Chameleon</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {item.name === "Tournament" && isTournamentLocked ? (
                    <div className="flex items-center gap-2 text-white/50 cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      <span>Tournament (+{daysRemaining} days)</span>
                    </div>
                  ) : item.name === "Specializations" ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsSpecializationsOpen(!isSpecializationsOpen)}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group specializations-trigger"
                      >
                        <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative">
                          {item.name}
                          <motion.div
                            className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            initial={{ width: 0 }}
                            whileHover={{ width: "100%" }}
                            transition={{ duration: 0.3 }}
                          />
                        </span>
                        <motion.div
                          animate={{ rotate: isSpecializationsOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </button>

                      {/* Specializations Dropdown Menu */}
                      <AnimatePresence>
                        {isSpecializationsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 w-80 bg-[#030303]/95 backdrop-blur-xl border border-white/10 rounded-lg shadow-xl specializations-menu z-50"
                          >
                            <div className="p-4">
                              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">Available Specializations</h3>
                              <div className="space-y-2">
                                {specializations.map((spec, specIndex) => (
                                  <motion.div
                                    key={spec.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: specIndex * 0.1 }}
                                  >
                                    <Link
                                      href={spec.href}
                                      onClick={() => setIsSpecializationsOpen(false)}
                                      className="block p-3 rounded-lg hover:bg-white/5 transition-colors duration-200 group"
                                    >
                                      <div className="text-white font-medium group-hover:text-purple-300 transition-colors">
                                        {spec.name}
                                      </div>
                                      <div className="text-white/60 text-sm mt-1">
                                        {spec.description}
                                      </div>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : item.name === "Explo" ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
                    >
                      <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative">
                        {item.name}
                        <motion.div
                          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={(e) => handleNavigation(e, item)}
                      className="flex items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 group"
                    >
                      <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative">
                        {item.name}
                        <motion.div
                          className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </span>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Auth Buttons or User Profile */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-4"
                >
                  <NotificationBell />
                  <Link href="/profile" className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors">
                    <UserIcon className="w-4 h-4" />
                    <span>{user.username}</span>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </motion.div>
              ) : (
                <>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                    <Link href="/auth">
                      <Button
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                    <Link href="/auth?mode=signup">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {user && <NotificationBell />}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => setIsOpen(!isOpen)}
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="md:hidden bg-[#030303]/95 backdrop-blur-xl border-t border-white/10"
            >
              <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.name === "Tournament" && isTournamentLocked ? (
                        <div className="flex items-center gap-3 text-white/50 cursor-not-allowed p-3 rounded-lg">
                          <Lock className="w-5 h-5" />
                          <span>Tournament (+{daysRemaining} days)</span>
                        </div>
                      ) : item.name === "Specializations" ? (
                        <div>
                          <button
                            onClick={() => setIsSpecializationsOpen(!isSpecializationsOpen)}
                            className="flex items-center gap-3 text-white/70 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-300 w-full justify-between specializations-trigger"
                          >
                            <div className="flex items-center gap-3">
                              <item.icon className="w-5 h-5" />
                              <span>{item.name}</span>
                            </div>
                            <motion.div
                              animate={{ rotate: isSpecializationsOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="w-4 h-4" />
                            </motion.div>
                          </button>

                          {/* Mobile Specializations Menu */}
                          <AnimatePresence>
                            {isSpecializationsOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="ml-8 mt-2 space-y-2"
                              >
                                {specializations.map((spec, specIndex) => (
                                  <motion.div
                                    key={spec.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: specIndex * 0.1 }}
                                  >
                                    <Link
                                      href={spec.href}
                                      onClick={() => {
                                        setIsSpecializationsOpen(false)
                                        setIsOpen(false)
                                      }}
                                      className="block p-3 rounded-lg hover:bg-white/5 transition-colors duration-200"
                                    >
                                      <div className="text-white font-medium hover:text-purple-300 transition-colors">
                                        {spec.name}
                                      </div>
                                      <div className="text-white/60 text-sm mt-1">
                                        {spec.description}
                                      </div>
                                    </Link>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : item.name === "Explo" ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-white/70 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={(e) => handleNavigation(e, item)}
                          className="flex items-center gap-3 text-white/70 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                  
                  <div className="border-t border-white/10 pt-4 mt-2">
                    {user ? (
                      <div className="flex flex-col gap-3">
                        <Link 
                          href="/profile" 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                        >
                          <UserIcon className="w-5 h-5" />
                          <span>{user.username}</span>
                        </Link>
                        <Button
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                          variant="ghost"
                          className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <Link href="/auth" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                          >
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16 md:h-20" />
    </>
  )
}
