"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Sparkles, Shield, BookOpen } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"

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

export default function AuthPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Set initial mode based on URL params
  useEffect(() => {
    const modeParam = searchParams.get("mode")
    if (modeParam === "signup") {
      setMode("signup")
    } else {
      setMode("login")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
    } catch (error) {
      console.error("Google login error:", error)
    } finally {
      setGoogleLoading(false)
    }
  }

  const toggleMode = (newMode: "login" | "signup") => {
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set('mode', newMode)
    router.replace(`?${newSearchParams.toString()}`, { scroll: false })
    setMode(newMode)
  }

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

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="relative">
              
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-sm"
              />
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-white/80 transition-colors">
            </span>
          </Link>

        </motion.div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.4, 0.25, 1] }}
        >
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl shadow-2xl">
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
                    {mode === "login" ? "Welcome Back" : "Create Account"}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {mode === "login"
                      ? "Sign in to continue your learning journey"
                      : "Join thousands of learners worldwide"}
                  </CardDescription>
                </motion.div>
              </AnimatePresence>
            </CardHeader>

            <CardContent>
              {/* Google Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <Button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={googleLoading}
                  variant="outline"
                  className="w-full bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2"
                >
                  {googleLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      <FcGoogle className="w-5 h-5" />
                      <span>Continue with Google</span>
                    </>
                  )}
                </Button>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/[0.02] px-2 text-white/60">
                      Or continue with
                    </span>
                  </div>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Mode toggle buttons */}
                <div className="flex border border-white/10 rounded-lg p-1 bg-white/5">
                  <button
                    type="button"
                    onClick={() => toggleMode("login")}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      mode === "login" 
                        ? "bg-white/10 text-white shadow-sm"
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
                        ? "bg-white/10 text-white shadow-sm"
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
                    className="space-y-4"
                  >
                    {mode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-2"
                      >
                        <Label htmlFor="name" className="text-white/80">
                          Full Name
                        </Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                          <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                            required
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mode === "signup" ? 0.2 : 0.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="email" className="text-white/80">
                        Email Address
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-purple-500/50 focus:ring-purple-500/20"
                          required
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: mode === "signup" ? 0.3 : 0.2 }}
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

                    {mode === "signup" && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
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
                    )}
                  </motion.div>
                </AnimatePresence>

                {mode === "login" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-end"
                  >
                    <Link
                      href="/forgot-password"
                      className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </motion.div>
                )}

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