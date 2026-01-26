import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("🔍 Debugging Tournament Data via API...\n")

  try {
    const supabase = await createServerClient()

    // Check current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    console.log("Current user:", user?.id)

    let userProfile = null
    if (user) {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("chameleons")
        .select("*")
        .eq("user_id", user.id)
        .single()

      userProfile = profile
      console.log("User profile:", profile)
      console.log("User current_level:", profile?.current_level)
    }

    // Check all quiz data
    const { data: allQuizData, error: allError } = await supabase
      .from("quiz_data")
      .select("*")
      .order("solved_at", { ascending: false })
      .limit(20)

    console.log("\n📊 Recent Quiz Data:")
    console.log("Total quiz entries:", allQuizData?.length || 0)

    if (allQuizData) {
      allQuizData.forEach((entry, index) => {
        console.log(`${index + 1}. User: ${entry.user_id}, Level: ${entry.quiz_level}, Score: ${entry.score}, Solved: ${entry.solved_at}`)
      })
    }

    // Check quiz data with scores
    const { data: quizWithScores, error: scoreError } = await supabase
      .from("quiz_data")
      .select("*")
      .not("score", "is", null)
      .order("solved_at", { ascending: false })
      .limit(10)

    console.log("\n✅ Quiz Data with Scores:")
    console.log("Entries with scores:", quizWithScores?.length || 0)

    if (quizWithScores) {
      quizWithScores.forEach((entry, index) => {
        console.log(`${index + 1}. User: ${entry.user_id}, Level: ${entry.quiz_level}, Score: ${entry.score}, Solved: ${entry.solved_at}`)
      })
    }

    // Tournament date range
    const tournamentStart = new Date('2025-10-12T00:00:00.000Z')
    const tournamentEnd = new Date('2026-01-11T23:59:59.999Z')

    console.log(`\n🏆 Tournament Range: ${tournamentStart.toISOString()} to ${tournamentEnd.toISOString()}`)

    // Check quiz data in tournament range
    const { data: tournamentQuizData, error: tournamentError } = await supabase
      .from("quiz_data")
      .select("*")
      .not("score", "is", null)
      .gte("solved_at", tournamentStart.toISOString())
      .lte("solved_at", tournamentEnd.toISOString())
      .order("solved_at", { ascending: false })

    console.log("\n🎯 Quiz Data in Tournament Range:")
    console.log("Entries in range:", tournamentQuizData?.length || 0)

    if (tournamentQuizData) {
      tournamentQuizData.forEach((entry, index) => {
        console.log(`${index + 1}. User: ${entry.user_id}, Level: ${entry.quiz_level}, Score: ${entry.score}, Solved: ${entry.solved_at}`)
      })
    }

    // Return the data for debugging
    return NextResponse.json({
      user: userProfile,
      totalQuizEntries: allQuizData?.length || 0,
      quizWithScores: quizWithScores?.length || 0,
      tournamentRangeEntries: tournamentQuizData?.length || 0,
      recentQuizzes: allQuizData?.slice(0, 5),
      tournamentQuizzes: tournamentQuizData?.slice(0, 5)
    })

  } catch (error) {
    console.error("Error in debug API:", error)
    return NextResponse.json({ error: "Debug failed" }, { status: 500 })
  }
}
