"use server"

import { createServerClient } from "@/lib/supabase/server"
import { calculateTournamentPoints } from "@/lib/utils"

export interface LeaderboardEntry {
  id: number
  name: string
  points: number
  profile_image?: string
  specialization?: string
  isCurrentUser?: boolean
}

interface QuizDataEntry {
  quiz_id: number
  user_id: number
  score: number | null
  quiz_level: number
  duration_selected: string | null
  answering_mode: string | null
  how_finished: string | null
  total_questions: number | null
  solved_at: string
}

export async function getLeaderboardData(level: 1 | 2): Promise<{
  leaderboard: LeaderboardEntry[]
  currentUserEntry?: LeaderboardEntry
}> {
  try {
    const supabase = await createServerClient()

    // Get current user from Supabase auth
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    let currentUserId: number | null = null
    let currentUsername: string | null = null

    if (!authError && user) {
      // Get user profile from chameleons table
      const { data: userProfile, error: profileError } = await supabase
        .from("chameleons")
        .select("user_id, username, profile_image")
        .eq("user_id", user.id)
        .single()

      if (!profileError && userProfile) {
        currentUserId = userProfile.user_id
        currentUsername = userProfile.username
      }
    }

    // DEBUG: Log the date range we're querying
    const tournamentStart = new Date('2025-10-11T00:00:00.000Z')
    const tournamentEnd = new Date('2026-01-11T23:59:59.999Z') // End of January 11th
    
    console.log(`Querying level ${level} from ${tournamentStart.toISOString()} to ${tournamentEnd.toISOString()}`)

    // First, let's check what quiz data exists without filters
    const { data: allQuizData, error: allError } = await supabase
      .from("quiz_data")
      .select(`
        quiz_id,
        user_id,
        score,
        quiz_level,
        duration_selected,
        answering_mode,
        how_finished,
        total_questions,
        solved_at
      `)
      .order("solved_at", { ascending: false })

    if (allError) {
      console.error("Error fetching all quiz data:", allError)
    } else if (allQuizData) {
      console.log(`Total quiz entries found: ${allQuizData.length}`)
      // Log recent entries to see dates
      allQuizData.slice(0, 5).forEach((entry: QuizDataEntry) => {
        console.log(`Quiz: level=${entry.quiz_level}, solved_at=${entry.solved_at}, user_id=${entry.user_id}`)
      })
    }

    // Now query with our filters
    const { data: quizData, error } = await supabase
      .from("quiz_data")
      .select(`
        quiz_id,
        user_id,
        score,
        quiz_level,
        duration_selected,
        answering_mode,
        how_finished,
        total_questions,
        solved_at
      `)
      .eq("quiz_level", level)
      .not("score", "is", null)
      .gte("solved_at", tournamentStart.toISOString())
      .lte("solved_at", tournamentEnd.toISOString())
      .order("solved_at", { ascending: false })

    if (error) {
      console.error("Error fetching filtered quiz data:", error)
      return { leaderboard: [] }
    }

    console.log(`Filtered quiz entries for level ${level}: ${quizData?.length || 0}`)

    if (!quizData || quizData.length === 0) {
      console.log("No quiz data found for the specified date range and level")
      return { leaderboard: [] }
    }

    // Log the found entries for debugging
    quizData.forEach((entry: QuizDataEntry) => {
      console.log(`Found: user_id=${entry.user_id}, level=${entry.quiz_level}, solved=${entry.solved_at}, score=${entry.score}`)
    })

    // Get unique user IDs from quiz data
    const userIds = [...new Set(quizData.map(entry => entry.user_id))]

    // Fetch user profiles for all users in the quiz data
    const { data: userProfiles, error: userError } = await supabase
      .from("chameleons")
      .select("user_id, username, profile_image, current_level, specialization")
      .in("user_id", userIds)

    // Create a map of user_id to user profile
    const userProfileMap = new Map<number, { username: string; profile_image?: string; current_level: number; specialization?: string }>()
    if (userProfiles) {
      userProfiles.forEach(profile => {
        userProfileMap.set(profile.user_id, {
          username: profile.username,
          profile_image: profile.profile_image,
          current_level: profile.current_level,
          specialization: profile.specialization
        })
      })
    }

    // Group by user and calculate total points from all quizzes
    const userTotalScores = new Map<number, {
      userId: number
      username: string
      profile_image?: string
      specialization?: string
      totalPoints: number
      quizCount: number
    }>()

    quizData.forEach((entry: QuizDataEntry) => {
      const userId = entry.user_id
      const userProfile = userProfileMap.get(userId)
      
      // Only count quizzes where the quiz level matches the user's current level
      if (!userProfile || userProfile.current_level !== entry.quiz_level) {
        return // Skip this quiz entry
      }
      
      const username = userProfile?.username || `User ${userId}`
      const profile_image = userProfile?.profile_image
      const specialization = userProfile?.specialization
      
      const points = calculateTournamentPoints(
        entry.score || 0,
        entry.duration_selected || "15 minutes",
        entry.answering_mode || "traditional",
        entry.how_finished || "completed"
      )

      console.log(`Adding points for ${username} (level ${userProfile.current_level}): score=${entry.score}, duration=${entry.duration_selected}, mode=${entry.answering_mode}, finished=${entry.how_finished} => ${points} points`)

      if (!userTotalScores.has(userId)) {
        userTotalScores.set(userId, {
          userId,
          username,
          profile_image,
          specialization,
          totalPoints: points,
          quizCount: 1
        })
      } else {
        const existing = userTotalScores.get(userId)!
        existing.totalPoints += points
        existing.quizCount += 1
      }
    })

    console.log(`Processed ${userTotalScores.size} unique users for level ${level}`)

    // Convert to array and sort by total points descending
    const sortedUsers = Array.from(userTotalScores.values())
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 10)
      .map((user) => ({
        id: user.userId,
        name: user.username,
        profile_image: user.profile_image,
        specialization: user.specialization,
        points: user.totalPoints,
        isCurrentUser: user.userId === currentUserId
      }))

    // Find current user entry if not in top 10
    let currentUserEntry: LeaderboardEntry | undefined
    if (currentUserId && currentUsername && !sortedUsers.some(u => u.isCurrentUser)) {
      const currentUserData = userTotalScores.get(currentUserId)
      if (currentUserData) {
        currentUserEntry = {
          id: currentUserData.userId,
          name: currentUserData.username,
          profile_image: currentUserData.profile_image,
          specialization: currentUserData.specialization,
          points: currentUserData.totalPoints,
          isCurrentUser: true
        }
      }
    }

    return {
      leaderboard: sortedUsers,
      currentUserEntry
    }
  } catch (error) {
    console.error("Error in getLeaderboardData:", error)
    return { leaderboard: [] }
  }
}

