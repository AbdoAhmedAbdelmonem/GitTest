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
        { error: "User ID is required. Can't cancel what doesn't exist!" },
        { status: 400 }
      )
    }

    // Clear the deletion scheduled date
    const { data, error } = await supabaseAdmin
      .from("chameleons")
      .update({ 
        deletion_scheduled_at: null 
      })
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error cancelling deletion:", error)
      return NextResponse.json(
        { error: "Failed to cancel deletion. The database is confused." },
        { status: 500 }
      )
    }

    // Add a "welcome back" notification (with sarcasm, of course)
    await supabaseAdmin
      .from("Notifications")
      .insert({
        user_id: userId,
        title: "Welcome Back! 🎉",
        provider: "System",
        type: "success",
        message_content: "We knew you couldn't stay away! Your account deletion has been cancelled. All your data is safe and sound (and secretly happy to see you again).",
        seen: "false"
      })

    return NextResponse.json({
      success: true,
      message: "Deletion cancelled! We knew you'd come back! 💚"
    })
  } catch (error) {
    console.error("Error in cancel deletion:", error)
    return NextResponse.json(
      { error: "Something went wrong trying to keep you. Ironic, isn't it?" },
      { status: 500 }
    )
  }
}
