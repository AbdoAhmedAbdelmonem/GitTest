"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import bcrypt from "bcryptjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Shield,
  BookOpen,
  Hash,
  ChevronDown,
  GraduationCap,
  Star,
  ArrowLeft,
  UserCircle,
  Phone,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ToastProvider"

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} backdrop-blur-[2px] border-2 border-white/[0.15] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  )
}

// Custom dropdown component with creative styling
function CreativeDropdown({
  id,
  label,
  value,
  onChange,
  options,
  icon: Icon,
  className = "",
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  icon: React.ComponentType<any>
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={`space-y-2 relative ${className}`} ref={dropdownRef}>
      <Label htmlFor={id} className="text-white/80">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40 z-10" />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-10 w-full items-center justify-between rounded-md border border-white/20 bg-white/5 pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/40 hover:border-purple-500/50 focus:border-purple-500/50 focus:ring-purple-500/20 focus:outline-none transition-all duration-300 relative overflow-hidden group"
        >
          <span className="truncate">{selectedOption?.label || `Select ${label.toLowerCase()}`}</span>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="w-4 h-4 text-white/60" />
          </motion.div>

          {/* Animated background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/5 group-hover:to-purple-500/10 transition-all duration-500" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute z-50 mt-1 w-full rounded-md border border-white/10 bg-[#0f0f1a] shadow-lg overflow-hidden"
            >
              <div className="py-1 max-h-60 overflow-auto">
                {options.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`block w-full px-4 py-2 text-left text-sm transition-all duration-200 ${
                      value === option.value
                        ? "bg-purple-500/20 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                    whileHover={{ x: 5 }}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Auth functions to manage user session
const saveStudentSession = (userData: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("student_session", JSON.stringify(userData))
  }
}

const getStudentSession = () => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("student_session")
    return session ? JSON.parse(session) : null
  }
  return null
}

// Password hashing and verification functions
async function hashPassword(plainPassword: string) {
  const saltRounds = 12 // cost factor
  const hash = await bcrypt.hash(plainPassword, saltRounds)
  return hash
}

async function verifyPassword(plainPassword: string, hashedPassword: string) {
  const match = await bcrypt.compare(plainPassword, hashedPassword)
  return match
}

// Clear student session function for backward compatibility
const clearStudentSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("student_session")
    localStorage.removeItem("remembered_login")
  }
}

// Enhanced logout function that clears both app and Google sessions
const handleCompleteLogout = async () => {
  if (typeof window !== "undefined") {
    // Clear local storage
    localStorage.clear()
    
    // Clear Supabase session
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    
    // Optional: Open Google logout URL in new tab to logout from Google
    // This allows users to logout from Google completely if they want
    const googleLogoutUrl = 'https://accounts.google.com/logout'
    window.open(googleLogoutUrl, '_blank')
  }
}

type AuthStep = "google" | "name-phone" | "specialization" | "password" | "complete"
type GoogleUserData = {
  email: string
  name: string
  picture: string
  sub: string
}

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [level, setLevel] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [previousPath, setPreviousPath] = useState("/")
  const { addToast } = useToast()

  const [authStep, setAuthStep] = useState<AuthStep>("google")
  const [googleUserData, setGoogleUserData] = useState<GoogleUserData | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | "facebook" | null>(null)

  // Form state
  const [loginData, setLoginData] = useState({
    studentId: "",
    password: "",
  })
  const [signupData, setSignupData] = useState({
    username: "",
    phoneNumber: "",
    age: "",
    password: "",
    confirmPassword: "",
  })

  // Set initial mode based on URL params
  useEffect(() => {
    const modeParam = searchParams.get("mode")
    const stepParam = searchParams.get("step")
    
    if (modeParam === "signup") {
      setMode("signup")
      if (stepParam === "name-phone") {
        setAuthStep("name-phone")
      }
    } else {
      setMode("login")
    }
  }, [searchParams])

  // Load remembered credentials on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const remembered = localStorage.getItem("remembered_login")
      if (remembered) {
        try {
          const { studentId, password } = JSON.parse(remembered)
          setLoginData({ studentId: studentId || "", password: password || "" })
          setRememberMe(true)
        } catch {}
      }
    }
  }, [])

  // Add this useEffect to capture the previous path
  useEffect(() => {
    // Get the referrer or use a URL parameter if available
    const referrer = document.referrer
    const returnToParam = searchParams.get("returnTo")

    // Use the returnTo parameter if available, otherwise use document.referrer if it's from the same origin
    // Fall back to "/" if neither is available
    if (returnToParam) {
      setPreviousPath(returnToParam)
    } else if (referrer && referrer.startsWith(window.location.origin)) {
      // Extract just the path part (remove the origin)
      const path = new URL(referrer).pathname
      // Don't redirect back to auth page
      setPreviousPath(path === "/auth" ? "/" : path)
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createBrowserClient()

      // First get the user data with the hashed password
      const { data: userData, error: userError } = await supabase
        .from("chameleons")
        .select("*")
        .eq("user_id", Number.parseInt(loginData.studentId))
        .single()

      if (userError || !userData) {
        setError("Invalid student ID or password")
        setIsLoading(false)
        return
      }

      // Verify the password against the hashed version
      const isPasswordValid = await verifyPassword(loginData.password, userData.pass)

      if (!isPasswordValid) {
        setError("Invalid student ID or password")
        setIsLoading(false)
        return
      }

      if (userData.is_banned) {
        setError("Your account has been banned. Please contact support.")
        setIsLoading(false)
        return
      }

      // Save credentials if rememberMe is checked, else remove
      if (rememberMe) {
        localStorage.setItem(
          "remembered_login",
          JSON.stringify({ studentId: loginData.studentId, password: loginData.password }),
        )
      } else {
        localStorage.removeItem("remembered_login")
      }

      // Save user session
      const sessionData = {
        user_id: userData.user_id,
        username: userData.username,
        phone_number: userData.phone_number,
        specialization: userData.specialization,
        age: userData.age,
        current_level: userData.current_level,
        is_admin: userData.is_admin,
        is_banned: userData.is_banned,
        created_at: userData.created_at,
        email: userData.email,
        profile_image: userData.profile_image,
      }

      saveStudentSession(sessionData)

      // Redirect to the previous page instead of always going to home
      router.push(previousPath)
      addToast(`Welcome back, ${userData.username}!`, "info")
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")
    setOauthProvider("google")

    try {
      const supabase = createBrowserClient()

      console.log('Starting Google OAuth with origin:', window.location.origin)

      // Use explicit redirectTo to ensure it goes to our callback with proper step
      // You can customize this URL to use your preferred domain
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?mode=signup&step=name-phone`,
          queryParams: {
            access_type: "offline",
            prompt: "select_account", // Force account selection instead of consent
          },
          // Add custom scopes if needed
          scopes: "openid email profile",
        },
      })

      if (error) {
        console.error("OAuth error details:", error)
        setError("Failed to sign in with Google: " + error.message)
        setIsGoogleLoading(false)
        return
      }
    } catch (err) {
      console.error("Google sign-in error:", err)
      setError("An error occurred during Google sign-in")
      setIsGoogleLoading(false)
    }
  }

  const handleGithubSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")
    setOauthProvider("github")

    try {
      const supabase = createBrowserClient()

      console.log('Starting GitHub OAuth with origin:', window.location.origin)

      // Use explicit redirectTo to ensure it goes to our callback with proper step
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?mode=signup&step=name-phone`,
          scopes: "read:user user:email",
        },
      })

      if (error) {
        console.error("GitHub OAuth error details:", error)
        setError("Failed to sign in with GitHub: " + error.message)
        setIsGoogleLoading(false)
        return
      }
    } catch (err) {
      console.error("GitHub sign-in error:", err)
      setError("An error occurred during GitHub sign-in")
      setIsGoogleLoading(false)
    }
  }

  const handleMetaSignIn = async () => {
    setIsGoogleLoading(true)
    setError("")
    setOauthProvider("facebook")

    try {
      const supabase = createBrowserClient()

      console.log('Starting Meta OAuth with origin:', window.location.origin)

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?mode=signup&step=name-phone`,
          scopes: "public_profile email",
        },
      })

      if (error) {
        console.error("Meta OAuth error details:", error)
        setError("Failed to sign in with Meta: " + error.message)
        setIsGoogleLoading(false)
        return
      }
    } catch (err) {
      console.error("Meta sign-in error:", err)
      setError("An error occurred during Meta sign-in")
      setIsGoogleLoading(false)
    }
  }

  useEffect(() => {
    const handleAuthFlow = async () => {
      const stepParam = searchParams.get("step")
      const modeParam = searchParams.get("mode")

      console.log('Auth page: stepParam =', stepParam, 'modeParam =', modeParam)

      // Only handle profile completion for new users coming from callback
      // Also check if we haven't already set the user data to prevent infinite loops
      if (stepParam === "name-phone" && modeParam === "signup" && !googleUserData) {
        console.log('Auth page: Setting up profile completion for new user')
        
        // Get session to populate OAuth data
        const supabase = createBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Detect provider from session metadata
          const provider = session.user.app_metadata?.provider || 'google'
          setOauthProvider(provider as "google" | "github" | "facebook")
          
          setGoogleUserData({
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            picture: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
            sub: session.user.id,
          })
          setAuthStep("name-phone")
          setMode("signup")
        }
      }
    }

    handleAuthFlow()
  }, [searchParams, googleUserData])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Only validate password fields since other validations are done in handleStepForward
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const supabase = createBrowserClient()

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from("chameleons")
        .select("username")
        .eq("username", signupData.username)
        .single()

      if (existingUser) {
        setError("Username already exists")
        setIsLoading(false)
        return
      }

      // Hash the password before storing it
      const hashedPassword = await hashPassword(signupData.password)

      const insertData = {
        username: signupData.username,
        pass: hashedPassword,
        phone_number: signupData.phoneNumber,
        specialization: specialization,
        age: Number.parseInt(signupData.age),
        current_level: Number.parseInt(level),
        is_admin: false,
        is_banned: false,
        email: googleUserData?.email || "", // Add email from Google
        profile_image: googleUserData?.picture || "", // Add profile image from Google
      }

      const { data: newUser, error: insertError } = await supabase
        .from("chameleons")
        .insert(insertData)
        .select()
        .single()

      if (insertError) {
        console.log("Registration error:", insertError)
        setError("Failed to create user profile: " + insertError.message)
        setIsLoading(false)
        return
      }

      if (newUser) {
        const sessionData = {
          user_id: newUser.user_id,
          username: newUser.username,
          phone_number: newUser.phone_number,
          specialization: newUser.specialization,
          age: newUser.age,
          current_level: newUser.current_level,
          is_admin: newUser.is_admin,
          is_banned: newUser.is_banned,
          created_at: newUser.created_at,
          email: newUser.email,
          profile_image: newUser.profile_image,
        }

        saveStudentSession(sessionData)
        setAuthStep("complete")

        // Redirect after a brief success message
        setTimeout(() => {
          router.push(previousPath)
          addToast(`Welcome, ${newUser.username}!`, "info")
        }, 2000)
      }
    } catch (err) {
      console.log("Registration catch error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const toggleMode = (newMode: "login" | "signup") => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("mode", newMode)
    router.replace(`?${newSearchParams.toString()}`, { scroll: false })
    setMode(newMode)
    setError("")
  }

  const handleStepBack = () => {
    if (authStep === "name-phone") {
      setAuthStep("google")
      setGoogleUserData(null)
    } else if (authStep === "specialization") {
      setAuthStep("name-phone")
    } else if (authStep === "password") {
      setAuthStep("specialization")
    }
  }

  const handleStepForward = () => {
    if (authStep === "google") {
      setAuthStep("name-phone")
    } else if (authStep === "name-phone") {
      // Validate name and phone before proceeding
      if (!signupData.username.trim()) {
        setError("Username is required")
        return
      }
      if (!signupData.phoneNumber.trim() || signupData.phoneNumber.length < 11) {
        setError("Valid phone number is required")
        return
      }
      setError("")
      setAuthStep("specialization")
    } else if (authStep === "specialization") {
      // Validate specialization details before proceeding
      if (!specialization) {
        setError("Please select a specialization")
        return
      }
      if (!level) {
        setError("Please select your level")
        return
      }
      if (!signupData.age || Number.parseInt(signupData.age) < 16 || Number.parseInt(signupData.age) > 100) {
        setError("Please enter a valid age (16-100)")
        return
      }
      setError("")
      setAuthStep("password")
    }
  }

  const currentYear = () => new Date().getFullYear()

  const levelOptions = [
    { value: "1", label: `Level 1 - ${currentYear()}/${currentYear() + 1}` },
    { value: "2", label: `Level 2 - ${currentYear() - 1}/${currentYear()}` },
    { value: "3", label: `Level 3 - ${currentYear() - 2}/${currentYear() - 1}` },
    { value: "4", label: `Level 4 - ${currentYear() - 3}/${currentYear() - 2}` },
  ]

  const specializationOptions = [
    { value: "Data Science", label: "Data Science" },
    { value: "Cyber Security", label: "Cyber Security" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Media Analysis", label: "Media Analysis" },
    { value: "Business Analysis", label: "Business Analysis" },
    { value: "Health Care", label: "Health Care" },
  ]

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303] relative">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Floating shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />
      </div>

      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href={`/`}>
          <Button
            variant="ghost"
            className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Main Page
          </Button>
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-4 overflow-visible">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group"></Link>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
          className="relative overflow-visible"
        >
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl overflow-visible">
            <CardHeader className="text-center pb-6">
              {mode === "signup" && (
                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        authStep === "google" ? "bg-purple-500 text-white" : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      1
                    </div>
                    <div
                      className={`w-8 h-1 rounded transition-all ${
                        authStep === "name-phone" || authStep === "specialization" || authStep === "password" || authStep === "complete" ? "bg-purple-500" : "bg-white/20"
                      }`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        authStep === "name-phone"
                          ? "bg-purple-500 text-white"
                          : authStep === "specialization" || authStep === "password" || authStep === "complete"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/10 text-white/40"
                      }`}
                    >
                      2
                    </div>
                    <div
                      className={`w-8 h-1 rounded transition-all ${
                        authStep === "specialization" || authStep === "password" || authStep === "complete" ? "bg-purple-500" : "bg-white/20"
                      }`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        authStep === "specialization"
                          ? "bg-purple-500 text-white"
                          : authStep === "password" || authStep === "complete"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/10 text-white/40"
                      }`}
                    >
                      3
                    </div>
                    <div
                      className={`w-8 h-1 rounded transition-all ${
                        authStep === "password" || authStep === "complete" ? "bg-purple-500" : "bg-white/20"
                      }`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        authStep === "password"
                          ? "bg-purple-500 text-white"
                          : authStep === "complete"
                            ? "bg-purple-500/20 text-purple-300"
                            : "bg-white/10 text-white/40"
                      }`}
                    >
                      4
                    </div>
                    <div
                      className={`w-8 h-1 rounded transition-all ${
                        authStep === "complete" ? "bg-purple-500" : "bg-white/20"
                      }`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        authStep === "complete" ? "bg-purple-500 text-white" : "bg-white/10 text-white/40"
                      }`}
                    >
                      5
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${mode}-${authStep}`}
                  initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {mode === "login"
                      ? "Sign In"
                      : authStep === "google"
                        ? "Create Account"
                        : authStep === "name-phone"
                          ? "Personal Information"
                          : authStep === "specialization"
                            ? "Academic Details"
                            : authStep === "password"
                              ? "Set Your Password"
                              : "Welcome!"}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {mode === "login"
                      ? "Sign in with Google or enter your student ID and password"
                      : authStep === "google"
                        ? "Sign up with Google to get started quickly"
                        : authStep === "name-phone"
                          ? "Tell us your name and phone number"
                          : authStep === "specialization"
                            ? "Choose your specialization, level, and age"
                            : authStep === "password"
                              ? "Create a secure password for your account"
                              : "Your account has been created successfully!"}
                  </CardDescription>
                </motion.div>
              </AnimatePresence>
            </CardHeader>

            <CardContent className="overflow-visible">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}

              <AnimatePresence mode="wait">
                {authStep === "complete" ? (
                  <motion.div
                    key="complete"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                      >
                        ✓
                      </motion.div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Account Created!</h3>
                    <p className="text-white/60 mb-4">Redirecting you to the main page...</p>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto"
                    />
                  </motion.div>
                ) : (
                  <form onSubmit={mode === "login" ? handleLogin : (authStep === "password" ? handleSignup : (e) => { e.preventDefault(); handleStepForward(); })} className="space-y-4 overflow-visible">
                    {(mode === "login" || authStep === "google") && (
                      <div className="flex border border-white/10 rounded-lg p-1 bg-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            toggleMode("login")
                            setAuthStep("google")
                          }}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            mode === "login"
                              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-sm"
                              : "text-white/60 hover:text-white/80"
                          }`}
                        >
                          Sign In
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleMode("signup")
                            setAuthStep("google")
                          }}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            mode === "signup"
                              ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-sm"
                              : "text-white/60 hover:text-white/80"
                          }`}
                        >
                          Sign Up
                        </button>
                      </div>
                    )}

                    {(authStep === "name-phone" || authStep === "specialization" || authStep === "password") && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleStepBack}
                        className="text-white/60 hover:text-white hover:bg-white/5 p-2"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    )}

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${mode}-${authStep}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 overflow-visible"
                      >
                        {mode === "login" || authStep === "google" ? (
                          <>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <Button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isGoogleLoading}
                                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden h-9"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-red-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {isGoogleLoading ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full mr-3"
                                  />
                                ) : (
                                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                    <path
                                      fill="#4285F4"
                                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                      fill="#34A853"
                                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                      fill="#FBBC05"
                                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"
                                    />
                                    <path
                                      fill="#EA4335"
                                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                  </svg>
                                )}
                                Continue with Google
                              </Button>
                            </motion.div>

                            {/* GitHub Button */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 }}
                            >
                              <Button
                                type="button"
                                onClick={handleGithubSignIn}
                                disabled={isGoogleLoading}
                                className="w-full relative overflow-hidden bg-[#24292e] hover:bg-[#1b1f23] text-white border border-[#30363d] transition-all duration-300 group h-9"
                              >
                                {isGoogleLoading && oauthProvider === "github" ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                                  />
                                ) : (
                                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                  </svg>
                                )}
                                Continue with GitHub
                              </Button>
                            </motion.div>

                            {/* Meta/Facebook Button */}
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Button
                                type="button"
                                onClick={handleMetaSignIn}
                                disabled={isGoogleLoading}
                                className="w-full relative overflow-hidden bg-[#0866FF] hover:bg-[#0654d4] text-white border border-[#0866FF]/50 transition-all duration-300 group h-9"
                              >
                                {isGoogleLoading && oauthProvider === "facebook" ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                                  />
                                ) : (
                                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                  </svg>
                                )}
                                Continue with Meta
                              </Button>
                            </motion.div>

                            {mode === "login" && (
                              <></>
                            )}
                          </>
                        ) : authStep === "name-phone" ? (
                          <>
                            {/* Google User Info Display */}
                            {googleUserData && (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg border border-white/10 mb-4"
                              >
                                {googleUserData.picture ? (
                                  <Image
                                    src={googleUserData.picture}
                                    alt="Profile"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full"
                                  />
                                ) : (
                                  <UserCircle className="w-10 h-10 text-white/60" />
                                )}
                                <div>
                                  <p className="text-white font-medium">{googleUserData.name}</p>
                                  <p className="text-white/60 text-sm">{googleUserData.email}</p>
                                </div>
                              </motion.div>
                            )}

                            {/* Name and Phone Form */}
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="space-y-2"
                            >
                              <Label htmlFor="username" className="text-white/80">
                                Username
                              </Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                  id="username"
                                  type="text"
                                  placeholder="Enter your username"
                                  value={signupData.username}
                                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
                                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                                  required
                                />
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-2"
                            >
                              <Label htmlFor="phone" className="text-white/80">
                                Phone Number
                              </Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                  id="phone"
                                  type="tel"
                                  maxLength={15}
                                  minLength={11}
                                  placeholder="Enter your phone number"
                                  value={signupData.phoneNumber}
                                  onChange={(e) => setSignupData({ ...signupData, phoneNumber: e.target.value })}
                                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                                  required
                                />
                              </div>
                            </motion.div>
                          </>
                        ) : authStep === "specialization" ? (
                          <>
                            {/* Specialization Form */}
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="space-y-2"
                            >
                              <Label htmlFor="age" className="text-white/80">
                                Age
                              </Label>
                              <Input
                                id="age"
                                type="number"
                                placeholder="Enter your age"
                                value={signupData.age}
                                onChange={(e) => setSignupData({ ...signupData, age: e.target.value })}
                                className="bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                                required
                              />
                            </motion.div>

                            <CreativeDropdown
                              id="level"
                              label="Level"
                              value={level}
                              onChange={setLevel}
                              options={levelOptions}
                              icon={Star}
                            />

                            <CreativeDropdown
                              id="specialization"
                              label="Specialization"
                              value={specialization}
                              onChange={setSpecialization}
                              options={specializationOptions}
                              icon={GraduationCap}
                            />
                          </>
                        ) : authStep === "password" ? (
                          <>
                            {/* Password Form */}
                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 }}
                              className="space-y-2"
                            >
                              <Label htmlFor="password" className="text-white/80">
                                Password
                              </Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter your password"
                                  value={signupData.password}
                                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </motion.div>

                            <motion.div
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.2 }}
                              className="space-y-2"
                            >
                              <Label htmlFor="confirmPassword" className="text-white/80">
                                Confirm Password
                              </Label>
                              <div className="relative">
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                                <Input
                                  id="confirmPassword"
                                  type={showConfirmPassword ? "text" : "password"}
                                  placeholder="Confirm your password"
                                  value={signupData.confirmPassword}
                                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                  className="pl-10 pr-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                              </div>
                            </motion.div>
                          </>
                        ) : null}
                      </motion.div>
                    </AnimatePresence>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="pt-4"
                    >
                      <Button
                        type={mode === "login" || authStep === "password" ? "submit" : "button"}
                        disabled={isLoading || (mode === "signup" && authStep === "google")}
                        onClick={(e) => {
                          if (mode === "signup" && (authStep === "name-phone" || authStep === "specialization")) {
                            e.preventDefault()
                            handleStepForward()
                          }
                        }}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
                      >
                        {isLoading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          />
                        ) : (
                          <>
                            {mode === "login"
                              ? "Sign In"
                              : authStep === "google"
                                ? "Continue with Google"
                                : authStep === "name-phone"
                                  ? "Continue"
                                  : authStep === "specialization"
                                    ? "Continue"
                                    : authStep === "password"
                                      ? "Complete Registration"
                                      : ""}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </AnimatePresence>

              {(mode === "login" || authStep === "google") && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-center"
                >
                  <p className="text-sm text-white/60">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => {
                        toggleMode(mode === "login" ? "signup" : "login")
                        setAuthStep("google")
                      }}
                      className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                    >
                      {mode === "login" ? "Create one here" : "Sign in here"}
                    </button>
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 grid grid-cols-3 gap-4 text-center"
        >
          {[
            { icon: Shield, text: "Secure" },
            { icon: Sparkles, text: "Modern" },
            { icon: BookOpen, text: "Educational" },
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <feature.icon className="w-4 h-4 text-white/60" />
              </div>
              <span className="text-xs text-white/40">{feature.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}
