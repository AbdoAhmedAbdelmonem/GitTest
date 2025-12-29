"use client"

import { useEffect, useState } from "react"
import { getStudentSession } from "@/lib/auth"
import { createBrowserClient } from "@/lib/supabase/client"
import { getLeaderboardData } from "@/lib/tournament"
import { calculateTournamentPoints } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, User, BookOpen, Star, Award, Calendar, Phone, GraduationCap, Shield, Edit3, LogOut, Save, X, TrendingUp, Mail, Trophy, Video, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast  } from "@/components/ToastProvider"
import Image from "next/image"
import { useAddNotification } from "@/components/notification"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { departmentData, type Subject } from '@/lib/department-data'


interface QuizQuestion {
  correct: boolean;
  question_text: string;
}

// Dot Plot with KDE Visualization Component
function ProgressDotPlot({ quizData }: { quizData: any[] }) {
  if (!quizData.length) return null;

  // Process quiz data for visualization
  const processData = () => {
    // Filter and sort by date
    const sortedData = [...quizData]
      .filter(attempt => attempt.score !== undefined && attempt.score !== null)
      .sort((a, b) => new Date(a.solved_at || a.created_at).getTime() - new Date(b.solved_at || b.created_at).getTime());
    
    if (sortedData.length === 0) return [];
    
    return sortedData.map((attempt, index) => {
      return {
        trial: index + 1,
        score: Math.round(Number(attempt.score)),
        date: new Date(attempt.solved_at || attempt.created_at).toLocaleDateString(),
        quizTitle: attempt.quiz_title || "Quiz",
        totalQuestions: attempt.total_questions || "N/A"
      };
    });
  };

  const data = processData();
  if (data.length === 0) return null;

  const maxTrial = data.length;

  return (
    <Card className="bg-black/40 border-white/20 shadow-2xl mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-400" />
          Progress Over Attempts
        </CardTitle>
        <CardDescription className="text-white/60">
          Your performance across quiz attempts with trend line
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-white/60 py-2">
            <span>100</span>
            <span>75</span>
            <span>50</span>
            <span>25</span>
            <span>0</span>
          </div>
          
          {/* Main chart area */}
          <div className="ml-8 h-full relative">
            {/* Horizontal grid lines */}
            {[0, 25, 50, 75, 100].map((score) => (
              <div 
                key={score}
                className="absolute left-0 right-0 border-t border-white/10"
                style={{ top: `${100 - score}%` }}
              />
            ))}
            
            {/* Connection lines between dots */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
              {data.slice(0, -1).map((point, i) => {
                const nextPoint = data[i + 1];
                return (
                  <line
                    key={i}
                    x1={`${(point.trial / maxTrial) * 100}%`}
                    y1={`${100 - point.score}%`}
                    x2={`${(nextPoint.trial / maxTrial) * 100}%`}
                    y2={`${100 - nextPoint.score}%`}
                    stroke="rgba(168, 85, 247, 0.5)"
                    strokeWidth="2"
                  />
                );
              })}
            </svg>
            
            {/* Data points */}
            {data.map((point, i) => (
              <div
                key={i}
                className="absolute w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white/70 shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{
                  left: `${(point.trial / maxTrial) * 100}%`,
                  top: `${100 - point.score}%`
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/90 text-white text-xs p-2 rounded whitespace-nowrap shadow-xl z-20">
                  <div className="font-bold">{point.quizTitle}</div>
                  <div>Trial {point.trial}: {point.score}%</div>
                  <div>Date: {point.date}</div>
                  <div>Questions: {point.totalQuestions}</div>
                </div>
              </div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="ml-8 mt-2 flex justify-between text-xs text-white/60">
            <span>Trial 1</span>
            <span>Trial {Math.floor(maxTrial/2)}</span>
            <span>Trial {maxTrial}</span>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-white/60">
          <p style={{marginTop: "3rem"}}>This visualization shows your quiz scores across attempts, with a line connecting your performance over time.</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500"></span>
            <span>Each dot represents a quiz attempt</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="w-4 h-0.5 bg-purple-500/50"></span>
            <span>Line shows progress trend across attempts</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to get user's registered subjects based on level and department
function getUserSubjects(level: number, specialization: string, currentTerm: 'term1' | 'term2' = 'term1'): Subject[] {
  console.log('🔍 getUserSubjects called with:', { level, specialization, currentTerm })
  
  // Map ALL possible specialization name variations to department keys
  const departmentKeyMap: { [key: string]: string } = {
    // Computing and Data Sciences variations
    'Computing and Data Sciences': 'computing-data-sciences',
    'computing and data sciences': 'computing-data-sciences',
    'Data Science': 'computing-data-sciences',
    'data science': 'computing-data-sciences',
    'Computing & Data Sciences': 'computing-data-sciences',
    'FCDS': 'computing-data-sciences',
    
    // Business Analytics variations
    'Business Analytics': 'business-analytics',
    'business analytics': 'business-analytics',
    'BA': 'business-analytics'
  }
  
  const departmentKey = departmentKeyMap[specialization] || departmentKeyMap[specialization?.toLowerCase()]
  console.log('✅ Mapped department key:', departmentKey, 'from specialization:', specialization)
  
  if (!departmentKey) {
    console.error('❌ No department key found for specialization:', specialization)
    console.log('Available mappings:', Object.keys(departmentKeyMap))
    return []
  }
  
  if (!departmentData[departmentKey]) {
    console.error('❌ Department not found in departmentData:', departmentKey)
    console.log('Available departments:', Object.keys(departmentData))
    return []
  }
  
  const department = departmentData[departmentKey]
  console.log('✅ Found department:', department.name)
  
  if (!department.levels[level]) {
    console.error('❌ Level not found:', level, 'Available levels:', Object.keys(department.levels))
    return []
  }
  
  const subjects = department.levels[level].subjects[currentTerm] || []
  console.log('✅ Found subjects:', subjects.length, 'subjects for level', level, currentTerm)
  
  if (subjects.length > 0) {
    console.log('📚 Subject names:', subjects.map(s => s.name))
  }
  
  return subjects
}

// Helper function to extract Google Drive folder ID from URL and create internal drive link
function createDriveLink(googleDriveUrl: string, driveId: string = 'ee201328c6b4'): string {
  if (!googleDriveUrl || googleDriveUrl === '' || googleDriveUrl === ' ') {
    return '#'
  }
  
  // Extract folder ID from Google Drive URL
  // Format: https://drive.google.com/drive/folders/{folderId}?usp=...
  const folderIdMatch = googleDriveUrl.match(/folders\/([a-zA-Z0-9_-]+)/)
  
  if (folderIdMatch && folderIdMatch[1]) {
    const folderId = folderIdMatch[1]
    return `/drive/${driveId}/${folderId}`
  }
  
  // If no match, return the original URL (fallback)
  console.warn('Could not extract folder ID from:', googleDriveUrl)
  return googleDriveUrl
}

// Helper function to determine current term based on date
function getCurrentTerm(): 'term1' | 'term2' {
  const now = new Date()
  const month = now.getMonth() + 1 // JavaScript months are 0-indexed
  
  // Term 2 starts on February 1st each year
  // Term 1: September 1 - January 31
  // Term 2: February 1 - August 31
  if (month >= 2 && month <= 8) {
    return 'term2'
  }
  return 'term1'
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [quizData, setQuizData] = useState<any[]>([])
  const [tournamentData, setTournamentData] = useState<{
    level1Rank?: number;
    level1Points?: number;
    level2Rank?: number;
    level2Points?: number;
    level3Rank?: number;
    level3Points?: number;
  }>({})
  const [loading, setLoading] = useState(true)
  const [tournamentLoading, setTournamentLoading] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    username: "",
    age: "",
    phone_number: ""
  })
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    age?: string;
    phone_number?: string;
    general?: string;
  }>({})
  const { addToast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const addNotification = useAddNotification()

  useEffect(() => {
    const loadProfileData = async () => {
      const session = getStudentSession()
      if (!session) {
        setIsRedirecting(true)
        router.push("/auth")
        return
      }

      setUserData(session)
      // Initialize edit form with current data
      setEditForm({
        username: session.username || "",
        age: String(session.age || ""),
        phone_number: session.phone_number || ""
      })

      const supabase = createBrowserClient()

      // Get user's quiz attempts
      const { data: attemptsData } = await supabase
        .from("quiz_data")
        .select(`*`)
        .eq("user_id", session.user_id)
        .order("solved_at", { ascending: false })

      setQuizData(attemptsData || [])
      setLoading(false)

      // Load tournament data asynchronously after main profile loads
      loadTournamentData(session, supabase)
    }

    const loadTournamentData = async (session: any, supabase: any) => {
      setTournamentLoading(true)
      try {
        // Get user's tournament quiz data directly
        const tournamentStart = new Date('2025-10-11T00:00:00.000Z')
        const tournamentEnd = new Date('2026-01-11T23:59:59.999Z')

        const { data: tournamentQuizzes } = await supabase
          .from("quiz_data")
          .select('*')
          .eq("user_id", session.user_id)
          .not("score", "is", null)
          .gte("solved_at", tournamentStart.toISOString())
          .lte("solved_at", tournamentEnd.toISOString())

        console.log("User tournament quizzes:", tournamentQuizzes)

        let level1Points = 0, level2Points = 0, level3Points = 0

        if (tournamentQuizzes && tournamentQuizzes.length > 0) {
          // Track first attempt for each quiz per user (same logic as tournament.ts)
          const userQuizFirstAttempt = new Map<number, any>()

          // First pass: identify first attempt for each quiz_id
          tournamentQuizzes.forEach((quiz: any) => {
            const quizId = quiz.quiz_id
            const existing = userQuizFirstAttempt.get(quizId)
            
            // Keep the earliest attempt (oldest solved_at timestamp)
            if (!existing || new Date(quiz.solved_at) < new Date(existing.solved_at)) {
              userQuizFirstAttempt.set(quizId, quiz)
            }
          })

          console.log(`First attempts found: ${userQuizFirstAttempt.size} unique quiz attempts`)

          // Second pass: calculate points only for first attempts
          userQuizFirstAttempt.forEach((quiz: any) => {
            const rawPoints = calculateTournamentPoints(
              quiz.score || 0,
              quiz.duration_selected || "15 minutes",
              quiz.answering_mode || "traditional", 
              quiz.how_finished || "completed"
            )

            // Reduce points by dividing by 10 and rounding
            const points = Math.round(rawPoints / 10)

            if (quiz.quiz_level === 1 && session.current_level === 1) {
              level1Points += points
            } else if (quiz.quiz_level === 2 && session.current_level === 2) {
              level2Points += points
            } else if (quiz.quiz_level === 3 && session.current_level === 3) {
              level3Points += points
            }
          })
        }

        // Get leaderboard data to find ranks
        const [level1Data, level2Data, level3Data] = await Promise.all([
          getLeaderboardData(1),
          getLeaderboardData(2),
          getLeaderboardData(3)
        ])

        let level1Rank, level2Rank, level3Rank

        // Find rank for level 1
        if (level1Points > 0) {
          const level1UserInTop10 = level1Data.leaderboard.find(entry => entry.id === session.user_id)
          if (level1UserInTop10) {
            level1Rank = level1Data.leaderboard.indexOf(level1UserInTop10) + 1
          } else if (level1Data.currentUserEntry) {
            // User not in top 10, get approximate rank
            const allUsersAbove = level1Data.leaderboard.filter(entry => entry.points > level1Points).length
            level1Rank = allUsersAbove + 1
          }
        }

        // Find rank for level 2  
        if (level2Points > 0) {
          const level2UserInTop10 = level2Data.leaderboard.find(entry => entry.id === session.user_id)
          if (level2UserInTop10) {
            level2Rank = level2Data.leaderboard.indexOf(level2UserInTop10) + 1
          } else if (level2Data.currentUserEntry) {
            const allUsersAbove = level2Data.leaderboard.filter(entry => entry.points > level2Points).length
            level2Rank = allUsersAbove + 1
          }
        }

        // Find rank for level 3  
        if (level3Points > 0) {
          const level3UserInTop10 = level3Data.leaderboard.find(entry => entry.id === session.user_id)
          if (level3UserInTop10) {
            level3Rank = level3Data.leaderboard.indexOf(level3UserInTop10) + 1
          } else if (level3Data.currentUserEntry) {
            const allUsersAbove = level3Data.leaderboard.filter(entry => entry.points > level3Points).length
            level3Rank = allUsersAbove + 1
          }
        }

        setTournamentData({
          level1Rank: level1Points > 0 ? level1Rank : undefined,
          level1Points: level1Points > 0 ? level1Points : undefined,
          level2Rank: level2Points > 0 ? level2Rank : undefined,
          level2Points: level2Points > 0 ? level2Points : undefined,
          level3Rank: level3Points > 0 ? level3Rank : undefined,
          level3Points: level3Points > 0 ? level3Points : undefined
        })

        console.log("Tournament data set:", {
          level1Rank, level1Points, level2Rank, level2Points, level3Rank, level3Points
        })
        
      } catch (error) {
        console.error("Error fetching tournament data:", error)
      } finally {
        setTournamentLoading(false)
      }
    }

    loadProfileData()
  }, [router])

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      // Clear all local storage
      localStorage.clear()
      
      // Clear session storage
      sessionStorage.clear()
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        const eqPos = c.indexOf("=")
        const name = eqPos > -1 ? c.substr(0, eqPos) : c
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
        document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
      })
      
      // Clear Supabase session with global scope
      const supabase = createBrowserClient()
      await supabase.auth.signOut({ scope: 'global' })
      
      // Force reload to clear any cached state
      window.location.href = '/'
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setEditForm({
      username: userData.username,
      age: userData.age.toString(),
      phone_number: userData.phone_number
    })
    setIsEditing(false)
    setValidationErrors({})
  }

  const validateForm = () => {
    const errors: { username?: string; age?: string; phone_number?: string; general?: string } = {}

    // Check if at least one field has been changed
    const hasUsernameChanged = editForm.username.trim() !== userData.username
    const hasAgeChanged = parseInt(editForm.age) !== userData.age
    const hasPhoneChanged = editForm.phone_number.trim() !== userData.phone_number

    if (!hasUsernameChanged && !hasAgeChanged && !hasPhoneChanged) {
      errors.general = "At least one field must be changed to save"
    }

    // Username validation
    if (!editForm.username.trim()) {
      errors.username = "Username is required"
    } else if (editForm.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters long"
    }

    // Age validation
    const ageNum = parseInt(editForm.age)
    if (!editForm.age.trim()) {
      errors.age = "Age is required"
    } else if (isNaN(ageNum) || ageNum < 1) {
      errors.age = "Please enter a valid age"
    } else if (ageNum > 99) {
      errors.age = "Age cannot exceed 99 years"
    }

    // Phone number validation
    if (!editForm.phone_number.trim()) {
      errors.phone_number = "Phone number is required"
    } else if (editForm.phone_number.trim().length < 11) {
      errors.phone_number = "Phone number must be at least 11 characters long"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSaveEdit = async () => {
    // Validate form before saving
    if (!validateForm()) {
      addToast("Please fix the validation errors before saving.", "error")
      return
    }

    setIsSaving(true)
    const supabase = createBrowserClient()
    
    try {
      // Update user data in the database
      const { data, error } = await supabase
        .from("chameleons")
        .update({
          username: editForm.username.trim(),
          age: parseInt(editForm.age),
          phone_number: editForm.phone_number.trim()
        })
        .eq("user_id", userData.user_id)
        .select()

      if (error) {
        console.error("Error updating profile:", error)
        addToast("Failed to update profile. Please try again.", "error")
        return
      }

      if (data && data.length > 0) {
        // Update local state with new data
        const updatedUserData = { ...userData, ...data[0] }
        setUserData(updatedUserData)
        
        // Update session storage
        if (typeof window !== 'undefined') {
          const session = getStudentSession()
          if (session) {
            const updatedSession = { ...session, ...data[0] }
            localStorage.setItem("student_session", JSON.stringify(updatedSession))
          }
        }
        
        setIsEditing(false)
        setValidationErrors({})
        addToast("Profile updated successfully!", "success")
        // Add a notification about profile update
        addNotification(
          userData.user_id,
          "Profile Updated",
          "System",
          "success",
          "Your profile information has been successfully updated, it may require re-login to reflect changes!",
          "false"
        )
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      addToast("Failed to update profile. Please try again.", "error")
      addNotification(
        userData.user_id,
        "Profile Update Failed",
        "System",
        "failure",
        "There was an error updating your profile information. Please try again.",
        "false"
      )
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))

    // Clear validation error for this field when user starts typing
    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  // Show loading while checking authentication or redirecting
  if (loading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">User not found</h2>
          <Button asChild>
            <Link href="/auth">Go to Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen w-full overflow-x-hidden relative"
      style={{
        backgroundImage: 'url(/images/Background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      
          {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 bg-black/30"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Logout Button */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 bg-black/30"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Main content - Fixed centering */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-20 overflow-visible">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in duration-800">
          <div className="relative inline-block mb-6 group">
            {/* Spinning Border for Admin */}
            {userData.is_admin && (
              <div 
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, #ef4444 0%, #eab308 25%, #22c55e 50%, #3b82f6 75%, #ef4444 100%)',
                  animation: 'spin 3s linear infinite'
                }}
              />
            )}
            
            {/* Profile Image Container */}
            <div 
              className={`relative rounded-full shadow-2xl transition-all duration-500 hover:scale-110 ${
                userData.is_admin 
                  ? 'w-28 h-28' 
                  : 'w-24 h-24'
              }`}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                padding: '3px',
                margin: userData.is_admin ? '3px' : '0'
              }}
            >
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                {userData.profile_image ? (
                  <Image
                    src={userData.profile_image}
                    alt="Profile"
                    width={userData.is_admin ? 106 : 96}
                    height={userData.is_admin ? 106 : 96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className={`${userData.is_admin ? 'w-14 h-14' : 'w-12 h-12'} text-white`} />
                )}
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-white/60">Manage your account and view your progress</p>
          
          {/* Enhanced Animations */}
          <style jsx>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* User Info Card */}
          <div className="md:col-span-1 animate-in slide-in-from-left duration-500 delay-100">
            <Card className="bg-black/40 border-white/20 shadow-2xl h-full">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-xl font-bold text-white">Personal Information</CardTitle>
                <CardDescription className="text-white/60">Your account details</CardDescription>
                {validationErrors.general && (
                  <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-red-400 text-sm text-center">{validationErrors.general}</p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-yellow-500/20">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">User ID</p>
                    <p className="text-white font-medium">{userData.user_id}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-blue-500/20">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="text-white font-medium">{userData.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-purple-500/20">
                    <User className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="username" className="text-sm text-white/60 block mb-1">Username</Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="username"
                          name="username"
                          value={editForm.username}
                          onChange={handleInputChange}
                          className={`bg-white/10 border-white/20 text-white ${validationErrors.username ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.username && (
                          <p className="text-red-400 text-xs mt-1">{validationErrors.username}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-white font-medium">{userData.username}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-green-500/20">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="phone_number" className="text-sm text-white/60 block mb-1">Phone Number</Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          value={editForm.phone_number}
                          onChange={handleInputChange}
                          className={`bg-white/10 border-white/20 text-white ${validationErrors.phone_number ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.phone_number && (
                          <p className="text-red-400 text-xs mt-1">{validationErrors.phone_number}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-white font-medium">{userData.phone_number}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-orange-500/20">
                    <Calendar className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="age" className="text-sm text-white/60 block mb-1">Age</Label>
                    {isEditing ? (
                      <>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={editForm.age}
                          onChange={handleInputChange}
                          className={`bg-white/10 border-white/20 text-white ${validationErrors.age ? 'border-red-500' : ''}`}
                        />
                        {validationErrors.age && (
                          <p className="text-red-400 text-xs mt-1">{validationErrors.age}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-white font-medium">{userData.age}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-amber-500/20">
                    <GraduationCap className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Level</p>
                    <p className="text-white font-medium">Level {userData.current_level}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-pink-500/20">
                    <BookOpen className="w-5 h-5 text-pink-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Specialization</p>
                    <p className="text-white font-medium">{userData.specialization}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="p-3 rounded-full bg-indigo-500/20">
                    <Shield className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Status</p>
                    <p className="text-white font-medium">
                      {userData.email === "tokyo9900777@gmail.com"?"Owner":userData.is_admin 
                        ? "Administrator" 
                        : userData.is_banned 
                          ? "Banned" 
                          : "Active Student"
                      }
                    </p>
                  </div>
                </div>

                {/* Tournament Information */}
                <div className="space-y-3">
                  <div className="text-center">
                    <h4 className="text-sm font-semibold text-yellow-400 flex items-center justify-center gap-2">
                      <Trophy className="w-4 h-4" />
                      Tournament Standing
                    </h4>
                  </div>
                  
                  {tournamentLoading ? (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="p-3 rounded-full bg-yellow-500/20">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/60">Loading tournament data...</p>
                        <LoadingSpinner size="sm" />
                      </div>
                    </div>
                  ) : (tournamentData.level1Points || tournamentData.level2Points || tournamentData.level3Points) ? (
                    <>
                      {tournamentData.level1Points && (
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
                          <div className="p-3 rounded-full bg-yellow-500/20">
                            <Award className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white/60">Level 1 Tournament</p>
                            <p className="text-white font-medium">
                              {tournamentData.level1Points} points
                              {tournamentData.level1Rank && ` • Rank #${tournamentData.level1Rank}`}
                            </p>
                          </div>
                          <Button 
                            asChild 
                            size="sm" 
                            className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30"
                          >
                            <Link href="/Tournament">View</Link>
                          </Button>
                        </div>
                      )}
                      
                      {tournamentData.level2Points && (
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                          <div className="p-3 rounded-full bg-purple-500/20">
                            <Award className="w-5 h-5 text-purple-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white/60">Level 2 Tournament</p>
                            <p className="text-white font-medium">
                              {tournamentData.level2Points} points
                              {tournamentData.level2Rank && ` • Rank #${tournamentData.level2Rank}`}
                            </p>
                          </div>
                          <Button 
                            asChild 
                            size="sm" 
                            className="bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
                          >
                            <Link href="/Tournament">View</Link>
                          </Button>
                        </div>
                      )}

                      {tournamentData.level3Points && (
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                          <div className="p-3 rounded-full bg-blue-500/20">
                            <Award className="w-5 h-5 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-white/60">Level 3 Tournament</p>
                            <p className="text-white font-medium">
                              {tournamentData.level3Points} points
                              {tournamentData.level3Rank && ` • Rank #${tournamentData.level3Rank}`}
                            </p>
                          </div>
                          <Button 
                            asChild 
                            size="sm" 
                            className="bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30"
                          >
                            <Link href="/Tournament">View</Link>
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="p-3 rounded-full bg-gray-500/20">
                        <Trophy className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-white/60">Tournament Status</p>
                        <p className="text-white/80 font-medium">Not participating yet</p>
                        <p className="text-xs text-white/50 mt-1">Take a quiz to join the tournament!</p>
                      </div>
                      <Button 
                        asChild 
                        size="sm" 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Link href="/Tournament">Join</Link>
                      </Button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleSaveEdit}
                      disabled={isSaving}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white border-0 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                    >
                      {isSaving ? (
                        <LoadingSpinner size="sm" className="mr-2" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </Button>
                    <Button 
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="flex-1 text-red-500 bg-black hover:text-white hover:bg-red-500 hover:border-red-500 border-red-500"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={handleEdit}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quiz History Card */}
          <div className="md:col-span-2 animate-in slide-in-from-right duration-500 delay-200">
            <Card className="bg-black/40 border-white/20 shadow-2xl h-full">
              <CardHeader style={{height: "auto"}} className="text-center pb-6">
                <CardTitle className="text-xl font-bold text-white">Quiz History</CardTitle>
                <CardDescription className="text-white/60">
                  Your recent quiz attempts and performance
                </CardDescription>
              </CardHeader>
              <CardContent style={{height: "64.5rem"}} className="overflow-y-auto custom-scrollbar">
                {quizData.length > 0 ? (
                  <div className="space-y-4 flex-1">
                  {quizData.map((attempt, index) => {
                    // Determine theme colors based on chosen_theme
                    let themeColor = '#8b5cf6'; // Default purple
                    let themeShadow = 'rgba(139, 92, 246, 0.3)';
                    
                    // Map theme name to color if available
                    if (attempt.chosen_theme) {
                    switch(attempt.chosen_theme) {
                      case "Ocean":
                      themeColor = '#0066cc';
                      themeShadow = 'rgba(0, 102, 204, 0.3)';
                      break;
                      case "Forest": 
                      themeColor = '#228B22';
                      themeShadow = 'rgba(34, 139, 34, 0.3)';
                      break;
                      case "Sunset":
                      themeColor = '#FF6B35';
                      themeShadow = 'rgba(255, 107, 53, 0.3)';
                      break;
                      case "Purple":
                      themeColor = '#8A2BE2';
                      themeShadow = 'rgba(138, 43, 226, 0.3)';
                      break;
                      case "Rose":
                      themeColor = '#E91E63';
                      themeShadow = 'rgba(233, 30, 99, 0.3)';
                      break;
                      case "Teal":
                      themeColor = '#009688';
                      themeShadow = 'rgba(0, 150, 136, 0.3)';
                      break;
                    }
                    }
                    
                    return (
                    <div
                      key={attempt.id || index}
                      className="p-4 rounded-lg border border-white/10 overflow-hidden relative h-full animate-in fade-in duration-300"
                      style={{
                      background: `linear-gradient(90deg, ${themeColor}20 0%, ${themeColor}10 ${attempt.score || 0}%, rgba(0,0,0,0.2) ${attempt.score || 0}%)`,
                      animationDelay: `${index * 100}ms`
                      }}
                    >
                      {/* Background progress indicator */}
                      <div 
                      className="absolute inset-0 z-0"
                      style={{
                        background: `linear-gradient(90deg, ${themeColor}30 0%, transparent ${attempt.score || 0}%)`,
                        boxShadow: `inset 0 0 15px ${themeShadow}`,
                      }}
                      />
                      
                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-medium">Quiz #{attempt.quiz_id}</h3>
                        <div 
                        className="flex items-center gap-2 px-2 py-1 rounded-full" 
                        style={{
                          backgroundColor: `${themeColor}30`,
                          borderLeft: `2px solid ${themeColor}`
                        }}
                        >
                        <Star className="w-3 h-3" style={{ color: themeColor }} />
                        <span className="text-xs" style={{ color: themeColor }}>
                          {attempt.score !== undefined ? `${Math.round(attempt.score)}%` : "No score"}
                        </span>
                        </div>
                      </div>
                      
                      <p className="text-white/60 text-sm mb-3">
                        {attempt.total_questions 
                        ? `Answered ${Math.round(attempt.score / 100 * attempt.total_questions)} out of ${attempt.total_questions} questions correctly`
                        : "Quiz attempt record"
                        }
                      </p>
                      
                      {/* Fill space with questions section if available */}
                      {attempt.questions_data && attempt.questions_data.length > 0 && (
                        <div className="mb-4 p-3 rounded-md bg-black/20 border border-white/5 flex-1">
                        <div className="text-sm text-white/80 mb-2">Questions:</div>
                        <div className="space-y-2">
                          {attempt.questions_data.slice(0, 3).map((q: QuizQuestion, i: number) => (
                          <div key={i} className="flex items-start gap-2">
                            <div 
                            className={`min-w-4 h-4 rounded-full mt-1`}
                            style={{ backgroundColor: q.correct ? '#22c55e' : '#ef4444' }}
                            ></div>
                            <div className="flex-1 text-xs text-white/70">{q.question_text || `Question ${i+1}`}</div>
                          </div>
                          ))}
                          {attempt.questions_data.length > 3 && (
                          <div className="text-xs text-white/50 italic">
                            +{attempt.questions_data.length - 3} more questions
                          </div>
                          )}
                        </div>
                        </div>
                      )}
                      
                      {/* Adding answering_mode and duration badges */}
                      <div className="flex flex-wrap gap-2 mb-3 mt-auto">
                        {attempt.answering_mode && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full inline-flex items-center"
                          style={{
                          backgroundColor: `${themeColor}20`,
                          color: themeColor
                          }}
                        >
                          <span 
                          className="w-2 h-2 rounded-full mr-1.5"
                          style={{ backgroundColor: themeColor }}
                          ></span>
                          {attempt.answering_mode}
                        </span>
                        )}
                        {attempt.duration_selected && (
                        <span 
                          className="text-xs px-2 py-1 rounded-full inline-flex items-center"
                          style={{
                          backgroundColor: `${themeColor}15`,
                          color: themeColor
                          }}
                        >
                          <span 
                          className="w-2 h-2 rounded-full mr-1.5"
                          style={{ backgroundColor: themeColor }}
                          ></span>
                          {attempt.duration_selected}
                        </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Award 
                          className="w-4 h-4" 
                          style={{ color: themeColor }}
                          />
                          <span className="text-xs text-white/60">
                          {attempt.how_finished === "in-progress" ? "Timed Out" : "Completed"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar 
                          className="w-4 h-4" 
                          style={{ color: themeColor }}
                          />
                          <span className="text-xs text-white/60">
                          {new Date(attempt.created_at || attempt.solved_at).toLocaleDateString()}
                          </span>
                        </div>
                        </div>
                      </div>
                      </div>
                    </div>
                    );
                  })}
                  </div>
                ) : (
                  <div className="text-center py-12 h-full flex flex-col items-center justify-center">
                    <BookOpen className="w-12 h-12 text-white/30 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No quiz attempts yet</h3>
                    <p className="text-white/60 mb-4">Start your learning journey by taking a quiz!</p>
                    <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500">
                      <Link href="/">Explore Quizzes</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-12 animate-in fade-in duration-500 delay-300">
          <Card className="bg-black/40 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-bold text-white">Learning Statistics</CardTitle>
              <CardDescription className="text-white/60">Your overall progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{quizData.length}</h3>
                  <p className="text-white/60 text-sm">Quizzes Taken</p>
                </div>

                <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Star className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {quizData.length > 0 
                      ? Math.round(quizData.reduce((sum, attempt) => sum + (Number(attempt.score) || 0), 0) / quizData.length) 
                      : 0
                    }%
                  </h3>
                  <p className="text-white/60 text-sm">Average Score</p>
                </div>

                <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {quizData.filter(attempt => attempt.score >= 80).length}
                  </h3>
                  <p className="text-white/60 text-sm">Mastered Quizzes</p>
                </div>

                <div className="text-center p-6 rounded-lg bg-white/5 border border-white/10">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {new Date(userData.created_at).toLocaleDateString()}
                  </h3>
                  <p className="text-white/60 text-sm">Member Since</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registered Subjects Section - NEW SEPARATE SECTION */}
        <div className="mt-12 animate-in fade-in duration-500 delay-400">
          <Card className="bg-black/40 border-white/20 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-400" />
                Registered Subjects
              </CardTitle>
              <CardDescription className="text-white/60">
                Your {getCurrentTerm() === 'term1' ? 'Term 1' : 'Term 2'} subjects - Level {userData.current_level} • {userData.specialization}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const currentTerm = getCurrentTerm()
                const subjects = getUserSubjects(userData.current_level, userData.specialization, currentTerm)
                
                // Get department key for URL construction
                const departmentKeyMap: { [key: string]: string } = {
                  'Computing and Data Sciences': 'computing-data-sciences',
                  'computing and data sciences': 'computing-data-sciences',
                  'Data Science': 'computing-data-sciences',
                  'data science': 'computing-data-sciences',
                  'Computing & Data Sciences': 'computing-data-sciences',
                  'FCDS': 'computing-data-sciences',
                  'Business Analytics': 'business-analytics',
                  'business analytics': 'business-analytics',
                  'BA': 'business-analytics'
                }
                const departmentKey = departmentKeyMap[userData.specialization] || departmentKeyMap[userData.specialization?.toLowerCase()] || 'computing-data-sciences'
                
                if (subjects.length === 0) {
                  return (
                    <div className="text-center py-12 text-white/60">
                      <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-bold mb-4">No subjects found for your level and department</p>
                      
                      {/* Debug Information */}
                      <div className="mt-6 p-6 bg-red-500/10 border border-red-500/30 rounded-lg text-left max-w-2xl mx-auto">
                        <p className="text-red-400 font-bold mb-3 text-center">🔍 Debug Information:</p>
                        <div className="space-y-2 text-sm">
                          <p><span className="text-white font-semibold">Level:</span> <span className="text-yellow-400">{userData.current_level}</span></p>
                          <p><span className="text-white font-semibold">Specialization:</span> <span className="text-yellow-400">&quot;{userData.specialization}&quot;</span></p>
                          <p><span className="text-white font-semibold">User ID:</span> <span className="text-yellow-400">{userData.user_id}</span></p>
                          <p className="text-xs text-white/50 mt-4 pt-4 border-t border-white/20">
                            Expected specialization values: &ldquo;Data Science&rdquo;, &ldquo;Computing and Data Sciences&rdquo;, or &ldquo;Business Analytics&rdquo;
                          </p>
                          <p className="text-xs text-white/50 mt-2">
                            Check browser console (F12) for detailed logs
                          </p>
                        </div>
                      </div>
                      
                      <p className="text-sm mt-6">Contact your administrator if this seems wrong</p>
                    </div>
                  )
                }
                
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subjects.map((subject, index) => (
                      <div 
                        key={subject.id}
                        className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group"
                        style={{ 
                          animationDelay: `${index * 75}ms`,
                          animation: 'fadeInUp 0.5s ease-out forwards',
                          opacity: 0
                        }}
                      >
                        {/* Subject Header */}
                        <div className="mb-4">
                          <h3 className="text-white font-bold text-xl mb-2 group-hover:text-purple-400 transition-colors">
                            {subject.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-white/50">{subject.code}</p>
                            <div className="flex gap-2">
                              <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold">
                                {subject.creditHours} Credits
                              </span>
                              {subject.materials.quizzes && subject.materials.quizzes.length > 0 && (
                                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                                  {subject.materials.quizzes.length} Quizzes
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Subject Description */}
                        <p className="text-sm text-white/70 mb-6 line-clamp-3 min-h-[60px]">
                          {subject.description}
                        </p>
                        
                        {/* Material Links Grid */}
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {subject.materials.lectures && subject.materials.lectures !== '' && subject.materials.lectures !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-400 transition-all"
                              >
                                <Link href={createDriveLink(subject.materials.lectures)}>
                                  <BookOpen className="w-3 h-3 mr-1" />
                                  Lectures
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.sections && subject.materials.sections !== '' && subject.materials.sections !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-blue-500/20 hover:border-blue-500/50 hover:text-blue-400 transition-all"
                              >
                                <Link href={createDriveLink(subject.materials.sections)}>
                                  <FileText className="w-3 h-3 mr-1" />
                                  Sections
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.quizzes && subject.materials.quizzes.length > 0 && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                              >
                                <Link href={`/specialization/${departmentKey}/${userData.current_level}/${subject.id}?tab=quizzes`}>
                                  <Trophy className="w-3 h-3 mr-1" />
                                  Quizzes
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.videos && (
                              (Array.isArray(subject.materials.videos) && subject.materials.videos.length > 0 && subject.materials.videos[0] !== '' && subject.materials.videos[0] !== ' ') ||
                              (typeof subject.materials.videos === 'string' && subject.materials.videos !== '' && subject.materials.videos !== ' ')
                            ) && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all"
                              >
                                <a 
                                  href={Array.isArray(subject.materials.videos) ? subject.materials.videos[0] : subject.materials.videos} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Video className="w-3 h-3 mr-1" />
                                  Videos
                                </a>
                              </Button>
                            )}
                            
                            {subject.materials.summaries && subject.materials.summaries !== '' && subject.materials.summaries !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-green-500/20 hover:border-green-500/50 hover:text-green-400 transition-all"
                              >
                                <Link href={createDriveLink(subject.materials.summaries)}>
                                  <FileText className="w-3 h-3 mr-1" />
                                  Summaries
                                </Link>
                              </Button>
                            )}
                            
                            {subject.materials.exams && subject.materials.exams !== '' && subject.materials.exams !== ' ' && (
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="bg-white/5 border-white/20 text-white hover:bg-orange-500/20 hover:border-orange-500/50 hover:text-orange-400 transition-all"
                              >
                                <Link href={createDriveLink(subject.materials.exams)}>
                                  <GraduationCap className="w-3 h-3 mr-1" />
                                  Exams
                                </Link>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Progress Visualization */}
        <ProgressDotPlot quizData={quizData} />

        {/* Danger Zone - Delete Account */}
        <div className="mt-12 animate-in fade-in duration-500 delay-500">
          <Card className="bg-gradient-to-br from-red-950/40 to-red-900/20 border-red-500/30 shadow-2xl shadow-red-500/10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-bold text-red-400 flex items-center justify-center gap-2">
                ☢️ The Nuclear Option
              </CardTitle>
              <CardDescription className="text-white/60">
                Had enough? We get it. Sort of. Not really. But we respect your choices... mostly.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-white/70 text-sm mb-4">
                  🦎 <span className="italic">"With great power comes great responsibility."</span> 
                  <span className="text-white/50"> - Some chameleon, probably</span>
                </p>
                <p className="text-white/60 text-sm">
                  Deleting your account will remove all your quiz attempts, notifications, and that sweet, 
                  sweet progress you've made. We'll give you 14 days to change your mind because we're 
                  optimists like that.
                </p>
              </div>
              
              <DeleteAccountDialog
                userId={userData.user_id}
                username={userData.username}
                quizCount={quizData.length}
                deletionScheduledAt={userData.deletion_scheduled_at}
                onDeletionScheduled={() => {
                  // Refresh the page to update the UI
                  window.location.reload()
                }}
                onDeletionCancelled={() => {
                  // Refresh the page to update the UI
                  window.location.reload()
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
