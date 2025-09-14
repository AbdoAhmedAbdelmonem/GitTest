"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Helper function to save student session
const saveStudentSession = (userData: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("student_session", JSON.stringify(userData))
  }
}

export default function CompleteLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const sessionParam = searchParams.get("session")
    
    if (sessionParam) {
      try {
        // Decode and parse the session data
        const sessionData = JSON.parse(decodeURIComponent(sessionParam))
        
        // Save the session to localStorage
        saveStudentSession(sessionData)
        
        // Redirect to main page
        router.replace("/")
      } catch (error) {
        console.error("Error setting up session:", error)
        // Redirect to auth page on error
        router.replace("/auth")
      }
    } else {
      // No session data, redirect to auth
      router.replace("/auth")
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030303]">
      <div className="text-center">
        <LoadingSpinner />
        <p className="text-white/60 mt-4">Completing login...</p>
      </div>
    </div>
  )
}