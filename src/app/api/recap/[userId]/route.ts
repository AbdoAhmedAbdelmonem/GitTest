import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { calculateTournamentPoints } from '@/lib/utils'
import { PERSONALIZED_TITLES, type RecapData } from '@/lib/recap-types'

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = parseInt(params.userId)
    
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('chameleons')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all quiz data for 2025
    const yearStart = new Date('2025-01-01T00:00:00.000Z')
    const yearEnd = new Date('2025-12-31T23:59:59.999Z')

    const { data: quizData, error: quizError } = await supabase
      .from('quiz_data')
      .select('*')
      .eq('user_id', userId)
      .gte('solved_at', yearStart.toISOString())
      .lte('solved_at', yearEnd.toISOString())
      .order('solved_at', { ascending: true })

    if (quizError) {
      console.error('Error fetching quiz data:', quizError)
    }

    const quizzes = quizData || []

    // Calculate statistics
    const totalQuizzes = quizzes.length
    const scores = quizzes.filter(q => q.score !== null).map(q => q.score as number)
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    
    // Count perfect scores (100%)
    const perfectScoreCount = scores.filter(s => s === 100).length
    
    // Total questions answered
    const totalQuestionsAnswered = quizzes.reduce((sum, q) => sum + (q.total_questions || 0), 0)

    // Analyze quiz modes
    const speedModeCount = quizzes.filter(q => 
      q.duration_selected === '5 minutes' || q.duration_selected === '10 minutes'
    ).length
    const traditionalModeCount = totalQuizzes - speedModeCount
    
    let favoriteMode: 'speed' | 'traditional' | 'balanced' = 'balanced'
    if (speedModeCount > traditionalModeCount * 1.5) {
      favoriteMode = 'speed'
    } else if (traditionalModeCount > speedModeCount * 1.5) {
      favoriteMode = 'traditional'
    }

    // Find most active month
    const monthCounts: Record<string, number> = {}
    const dayCounts: Record<string, number> = {}
    
    quizzes.forEach(quiz => {
      const date = new Date(quiz.solved_at)
      const monthKey = date.toLocaleString('en-US', { month: 'long' })
      const dayKey = date.toLocaleString('en-US', { weekday: 'long' })
      
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1
      dayCounts[dayKey] = (dayCounts[dayKey] || 0) + 1
    })

    const mostActiveMonth = Object.entries(monthCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data'
    
    const mostActiveDay = Object.entries(dayCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Not enough data'

    // Calculate average quiz duration
    const durations = quizzes.map(q => {
      const duration = q.duration_selected || '15 minutes'
      const minutes = parseInt(duration.split(' ')[0])
      return isNaN(minutes) ? 15 : minutes
    })
    const avgDuration = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0
    const averageQuizDuration = `${avgDuration} minutes`

    // Calculate tournament points
    const tournamentStart = new Date('2025-10-11T00:00:00.000Z')
    const tournamentEnd = new Date('2026-06-30T23:59:59.999Z')
    
    const tournamentQuizzes = quizzes.filter(q => {
      const solvedAt = new Date(q.solved_at)
      return solvedAt >= tournamentStart && 
             solvedAt <= tournamentEnd && 
             q.quiz_level === userProfile.current_level
    })

    // Track first attempt for each quiz
    const firstAttempts = new Map()
    tournamentQuizzes.forEach(quiz => {
      const existing = firstAttempts.get(quiz.quiz_id)
      if (!existing || new Date(quiz.solved_at) < new Date(existing.solved_at)) {
        firstAttempts.set(quiz.quiz_id, quiz)
      }
    })

    let tournamentPoints = 0
    firstAttempts.forEach(quiz => {
      const rawPoints = calculateTournamentPoints(
        quiz.score || 0,
        quiz.duration_selected || '15 minutes',
        quiz.answering_mode || 'traditional',
        quiz.how_finished || 'completed'
      )
      tournamentPoints += Math.round(rawPoints / 10)
    })

    // Calculate member since
    const createdAt = new Date(userProfile.created_at)
    const now = new Date()
    const daysSinceJoined = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate longest streak (consecutive days with quizzes)
    let longestStreak = 0
    let currentStreak = 0
    let lastDate: Date | null = null

    const uniqueDates = [...new Set(quizzes.map(q => 
      new Date(q.solved_at).toDateString()
    ))].sort()

    uniqueDates.forEach(dateStr => {
      const date = new Date(dateStr)
      if (lastDate) {
        const diffDays = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        if (diffDays === 1) {
          currentStreak++
        } else {
          longestStreak = Math.max(longestStreak, currentStreak)
          currentStreak = 1
        }
      } else {
        currentStreak = 1
      }
      lastDate = date
    })
    longestStreak = Math.max(longestStreak, currentStreak)

    // Determine personalized title
    let titleKey = 'knowledge-seeker'
    
    if (perfectScoreCount >= 5) {
      titleKey = 'perfectionist'
    } else if (favoriteMode === 'speed' && averageScore >= 70) {
      titleKey = 'speed-demon'
    } else if (tournamentPoints >= 500) {
      titleKey = 'tournament-warrior'
    } else if (daysSinceJoined >= 180 && totalQuizzes >= 20) {
      titleKey = 'chameleon-veteran'
    } else if (averageScore >= 85) {
      titleKey = 'quiz-champion'
    } else if (longestStreak >= 5) {
      titleKey = 'consistent-learner'
    } else if (totalQuizzes <= 10 && averageScore >= 60) {
      titleKey = 'rising-star'
    }

    const personalizedInfo = PERSONALIZED_TITLES[titleKey]

    const recapData: RecapData = {
      username: userProfile.username,
      profileImage: userProfile.profile_image,
      specialization: userProfile.specialization,
      level: userProfile.current_level,
      memberSince: createdAt.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      }),
      daysSinceJoined,
      totalQuizzes,
      bestScore,
      averageScore,
      totalQuestionsAnswered,
      tournamentRank: undefined, // TODO: Calculate actual rank
      tournamentPoints,
      favoriteMode,
      mostActiveMonth,
      mostActiveDay,
      averageQuizDuration,
      perfectScoreCount,
      personalizedTitle: personalizedInfo.title,
      personalizedMessage: personalizedInfo.message,
      longestStreak,
      quizzesThisYear: totalQuizzes
    }

    return NextResponse.json(recapData)
  } catch (error) {
    console.error('Error generating recap:', error)
    return NextResponse.json({ error: 'Failed to generate recap' }, { status: 500 })
  }
}
