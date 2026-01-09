import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function countJsonFiles(dir: string): Promise<number> {
  let count = 0
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        // Recursively count files in subdirectories
        count += await countJsonFiles(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.json')) {
        count++
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error)
  }
  
  return count
}

export async function GET() {
  try {
    // Get the path to the public/quizzes directory
    const quizzesDir = path.join(process.cwd(), 'public', 'quizzes')
    
    // Count all JSON files recursively
    const totalQuizzes = await countJsonFiles(quizzesDir)

    return NextResponse.json(
      {
        totalQuizzes,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error) {
    console.error('Unexpected error in quiz stats API:', error)
    return NextResponse.json(
      { error: 'Internal server error', totalQuizzes: 140 }, // Fallback value
      { status: 500 }
    )
  }
}
