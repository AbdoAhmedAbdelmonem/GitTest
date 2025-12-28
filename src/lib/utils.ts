import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Point calculation system for tournament leaderboard based on the image
// Score rewards more questions: base percentage + bonus for question count
export function calculateTournamentPoints(
  scorePercentage: number, // Percentage score (0-100)
  chosenDuration: string,
  quizMode: string,
  howFinished: string,
  totalQuestions: number = 10 // Default to 10 if not provided
): number {
  // Calculate user score: percentage as base + bonus for more questions
  // e.g., 80% on 20 questions = 80 + 20 = 100 points
  // e.g., 80% on 10 questions = 80 + 10 = 90 points
  // This rewards users who attempt quizzes with more questions
  const userScore = scorePercentage + totalQuestions

  // Duration points based on image
  const durationPoints: { [key: string]: number } = {
    "1": 50,        // 1 minute -> +50 Point
    "5": 45,        // 5 minutes -> +45 Point
    "15": 40,       // 15 minutes -> +40 point
    "30": 35,       // 30 minutes -> +35 point
    "60": 30,       // 60 minutes -> +30 point
    "unlimited": 25,// Unlimited -> +25 point
    "1 min": 50,
    "5 min": 45,
    "15 min": 40,
    "30 min": 35,
    "60 min": 30
  };

  // Mode bonus points based on image
  const modePoints: { [key: string]: number } = {
    "instance": 15,     // Instance mode -> +15
    "instant": 15,      // Alternative spelling
    "traditional": 12   // Traditional mode -> +12
  };

  // Completion points based on image
  const completionPoints: { [key: string]: number } = {
    "completed": 20,    // Completed -> +20 point
    "complete": 20,     // Alternative spelling
    "timed out": 15,    // Timed out -> +15 point
    "timeout": 15,      // Alternative spelling
    "timedout": 15      // Alternative spelling
  };

  // Normalize input strings
  const normalizedDuration = chosenDuration.toLowerCase().trim()
  const normalizedMode = quizMode.toLowerCase().trim()
  const normalizedFinished = howFinished.toLowerCase().trim()

  // Get points from each category with fallbacks
  const durationPoint = durationPoints[normalizedDuration] || 
                       durationPoints[normalizedDuration.replace("minutes", "min").replace("minute", "min")] || 
                       40 // Default to 15 minutes (40 points)

  const modePoint = modePoints[normalizedMode] || 12 // Default to traditional (12 points)

  const completionPoint = completionPoints[normalizedFinished] || 15 // Default to timed out (15 points)

  console.log(`Calculating points: score=${scorePercentage}%, totalQuestions=${totalQuestions}, userScore=${userScore}, duration=${normalizedDuration}(${durationPoint}), mode=${normalizedMode}(${modePoint}), finished=${normalizedFinished}(${completionPoint})`)

  // Calculate total points: userScore (based on questions) + duration + mode + completion
  const totalPoints = userScore + durationPoint + modePoint + completionPoint

  console.log(`Total points: ${totalPoints}`)

  return Math.max(totalPoints, 0) // Ensure non-negative points
}

// Alternative function if you want to use multipliers instead of fixed additions
export function calculateTournamentPointsWithMultipliers(
  score: number,
  chosenDuration: string,
  quizMode: string,
  howFinished: string
): number {
  // Base multiplier for score
  let baseMultiplier = 1.0

  // Duration multipliers (shorter duration = higher multiplier)
  const durationMultipliers: { [key: string]: number } = {
    "1": 2.0,        // 1 minute - highest multiplier
    "5": 1.8,        // 5 minutes
    "15": 1.5,       // 15 minutes
    "30": 1.3,       // 30 minutes
    "60": 1.1,       // 60 minutes
    "unlimited": 1.0,// Unlimited - lowest multiplier
    "1 minutes": 2.0,
    "5 minutes": 1.8,
    "15 minutes": 1.5,
    "30 minutes": 1.3,
    "60 minutes": 1.1
  }

  // Mode multipliers (instance mode = higher multiplier)
  const modeMultipliers: { [key: string]: number } = {
    "instance": 1.2,     // Instance mode bonus
    "instant": 1.2,      // Alternative spelling
    "traditional": 1.0   // Traditional mode
  }

  // Completion multipliers (in-progress = higher multiplier)
  const completionMultipliers: { [key: string]: number } = {
    "in-progress": 1.2,    // In-progress bonus
    "timed-out": 1.0      // timed-out - no bonus
  }

  // Normalize input strings
  const normalizedDuration = chosenDuration.toLowerCase().trim()
  const normalizedMode = quizMode.toLowerCase().trim()
  const normalizedFinished = howFinished.toLowerCase().trim()

  // Get multipliers
  const durationMultiplier = durationMultipliers[normalizedDuration] || 
                            durationMultipliers[normalizedDuration.replace("minutes", "min").replace("minute", "min")] || 
                            1.5 // Default to 15 minutes

  const modeMultiplier = modeMultipliers[normalizedMode] || 1.0 // Default to traditional

  const completionMultiplier = completionMultipliers[normalizedFinished] || 1.0 // Default to timed out

  // Calculate final points with multipliers
  const finalPoints = Math.round(score * durationMultiplier * modeMultiplier * completionMultiplier)

  return Math.max(finalPoints, 0)
}

// Helper function to format points for display
export function formatPoints(points: number): string {
  return points.toLocaleString()
}

// Helper function to get rank badge based on position
export function getRankBadge(position: number): string {
  if (position === 1) return "🥇"
  if (position === 2) return "🥈"
  if (position === 3) return "🥉"
  if (position <= 10) return "⭐"
  return "🔹"
}

// Helper function to calculate percentage correct
export function calculatePercentage(score: number, totalQuestions: number): number {
  if (totalQuestions === 0) return 0
  return Math.round((score / totalQuestions) * 100)
}
