import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verify cron secret for security
const CRON_SECRET = process.env.CRON_SECRET

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional but recommended)
    const authHeader = request.headers.get("authorization")
    if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
      console.log("Unauthorized cron request attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    console.log(`🗑️ Processing account deletions at ${now.toISOString()}`)

    // Find all accounts where deletion is due
    const { data: accountsToDelete, error: fetchError } = await supabaseAdmin
      .from("chameleons")
      .select("user_id, username, email")
      .not("deletion_scheduled_at", "is", null)
      .lte("deletion_scheduled_at", now.toISOString())

    if (fetchError) {
      console.error("Error fetching accounts to delete:", fetchError)
      return NextResponse.json(
        { error: "Failed to fetch accounts for deletion" },
        { status: 500 }
      )
    }

    if (!accountsToDelete || accountsToDelete.length === 0) {
      console.log("No accounts to delete today. Everyone's staying! 🎉")
      return NextResponse.json({
        success: true,
        message: "No accounts to delete",
        deletedCount: 0
      })
    }

    console.log(`Found ${accountsToDelete.length} accounts to delete`)

    const results = {
      processed: 0,
      failed: 0,
      details: [] as { userId: number; username: string; status: string }[]
    }

    // Process each account deletion
    for (const account of accountsToDelete) {
      try {
        console.log(`\n💀 Processing deletion for user ${account.user_id} (${account.username})`)

        // Step 1: Delete notifications
        console.log("  📣 Deleting notifications...")
        const { error: notifError, count: notifCount } = await supabaseAdmin
          .from("Notifications")
          .delete()
          .eq("user_id", account.user_id)

        if (notifError) {
          console.error(`  ❌ Failed to delete notifications:`, notifError)
        } else {
          console.log(`  ✅ Deleted notifications`)
        }

        // Step 2: Delete quiz data
        console.log("  📝 Deleting quiz data...")
        const { error: quizError, count: quizCount } = await supabaseAdmin
          .from("quiz_data")
          .delete()
          .eq("user_id", account.user_id)

        if (quizError) {
          console.error(`  ❌ Failed to delete quiz data:`, quizError)
        } else {
          console.log(`  ✅ Deleted quiz data`)
        }

        // Step 3: Delete the chameleon account
        console.log("  🦎 Deleting chameleon account...")
        const { error: accountError } = await supabaseAdmin
          .from("chameleons")
          .delete()
          .eq("user_id", account.user_id)

        if (accountError) {
          console.error(`  ❌ Failed to delete account:`, accountError)
          results.failed++
          results.details.push({
            userId: account.user_id,
            username: account.username,
            status: `Failed: ${accountError.message}`
          })
        } else {
          console.log(`  ✅ Account deleted successfully`)
          results.processed++
          results.details.push({
            userId: account.user_id,
            username: account.username,
            status: "Deleted successfully. Goodbye! 👋"
          })
        }

      } catch (error) {
        console.error(`Error processing deletion for user ${account.user_id}:`, error)
        results.failed++
        results.details.push({
          userId: account.user_id,
          username: account.username,
          status: `Error: ${error}`
        })
      }
    }

    console.log(`\n🏁 Deletion processing complete:`)
    console.log(`   ✅ Successfully deleted: ${results.processed}`)
    console.log(`   ❌ Failed: ${results.failed}`)

    return NextResponse.json({
      success: true,
      message: `Processed ${results.processed} deletions, ${results.failed} failures`,
      ...results
    })
  } catch (error) {
    console.error("Error in process deletions cron:", error)
    return NextResponse.json(
      { 
        error: "Failed to process deletions. The reaper is on vacation.",
        details: String(error)
      },
      { status: 500 }
    )
  }
}

// Also allow POST for manual triggering (with auth)
export async function POST(request: NextRequest) {
  return GET(request)
}
