"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Menu, X, LogIn, UserPlus, BookOpen, Brain, Home, Folder,CircleQuestionMark } from "lucide-react"
import Link from "next/link"

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Courses", href: "/courses", icon: BookOpen },
  { name: "YouTube", href: "/youtube", icon: Folder },
  { name: "Specializations", href: "/specializations", icon: Brain },
  { name: "About", href: "/about", icon: CircleQuestionMark },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#030303]/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center gap-3">
              <div className="relative">
                  <Image
                  src="../../Images/1212-removebg-preview.png"
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
                  <Link
                    href={item.href}
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
                </motion.div>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-4">
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
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
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
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 text-white/70 hover:text-white p-3 rounded-lg hover:bg-white/5 transition-all duration-300"
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  ))}
                  <div className="border-t border-white/10 pt-4 mt-2">
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
