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

export async function getLeaderboardData(level: 1 | 2 | 3): Promise<{
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
    const tournamentStart = new Date('2025-10-11T00:00:00.000Z') // Changed to October 11, 2025
    const tournamentEnd = new Date('2026-01-11T23:59:59.999Z') // End of January 11th
    
    console.log(`Querying level ${level} from ${tournamentStart.toISOString()} to ${tournamentEnd.toISOString()}`)

    console.log(`Tournament date range: ${tournamentStart.toISOString()} to ${tournamentEnd.toISOString()}`)
    console.log(`Looking for level ${level} quizzes with non-null scores in this date range`)
    
    // Fetch ALL data using pagination to bypass Supabase's 1000 row limit
    // This ensures we get all tournament data even if there are more than 1000 quiz entries
    let allQuizData: QuizDataEntry[] = []
    let page = 0
    const pageSize = 1000
    const maxPages = 100 // Safety limit: max 100,000 rows (increase if needed)
    let hasMore = true
    
    while (hasMore && page < maxPages) {
      const { data: pageData, error: pageError } = await supabase
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
        .range(page * pageSize, (page + 1) * pageSize - 1)
      
      if (pageError) {
        console.error(`Error fetching page ${page}:`, pageError)
        break
      }
      
      if (!pageData || pageData.length === 0) {
        hasMore = false
      } else {
        allQuizData = [...allQuizData, ...pageData]
        console.log(`Fetched page ${page + 1}: ${pageData.length} rows (total so far: ${allQuizData.length})`)
        
        if (pageData.length < pageSize) {
          hasMore = false
        }
        page++
      }
    }
    
    if (page >= maxPages) {
      console.warn(`⚠️ Reached maximum page limit (${maxPages} pages). Some data might be missing. Consider using RPC function for better performance.`)
    }
    
    const quizData = allQuizData
    console.log(`Total quiz entries fetched for level ${level}: ${quizData.length}`)

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

    // Track first attempt for each quiz per user
    const userQuizFirstAttempt = new Map<string, QuizDataEntry>()

    // First pass: identify first attempt for each quiz_id per user_id
    quizData.forEach((entry: QuizDataEntry) => {
      const key = `${entry.user_id}_${entry.quiz_id}`
      const existing = userQuizFirstAttempt.get(key)
      
      // Keep the earliest attempt (oldest solved_at timestamp)
      if (!existing || new Date(entry.solved_at) < new Date(existing.solved_at)) {
        userQuizFirstAttempt.set(key, entry)
      }
    })

    console.log(`First attempts found: ${userQuizFirstAttempt.size} unique quiz attempts`)

    // Second pass: calculate points only for first attempts
    userQuizFirstAttempt.forEach((entry: QuizDataEntry) => {
      const userId = entry.user_id
      const userProfile = userProfileMap.get(userId)
      
      // Only count quizzes where the quiz level matches the user's current level
      if (!userProfile || userProfile.current_level !== entry.quiz_level) {
        console.log(`Skipping quiz entry: user_id=${userId}, quiz_id=${entry.quiz_id}, quiz_level=${entry.quiz_level}, user_current_level=${userProfile?.current_level}, solved_at=${entry.solved_at}`)
        return // Skip this quiz entry
      }
      
      const username = userProfile?.username || `User ${userId}`
      const profile_image = userProfile?.profile_image
      const specialization = userProfile?.specialization
      
      const rawPoints = calculateTournamentPoints(
        entry.score || 0,
        entry.duration_selected || "15 minutes",
        entry.answering_mode || "traditional",
        entry.how_finished || "completed"
      )

      // Reduce points by dividing by 10 and rounding
      const points = Math.round(rawPoints / 10)

      console.log(`Adding points for ${username} (level ${userProfile.current_level}): quiz_id=${entry.quiz_id}, score=${entry.score}, duration=${entry.duration_selected}, mode=${entry.answering_mode}, finished=${entry.how_finished} => ${rawPoints} raw points / 10 = ${points} points (FIRST ATTEMPT)`)

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

async function getPublicLeaderboardData(supabase: Awaited<ReturnType<typeof createServerClient>>, level: 1 | 2 | 3): Promise<{
  leaderboard: LeaderboardEntry[]
  currentUserEntry?: LeaderboardEntry
}> {
  // Use the same date range - Updated to October 11, 2025
  const tournamentStart = new Date('2025-10-11T00:00:00.000Z')
  const tournamentEnd = new Date('2026-01-11T23:59:59.999Z')

  // Fetch ALL data using pagination
  let allQuizData: QuizDataEntry[] = []
  let page = 0
  const pageSize = 1000
  let hasMore = true
  
  while (hasMore) {
    const { data: pageData, error: pageError } = await supabase
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
      .range(page * pageSize, (page + 1) * pageSize - 1)
    
    if (pageError) {
      console.error(`Error fetching page ${page}:`, pageError)
      break
    }
    
    if (!pageData || pageData.length === 0) {
      hasMore = false
    } else {
      allQuizData = [...allQuizData, ...pageData]
      
      if (pageData.length < pageSize) {
        hasMore = false
      }
      page++
    }
  }
  
  const quizData = allQuizData

  if (!quizData || quizData.length === 0) {
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

  // Track first attempt for each quiz per user
  const userQuizFirstAttempt = new Map<string, QuizDataEntry>()

  // First pass: identify first attempt for each quiz_id per user_id
  quizData.forEach((entry: QuizDataEntry) => {
    const key = `${entry.user_id}_${entry.quiz_id}`
    const existing = userQuizFirstAttempt.get(key)
    
    // Keep the earliest attempt (oldest solved_at timestamp)
    if (!existing || new Date(entry.solved_at) < new Date(existing.solved_at)) {
      userQuizFirstAttempt.set(key, entry)
    }
  })

  // Second pass: calculate points only for first attempts
  userQuizFirstAttempt.forEach((entry: QuizDataEntry) => {
    const userId = entry.user_id
    const userProfile = userProfileMap.get(userId)
    
    // Only count quizzes where the quiz level matches the user's current level
    if (!userProfile || userProfile.current_level !== entry.quiz_level) {
      return // Skip this quiz entry
    }
    
    const username = userProfile?.username || `User ${userId}`
    const profile_image = userProfile?.profile_image
    const specialization = userProfile?.specialization
    const rawPoints = calculateTournamentPoints(
      entry.score || 0,
      entry.duration_selected || "15 minutes",
      entry.answering_mode || "traditional",
      entry.how_finished || "completed"
    )

    // Reduce points by dividing by 10 and rounding
    const points = Math.round(rawPoints / 10)

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
