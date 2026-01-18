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
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ToastProvider"

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

type AuthStep = "google" | "name" | "specialization" | "password" | "complete"
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
  const [oauthProvider, setOauthProvider] = useState<"google" | "github" | null>(null)

  // Form state
  const [loginData, setLoginData] = useState({
    studentId: "",
    password: "",
  })
  const [signupData, setSignupData] = useState({
    username: "",
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
      if (stepParam === "name" || stepParam === "name-phone") {
        setAuthStep("name")
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
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: loginData.studentId,
          password: loginData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429 && data.lockoutRemaining) {
          setError(`Too many failed login attempts. Please try again in ${data.lockoutRemaining} minutes.`)
        } else {
          setError(data.error || 'Login failed')
        }
        setIsLoading(false)
        return
      }

      // Successful login
      const userData = data.user
      const authEmail = data.authEmail

      // Sign in with Supabase Auth to create session
      const supabase = createBrowserClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: loginData.password,
      })

      if (signInError) {
        console.error('Supabase Auth sign-in error:', signInError)
        setError('Authentication error. Please try again.')
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

      // Session is now managed by Supabase Auth
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
          redirectTo: `${window.location.origin}/auth/callback?mode=signup&step=name`,
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
          redirectTo: `${window.location.origin}/auth/callback?mode=signup&step=name`,
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

  useEffect(() => {
    const handleAuthFlow = async () => {
      const stepParam = searchParams.get("step")
      const modeParam = searchParams.get("mode")

      console.log('Auth page: stepParam =', stepParam, 'modeParam =', modeParam)

      // Only handle profile completion for new users coming from callback
      // Also check if we haven't already set the user data to prevent infinite loops
      if ((stepParam === "name" || stepParam === "name-phone") && modeParam === "signup" && !googleUserData) {
        console.log('Auth page: Setting up profile completion for new user')
        
        // Get session to populate OAuth data
        const supabase = createBrowserClient()
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Detect provider from session metadata
          const provider = session.user.app_metadata?.provider || 'google'
          setOauthProvider(provider as "google" | "github")
          
          setGoogleUserData({
            email: session.user.email || "",
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "",
            picture: session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || "",
            sub: session.user.id,
          })
          setAuthStep("name")
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

      // If using OAuth (Google/GitHub), the user is already created in auth.users
      // Just need to update password if they set one
      let authUserId: string
      const email = googleUserData?.email || `user_${Date.now()}@temp.local` // Fallback email

      if (googleUserData) {
        // OAuth flow - user already exists in auth.users
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setError("Authentication error. Please try again.")
          setIsLoading(false)
          return
        }
        authUserId = user.id
      } else {
        // Regular signup - create auth user first
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: email,
          password: signupData.password,
        })

        if (authError || !authData.user) {
          console.error('Supabase Auth signup error:', authError)
          setError('Failed to create account: ' + (authError?.message || 'Unknown error'))
          setIsLoading(false)
          return
        }
        authUserId = authData.user.id
      }

      // Hash the password before storing it (for backwards compatibility)
      const hashedPassword = await hashPassword(signupData.password)

      const insertData = {
        username: signupData.username,
        pass: hashedPassword,
        specialization: specialization,
        age: Number.parseInt(signupData.age),
        current_level: Number.parseInt(level),
        is_admin: false,
        is_banned: false,
        email: email,
        profile_image: googleUserData?.picture || "",
        auth_id: authUserId, // Link to Supabase Auth user
      }

      // Use API route with service role to bypass RLS
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(insertData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError('Failed to create profile: ' + (errorData.error || 'Unknown error'))
        setIsLoading(false)
        return
      }

      const { data: newUser, error: insertError } = await response.json()

      if (insertError) {
        console.log("Registration error:", insertError)
        setError("Failed to create user profile: " + insertError.message)
        setIsLoading(false)
        return
      }

      if (newUser) {
        // Session is now managed by Supabase Auth
        setAuthStep("complete")

        // Add toast and redirect after a delay
        addToast(`Welcome, ${newUser.username}!`, "success")
        
        // Use setTimeout to ensure the redirect happens only once
        setTimeout(() => {
          router.push(previousPath)
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
    if (authStep === "name") {
      setAuthStep("google")
      setGoogleUserData(null)
    } else if (authStep === "specialization") {
      setAuthStep("name")
    } else if (authStep === "password") {
      setAuthStep("specialization")
    }
  }

  const handleStepForward = () => {
    if (authStep === "google") {
      setAuthStep("name")
    } else if (authStep === "name") {
      // Validate name before proceeding
      if (!signupData.username.trim()) {
        setError("Username is required")
        return
      }
      if (signupData.username.trim().length < 3) {
        setError("Username must be at least 3 characters")
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
      {/* Static background image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05]" />
        <div className="absolute inset-0 bg-[url('/images/Background.png')] bg-cover bg-center bg-no-repeat opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80" />
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
                  <div className="flex items-center space-x-2" style={{ width: "307px" }}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        authStep === "google" ? "bg-purple-500 text-white" : "bg-purple-500/20 text-purple-300"
                      }`}
                    >
                      1
                    </div>
                    <div
                      className={`w-8 h-1 rounded transition-all ${
                        authStep === "name" || authStep === "specialization" || authStep === "password" || authStep === "complete" ? "bg-purple-500" : "bg-white/20"
                      }`}
                    />
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        authStep === "name"
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
                        : authStep === "name"
                          ? "Personal Information"
                          : authStep === "specialization"
                            ? "Academic Details"
                            : authStep === "password"
                              ? "Set Your Password"
                              : "Welcome!"}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {mode === "login"
                      ? "Sign in with Google, GitHub, or enter your student ID and password"
                      : authStep === "google"
                        ? "Sign up with Google or GitHub to get started quickly"
                        : authStep === "name"
                          ? "Tell us your name"
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

                    {(authStep === "name" || authStep === "specialization" || authStep === "password") && (
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
                                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
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

                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.15 }}
                            >
                              <Button
                                type="button"
                                onClick={handleGithubSignIn}
                                disabled={isGoogleLoading}
                                className="w-full bg-[#24292e] hover:bg-[#1b1f23] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {isGoogleLoading ? (
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                                  />
                                ) : (
                                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                  </svg>
                                )}
                                Continue with GitHub
                              </Button>
                            </motion.div>

                            {mode === "login" && (
                              <>
                                {/* Divider */}
                                <div className="relative">
                                  <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                  </div>
                                  <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#030303] text-white/40">or continue with</span>
                                  </div>
                                </div>

                                {/* Traditional Login Fields */}
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.2 }}
                                  className="space-y-2"
                                >
                                  <Label htmlFor="studentId" className="text-white/80">
                                    Student ID
                                  </Label>
                                  <div className="relative">
                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                                    <Input
                                      id="studentId"
                                      type="text"
                                      placeholder="Enter your student ID"
                                      value={loginData.studentId}
                                      onChange={(e) => setLoginData({ ...loginData, studentId: e.target.value })}
                                      className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                                      required
                                    />
                                  </div>
                                </motion.div>

                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 }}
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
                                      value={loginData.password}
                                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
                              </>
                            )}
                          </>
                        ) : authStep === "name" ? (
                          <>
                            {/* OAuth User Info Display */}
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
                                <div className="flex-1">
                                  <p className="text-white font-medium">{googleUserData.name}</p>
                                  <p className="text-white/60 text-sm">{googleUserData.email}</p>
                                </div>
                                {oauthProvider && (
                                  <div className="flex items-center gap-1 text-xs text-white/50 bg-white/5 px-2 py-1 rounded">
                                    {oauthProvider === "google" ? (
                                      <svg className="w-3 h-3" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66 2.84.81-.62z"/>
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                      </svg>
                                    ) : (
                                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                      </svg>
                                    )}
                                    <span className="capitalize">{oauthProvider}</span>
                                  </div>
                                )}
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
                                  minLength={3}
                                  value={signupData.username}
                                  onChange={(e) => setSignupData({ ...signupData, username: e.target.value })}
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
                                maxLength={2}
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
                          if (mode === "signup" && (authStep === "name" || authStep === "specialization")) {
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
                                : authStep === "name"
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
    </div>
  )
}