async function getPublicLeaderboardData(supabase: Awaited<ReturnType<typeof createServerClient>>, level: 1 | 2): Promise<{
  leaderboard: LeaderboardEntry[]
  currentUserEntry?: LeaderboardEntry
}> {
  // Use the same date range
  const tournamentStart = new Date('2025-10-11T00:00:00.000Z')
  const tournamentEnd = new Date('2026-01-11T23:59:59.999Z')

  const { data: quizData, error } = await supabase
    .from("quiz_data")
    .select(`
      quiz_id,
      user_id,
      score,
      quiz_level,
      duration_selected,
      answering_mode,
      how_finished,
      total_questions,
      solved_at
    `)
    .eq("quiz_level", level)
    .not("score", "is", null)
    .gte("solved_at", tournamentStart.toISOString())
    .lte("solved_at", tournamentEnd.toISOString())
    .order("solved_at", { ascending: false })

  if (error || !quizData) {
    return { leaderboard: [] }
  }

  // Get unique user IDs from quiz data
  const userIds = [...new Set(quizData.map(entry => entry.user_id))]

  // Fetch user profiles for all users in the quiz data
  const { data: userProfiles } = await supabase
    .from("chameleons")
    .select("user_id, username, profile_image, current_level, specialization")
    .in("user_id", userIds)

  // Create a map of user_id to user profile
  const userProfileMap = new Map<number, { username: string; profile_image?: string; current_level: number; specialization?: string }>()
  if (userProfiles) {
    userProfiles.forEach(profile => {
      userProfileMap.set(profile.user_id, {
        username: profile.username,
        profile_image: profile.profile_image,
        current_level: profile.current_level,
        specialization: profile.specialization
      })
    })
  }

  // Group by user and calculate total points from all quizzes
  const userTotalScores = new Map<number, {
    userId: number
    username: string
    profile_image?: string
    specialization?: string
    totalPoints: number
  }>()

  quizData.forEach((entry: QuizDataEntry) => {
    const userId = entry.user_id
    const userProfile = userProfileMap.get(userId)
    
    // Only count quizzes where the quiz level matches the user's current level
    if (!userProfile || userProfile.current_level !== entry.quiz_level) {
      return // Skip this quiz entry
    }
    
    const username = userProfile?.username || `User ${userId}`
    const profile_image = userProfile?.profile_image
    const specialization = userProfile?.specialization
    const points = calculateTournamentPoints(
      entry.score || 0,
      entry.duration_selected || "15 minutes",
      entry.answering_mode || "traditional",
      entry.how_finished || "completed"
    )

    if (!userTotalScores.has(userId)) {
      userTotalScores.set(userId, {
        userId,
        username,
        profile_image,
        specialization,
        totalPoints: points
      })
    } else {
      const existing = userTotalScores.get(userId)!
      existing.totalPoints += points
    }
  })

  // Convert to array and sort by total points descending
  const sortedUsers = Array.from(userTotalScores.values())
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10)
    .map((user) => ({
      id: user.userId,
      name: user.username,
      profile_image: user.profile_image,
      specialization: user.specialization,
      points: user.totalPoints,
      isCurrentUser: false
    }))

  return {
    leaderboard: sortedUsers
  }
}

