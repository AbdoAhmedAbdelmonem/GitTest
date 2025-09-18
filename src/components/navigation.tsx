"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X, LogIn, UserPlus, BookOpen, BrainCircuit, Home, HelpCircle, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { getStudentSession, clearStudentSession } from "@/lib/auth"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "About", href: "/about", icon: HelpCircle },
  { name: "Explo", href: "/explo", icon: BrainCircuit },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

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
    
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    // Clear local session using the comprehensive function
    clearStudentSession()
    setUser(null)
    
    // Force reload to clear any cached state
    window.location.href = '/'
  }

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    // Only handle special navigation for section links
    if (item.isSection) {
      e.preventDefault()
      
      // If already on homepage, just scroll to section
      if (pathname === '/') {
        const sectionId = item.href.startsWith('#') ? item.href.substring(1) : item.href
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        // Navigate to homepage with hash
        router.push('/' + item.href)
      }
      
      // Close mobile menu if open
      if (isOpen) {
        setIsOpen(false)
      }
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl overflow-hidden ${
          scrolled 
            ? "bg-[rgba(255,255,255,0.1)] backdrop-blur-3xl border border-white/20 shadow-2xl" 
            : "bg-[rgba(255,255,255,0.07)] backdrop-blur-2xl border border-white/10"
        }`}
        style={{
          borderRadius: '100px',
          background: scrolled 
            ? 'radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.025) 100%)' 
            : 'radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 50%, rgba(255, 255, 255, 0.02) 100%)',
          boxShadow: scrolled 
            ? '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(120, 119, 198, 0.15)' 
            : '0 10px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 0 15px rgba(120, 119, 198, 0.1)'
        }}
      >
        {/* Animated gradient overlay for liquid glass effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <motion.div 
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            animate={{
              background: [
                'radial-gradient(ellipse at 50% 50%, rgba(162, 155, 254, 0.5) 0%, rgba(162, 155, 254, 0) 50%)',
                'radial-gradient(ellipse at 30% 20%, rgba(108, 92, 231, 0.5) 0%, rgba(108, 92, 231, 0) 50%)',
                'radial-gradient(ellipse at 70% 80%, rgba(224, 135, 249, 0.5) 0%, rgba(224, 135, 249, 0) 50%)',
                'radial-gradient(ellipse at 50% 50%, rgba(162, 155, 254, 0.5) 0%, rgba(162, 155, 254, 0) 50%)',
              ]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
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
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleNavigation(e, item)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-300 group mx-1 px-4 py-2 rounded-xl hover:bg-white/10 backdrop-blur-sm"
                  >
                    <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    <span className="relative">
                      {item.name}
                      <motion.div
                        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Auth Buttons or User Profile */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.6 }}
                  className="flex items-center gap-2"
                >
                  <Link href="/profile" className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors px-4 py-2 rounded-xl hover:bg-white/10 backdrop-blur-sm">
                    <User className="w-4 h-4" />
                    <span>{user.username}</span>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl backdrop-blur-sm"
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
                        className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-xl backdrop-blur-sm"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Login
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                    <Link href="/auth?mode=signup">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 rounded-xl backdrop-blur-sm">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Sign Up
                      </Button>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-xl transition-colors duration-300 backdrop-blur-sm"
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
              className="md:hidden bg-[rgba(255,255,255,0.1)] backdrop-blur-3xl border-t border-white/20 rounded-b-2xl"
              style={{
                background: 'radial-gradient(100% 100% at 50% 0%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.025) 100%)',
                boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 20px rgba(120, 119, 198, 0.15)'
              }}
            >
              {/* Animated gradient overlay for mobile menu */}
              <div className="absolute inset-0 overflow-hidden rounded-b-2xl">
                <motion.div 
                  className="absolute inset-0 opacity-20 mix-blend-overlay"
                  animate={{
                    background: [
                      'radial-gradient(ellipse at 50% 0%, rgba(162, 155, 254, 0.5) 0%, rgba(162, 155, 254, 0) 70%)',
                      'radial-gradient(ellipse at 30% 0%, rgba(108, 92, 231, 0.5) 0%, rgba(108, 92, 231, 0) 70%)',
                      'radial-gradient(ellipse at 70% 0%, rgba(224, 135, 249, 0.5) 0%, rgba(224, 135, 249, 0) 70%)',
                      'radial-gradient(ellipse at 50% 0%, rgba(162, 155, 254, 0.5) 0%, rgba(162, 155, 254, 0) 70%)',
                    ]
                  }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <div className="container mx-auto px-4 py-6 relative z-10">
                <div className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={(e) => handleNavigation(e, item)}
                        className="flex items-center gap-3 text-white/80 hover:text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                  
                  <div className="border-t border-white/20 pt-4 mt-2">
                    {user ? (
                      <div className="flex flex-col gap-2">
                        <Link 
                          href="/profile" 
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 text-white p-3 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                        >
                          <User className="w-5 h-5" />
                          <span>{user.username}</span>
                        </Link>
                        <Button
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                          variant="ghost"
                          className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link href="/auth" onClick={() => setIsOpen(false)}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10 rounded-xl backdrop-blur-sm"
                          >
                            <LogIn className="w-4 h-4 mr-2" />
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth?mode=signup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full justify-start bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl backdrop-blur-sm">
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
      <div className="h-20 md:h-24"/>
    </>
  )
}