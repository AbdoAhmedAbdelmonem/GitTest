import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required. Can't delete a ghost!" },
        { status: 400 }
      )
    }

    // Calculate deletion date (14 days from now)
    const deletionDate = new Date()
    deletionDate.setDate(deletionDate.getDate() + 14)

    // Update user with scheduled deletion date
    const { data, error } = await supabaseAdmin
      .from("chameleons")
      .update({ 
        deletion_scheduled_at: deletionDate.toISOString() 
      })
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error scheduling deletion:", error)
      return NextResponse.json(
        { error: "Failed to schedule deletion. The database is playing hard to get." },
        { status: 500 }
      )
    }

    // Add a farewell notification (because we're dramatic like that)
    await supabaseAdmin
      .from("Notifications")
      .insert({
        user_id: userId,
        title: "Account Deletion Scheduled 💔",
        provider: "System",
        type: "warning",
        message_content: `Your account is scheduled for deletion on ${deletionDate.toLocaleDateString()}. We'll miss you! (You can cancel this anytime in the next 14 days if you change your mind.)`,
        seen: "false"
      })

    return NextResponse.json({
      success: true,
      message: "Deletion scheduled. The countdown begins... 💀",
      deletionDate: deletionDate.toISOString(),
      daysRemaining: 14
    })
  } catch (error) {
    console.error("Error in schedule deletion:", error)
    return NextResponse.json(
      { error: "Something went wrong. Even our servers are sad about this." },
      { status: 500 }
    )
  }
}
