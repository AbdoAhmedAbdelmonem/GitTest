"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import bcrypt from "bcryptjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Lock, User, ArrowRight, Sparkles, Shield, BookOpen, Phone, Hash, ChevronDown, GraduationCap, Star, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast  } from "@/components/ToastProvider"


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

  const selectedOption = options.find(option => option.value === value)

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
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
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
  const saltRounds = 12; // cost factor
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
}

async function verifyPassword(plainPassword: string, hashedPassword: string) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

const clearStudentSession = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("student_session")
    localStorage.removeItem("remembered_login")
  }
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
  const [previousPath, setPreviousPath] = useState('/')
  const { addToast } = useToast()


  // Form state
  const [loginData, setLoginData] = useState({
    studentId: "",
    password: ""
  })
  const [signupData, setSignupData] = useState({
    username: "",
    phoneNumber: "",
    age: "",
    password: "",
    confirmPassword: ""
  })

  // Set initial mode based on URL params
  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "signup") {
      setMode("signup")
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
    const returnToParam = searchParams.get('returnTo')
    
    // Use the returnTo parameter if available, otherwise use document.referrer if it's from the same origin
    // Fall back to "/" if neither is available
    if (returnToParam) {
      setPreviousPath(returnToParam)
    } else if (referrer && referrer.startsWith(window.location.origin)) {
      // Extract just the path part (remove the origin)
      const path = new URL(referrer).pathname
      // Don't redirect back to auth page
      setPreviousPath(path === '/auth' ? '/' : path)
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
      const isPasswordValid = await verifyPassword(loginData.password, userData.pass);
      
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
          JSON.stringify({ studentId: loginData.studentId, password: loginData.password })
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

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
      const hashedPassword = await hashPassword(signupData.password);

      // Insert new user into chameleons table with hashed password
      const { data: newUser, error: insertError } = await supabase
        .from("chameleons")
        .insert({
          username: signupData.username,
          pass: hashedPassword, // Store the hashed password
          phone_number: signupData.phoneNumber,
          specialization: specialization,
          age: Number.parseInt(signupData.age),
          current_level: Number.parseInt(level),
          is_admin: false,
          is_banned: false,
        })
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
        }

        saveStudentSession(sessionData)
        
        // Redirect to the previous page instead of always going to home
        router.push(previousPath)
      }
    } catch (err) {
      console.log("Registration catch error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const toggleMode = (newMode: "login" | "signup") => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('mode', newMode)
    router.replace(`?${newSearchParams.toString()}`, { scroll: false })
    setMode(newMode)
    setError("")
  }

  const currentYear = () => new Date().getFullYear();

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
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              
          </Link>
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
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardTitle className="text-2xl font-bold text-white mb-2">
                    {mode === "login" ? "Sign In" : "Create Account"}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {mode === "login"
                      ? "Enter your student ID and password to access your account"
                      : "Fill in your details to create a new student account"}
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

              <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4 overflow-visible">
                {/* Mode toggle buttons */}
                <div className="flex border border-white/10 rounded-lg p-1 bg-white/5">
                  <button
                    type="button"
                    onClick={() => toggleMode("login")}
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
                    onClick={() => toggleMode("signup")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === "signup" 
                        ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white shadow-sm"
                        : "text-white/60 hover:text-white/80"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-visible"
                  >
                    {mode === "login" ? (
                      <>
                        {/* Login Fields */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
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
                              onChange={(e) => setLoginData({...loginData, studentId: e.target.value})}
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
                              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
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
                          transition={{ delay: 0.3 }}
                          className="flex items-center space-x-2"
                        >
                          <input
                            id="remember"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 rounded bg-white/5 border-white/20 text-purple-500 focus:ring-purple-500/20"
                          />
                          <Label htmlFor="remember" className="text-white/80 text-sm">
                            Remember Me
                          </Label>
                        </motion.div>
                      </>
                    ) : (
                      <>
                        {/* Signup Fields */}
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
                              onChange={(e) => setSignupData({...signupData, username: e.target.value})}
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
                              onChange={(e) => setSignupData({...signupData, phoneNumber: e.target.value})}
                              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                              required
                            />
                          </div>
                        </motion.div>

                        <div className="grid grid-cols-2 gap-4">
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="space-y-2"
                          >
                            <Label htmlFor="age" className="text-white/80">
                              Age
                            </Label>
                            <Input
                              id="age"
                              type="number"
                              placeholder="Age"
                              value={signupData.age}
                              onChange={(e) => setSignupData({...signupData, age: e.target.value})}
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
                        </div>

                        <CreativeDropdown
                          id="specialization"
                          label="Specialization"
                          value={specialization}
                          onChange={setSpecialization}
                          options={specializationOptions}
                          icon={GraduationCap}
                        />

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
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
                              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
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
                          transition={{ delay: 0.6 }}
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
                              onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
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
                    )}
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
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
                        {mode === "login" ? "Sign In" : "Create Account"}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

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
                    onClick={() => toggleMode(mode === "login" ? "signup" : "login")}
                    className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                  >
                    {mode === "login" ? "Create one here" : "Sign in here"}
                  </button>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features */}
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

      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}

// Export the auth functions for use in other components
export { getStudentSession, clearStudentSession, saveStudentSession, hashPassword, verifyPassword }
