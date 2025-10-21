import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Use service role to bypass RLS and get ALL users
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Fetch ALL users by paginating (Supabase default limit is 1000)
    let allUsers: { current_level: number | null }[] = []
    let from = 0
    const pageSize = 1000
    let hasMore = true

    while (hasMore) {
      const { data, error } = await supabase
        .from('chameleons')
        .select('current_level')
        .range(from, from + pageSize - 1)

      if (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json(
          { error: 'Failed to fetch user statistics' },
          { status: 500 }
        )
      }

      if (data && data.length > 0) {
        allUsers = allUsers.concat(data)
        from += pageSize
        hasMore = data.length === pageSize
      } else {
        hasMore = false
      }
    }

    const totalUsers = allUsers.length

    // Calculate level statistics - handle NULL and undefined
    const levelStats: Record<number, number> = {}
    
    allUsers?.forEach((user) => {
      // Handle NULL, undefined, or use the actual value
      const level = user.current_level ?? 0  // Use nullish coalescing
      levelStats[level] = (levelStats[level] || 0) + 1
    })

    // Sort levels and create array
    const levels = Object.entries(levelStats)
      .map(([level, count]) => ({
        level: parseInt(level),
        count,
      }))
      .sort((a, b) => a.level - b.level)

    // Verify totals match
    const sumOfLevels = levels.reduce((sum, l) => sum + l.count, 0)
    
    console.log('Total users:', totalUsers)
    console.log('Sum of levels:', sumOfLevels)
    console.log('Level breakdown:', levels)

    return NextResponse.json(
      {
        totalUsers,
        levels,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  } catch (error) {
    console.error('Unexpected error in user stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
