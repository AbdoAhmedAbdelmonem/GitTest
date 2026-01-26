/**
 * API Route: Compute User Tournament Score
 * 
 * This endpoint calculates the tournament score for a specific user by:
 * 1. Fetching all their quiz attempts for a specific level during the tournament period
 * 2. Calculating points using the tournament scoring system
 * 3. Returning detailed breakdown of their performance
 */

import { createServerClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { calculateTournamentPoints } from "@/lib/utils"

// Tournament Configuration
const TOURNAMENT_START = new Date('2025-10-11T00:00:00.000Z')
const TOURNAMENT_END = new Date('2026-06-30T23:59:59.999Z')

interface QuizDataEntry {
  quiz_id: number
  auth_id: string
  score: number | null
  quiz_level: number
  duration_selected: string | null
  answering_mode: string | null
  how_finished: string | null
  total_questions: number | null
  solved_at: string
}

interface QuizBreakdown {
  quizId: number
  date: string
  score: number
  totalQuestions: number | null
  duration: string
  mode: string
  status: string
  rawPoints: number
  finalPoints: number
  isLevelMismatch: boolean
  isSkipped: boolean
  quizLevel: number
}

interface TournamentScoreResponse {
  success: boolean
  user?: {
    authId: string
    username: string
    profileImage?: string
    currentLevel: number
    specialization?: string
  }
  summary?: {
    totalAttempts: number
    uniqueQuizzes: number
    validQuizzes: number
    excludedLevelMismatch: number
    totalPoints: number
    averagePoints: number
    averageScore: number
  }
  quizBreakdown?: QuizBreakdown[]
  tournamentInfo?: {
    startDate: string
    endDate: string
    quizLevel: number
  }
  error?: string
}

export async function POST(request: NextRequest): Promise<NextResponse<TournamentScoreResponse>> {
  try {
    const { authId, quizLevel } = await request.json()

    if (!authId || !quizLevel) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: authId and quizLevel"
      }, { status: 400 })
    }

    const level = parseInt(quizLevel)
    if (![1, 2, 3].includes(level)) {
      return NextResponse.json({
        success: false,
        error: "Invalid quiz level. Must be 1, 2, or 3"
      }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Fetch user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('chameleons')
      .select('auth_id, username, profile_image, current_level, specialization')
      .eq('auth_id', authId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({
        success: false,
        error: `User not found: ${profileError?.message || 'No profile found'}`
      }, { status: 404 })
    }

    // Fetch ALL quiz attempts for this user (not just selected level)
    // This allows us to show quizzes from other levels as "skipped"
    const { data: quizData, error: quizError } = await supabase
      .from('quiz_data')
      .select(`
        quiz_id,
        auth_id,
        score,
        quiz_level,
        duration_selected,
        answering_mode,
        how_finished,
        total_questions,
        solved_at
      `)
      .eq('auth_id', authId)
      .not('score', 'is', null)
      .gte('solved_at', TOURNAMENT_START.toISOString())
      .lte('solved_at', TOURNAMENT_END.toISOString())
      .order('solved_at', { ascending: true })

    if (quizError) {
      return NextResponse.json({
        success: false,
        error: `Error fetching quiz data: ${quizError.message}`
      }, { status: 500 })
    }

    // Track first attempts only
    const firstAttempts = new Map<number, QuizDataEntry>()
    
    quizData?.forEach((entry: QuizDataEntry) => {
      const existing = firstAttempts.get(entry.quiz_id)
      
      // Keep the earliest attempt
      if (!existing || new Date(entry.solved_at) < new Date(existing.solved_at)) {
        firstAttempts.set(entry.quiz_id, entry)
      }
    })

    // Process quiz breakdown
    const quizBreakdown: QuizBreakdown[] = []
    let totalPoints = 0
    let validQuizCount = 0
    let totalScore = 0
    let skippedCount = 0

    // Check if user's current level matches the queried level
    // This determines if quizzes would count toward their tournament score
    const userLevelMatchesQuery = userProfile.current_level === level

    firstAttempts.forEach((entry) => {
      // Check if this quiz's level matches the QUERIED level
      const quizLevelMatchesQuery = entry.quiz_level === level
      
      // A quiz is skipped if it's not from the queried level
      const isSkipped = !quizLevelMatchesQuery
      
      // For tournament scoring, also check if user's current level matches
      const isLevelMismatch = !userLevelMatchesQuery && quizLevelMatchesQuery

      if (isSkipped) {
        // Quiz from a different level - show as skipped
        skippedCount++
        quizBreakdown.push({
          quizId: entry.quiz_id,
          date: new Date(entry.solved_at).toLocaleDateString(),
          score: entry.score || 0,
          totalQuestions: entry.total_questions,
          duration: entry.duration_selected || 'N/A',
          mode: entry.answering_mode || 'N/A',
          status: entry.how_finished || 'N/A',
          rawPoints: 0,
          finalPoints: 0,
          isLevelMismatch: false,
          isSkipped: true,
          quizLevel: entry.quiz_level
        })
        return
      }

      if (isLevelMismatch) {
        // Quiz matches queried level but user's current level doesn't match
        const rawPoints = calculateTournamentPoints(
          entry.score || 0,
          entry.duration_selected || '15 minutes',
          entry.answering_mode || 'traditional',
          entry.how_finished || 'completed',
          entry.total_questions || 10
        )
        const finalPoints = Math.round(rawPoints / 10)

        quizBreakdown.push({
          quizId: entry.quiz_id,
          date: new Date(entry.solved_at).toLocaleDateString(),
          score: entry.score || 0,
          totalQuestions: entry.total_questions,
          duration: entry.duration_selected || 'N/A',
          mode: entry.answering_mode || 'N/A',
          status: entry.how_finished || 'N/A',
          rawPoints,
          finalPoints,
          isLevelMismatch: true,
          isSkipped: false,
          quizLevel: entry.quiz_level
        })
        return
      }

      // Valid quiz - matches queried level and user's current level
      const rawPoints = calculateTournamentPoints(
        entry.score || 0,
        entry.duration_selected || '15 minutes',
        entry.answering_mode || 'traditional',
        entry.how_finished || 'completed',
        entry.total_questions || 10
      )

      const finalPoints = Math.round(rawPoints / 10)
      totalPoints += finalPoints
      validQuizCount++
      totalScore += entry.score || 0

      quizBreakdown.push({
        quizId: entry.quiz_id,
        date: new Date(entry.solved_at).toLocaleDateString(),
        score: entry.score || 0,
        totalQuestions: entry.total_questions,
        duration: entry.duration_selected || 'N/A',
        mode: entry.answering_mode || 'N/A',
        status: entry.how_finished || 'N/A',
        rawPoints,
        finalPoints,
        isLevelMismatch: false,
        isSkipped: false,
        quizLevel: entry.quiz_level
      })
    })


    // Sort by quiz ID
    quizBreakdown.sort((a, b) => a.quizId - b.quizId)

    return NextResponse.json({
      success: true,
      user: {
        authId: userProfile.auth_id,
        username: userProfile.username,
        profileImage: userProfile.profile_image,
        currentLevel: userProfile.current_level,
        specialization: userProfile.specialization
      },
      summary: {
        totalAttempts: quizData?.length || 0,
        uniqueQuizzes: firstAttempts.size,
        validQuizzes: validQuizCount,
        excludedLevelMismatch: firstAttempts.size - validQuizCount,
        totalPoints,
        averagePoints: validQuizCount > 0 ? Math.round(totalPoints / validQuizCount) : 0,
        averageScore: validQuizCount > 0 ? Math.round((totalScore / validQuizCount) * 10) / 10 : 0
      },
      quizBreakdown,
      tournamentInfo: {
        startDate: TOURNAMENT_START.toLocaleDateString(),
        endDate: TOURNAMENT_END.toLocaleDateString(),
        quizLevel: level
      }
    })

  } catch (error) {
    console.error("Error computing tournament score:", error)
    return NextResponse.json({
      success: false,
      error: "An unexpected error occurred"
    }, { status: 500 })
  }
}

