"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ToastProvider"

// Helper function to save student session
const saveStudentSession = (userData: {
  user_id: number
  username: string
  phone_number: string
  specialization: string
  age: number
  current_level: number
  is_admin: boolean
  is_banned: boolean
  created_at: string
  email?: string
  profile_image?: string
}) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("student_session", JSON.stringify(userData))
  }
}

export default function CompleteLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToast } = useToast()

  useEffect(() => {
    const sessionParam = searchParams.get("session")
    
    if (sessionParam) {
      try {
        // Decode and parse the session data
        const sessionData = JSON.parse(decodeURIComponent(sessionParam))
        
        // Save the session to localStorage
        saveStudentSession(sessionData)
        
        // Show welcome toast
        addToast(`Welcome back, ${sessionData.username}!`, "success")
        
        // Dispatch login event to fetch notifications
        window.dispatchEvent(new CustomEvent('userLoggedIn', {
          detail: { userId: sessionData.user_id }
        }))
        
        // Redirect to main page
        router.replace("/")
      } catch (error) {
        console.error("Error setting up session:", error)
        addToast("Login failed. Please try again.", "error")
        // Redirect to auth page on error
        router.replace("/auth")
      }
    } else {
      // No session data, redirect to auth
      router.replace("/auth")
    }
  }, [router, searchParams, addToast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303]">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-white/60 mt-4">Completing login...</p>
      </div>
    </div>
  )
}
