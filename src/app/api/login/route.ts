import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import bcrypt from 'bcryptjs'

// In-memory storage for login attempts (per IP address)
// In production, this should be replaced with a proper database or Redis
interface LoginAttempt {
  attempts: number
  lastAttempt: number
  lockoutUntil: number | null
}

const loginAttempts = new Map<string, LoginAttempt>()

const MAX_ATTEMPTS = 3
const LOCKOUT_DURATION = 15 * 60 * 1000 // 15 minutes in milliseconds

function getClientIP(request: NextRequest): string {
  // Get IP from various headers (in order of preference)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const clientIP = request.headers.get('x-client-ip')

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIP) return realIP
  if (clientIP) return clientIP

  // Fallback to a default IP for development
  return '127.0.0.1'
}

function getLoginAttempt(ip: string): LoginAttempt {
  if (!loginAttempts.has(ip)) {
    loginAttempts.set(ip, {
      attempts: 0,
      lastAttempt: Date.now(),
      lockoutUntil: null
    })
  }
  return loginAttempts.get(ip)!
}

function recordFailedAttempt(ip: string) {
  const attempt = getLoginAttempt(ip)
  attempt.attempts += 1
  attempt.lastAttempt = Date.now()

  if (attempt.attempts >= MAX_ATTEMPTS) {
    attempt.lockoutUntil = Date.now() + LOCKOUT_DURATION
  }
}

function recordSuccessfulLogin(ip: string) {
  const attempt = getLoginAttempt(ip)
  attempt.attempts = 0
  attempt.lockoutUntil = null
}

function isLockedOut(ip: string): boolean {
  const attempt = getLoginAttempt(ip)
  if (attempt.lockoutUntil && Date.now() < attempt.lockoutUntil) {
    return true
  }
  return false
}

function getRemainingLockoutTime(ip: string): number {
  const attempt = getLoginAttempt(ip)
  if (attempt.lockoutUntil) {
    const remaining = attempt.lockoutUntil - Date.now()
    return Math.max(0, remaining)
  }
  return 0
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, password } = await request.json()

    if (!studentId || !password) {
      return NextResponse.json(
        { error: 'Student ID and password are required' },
        { status: 400 }
      )
    }

    const clientIP = getClientIP(request)

    // Check if IP is currently locked out
    if (isLockedOut(clientIP)) {
      const remainingTime = Math.ceil(getRemainingLockoutTime(clientIP) / 1000 / 60) // minutes
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Please try again in ${remainingTime} minutes or login with a Google account.`,
          lockoutRemaining: remainingTime
        },
        { status: 429 }
      )
    }

    // Create Supabase client
    const supabase = await createServerSupabaseClient()

    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('chameleons')
      .select('*')
      .eq('user_id', Number.parseInt(studentId))
      .single()

    if (userError || !userData) {
      recordFailedAttempt(clientIP)
      return NextResponse.json(
        { error: 'Invalid student ID or password' },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.pass)

    if (!isPasswordValid) {
      recordFailedAttempt(clientIP)
      return NextResponse.json(
        { error: 'Invalid student ID or password' },
        { status: 401 }
      )
    }

    // Check if account is banned
    if (userData.is_banned) {
      return NextResponse.json(
        { error: 'Your account has been banned. Please contact support.' },
        { status: 403 }
      )
    }

    // Successful login - reset attempts
    recordSuccessfulLogin(clientIP)

    // Return user data (excluding password)
    const sessionData = {
      user_id: userData.user_id,
      username: userData.username,
      phone_number: userData.phone_number,
      specialization: userData.specialization,
      age: userData.age,
      current_level: userData.current_level,
      is_admin: userData.is_admin,
      is_banned: userData.is_banned,
      created_at: userData.created_at,
      email: userData.email,
      profile_image: userData.profile_image,
    }

    return NextResponse.json({ user: sessionData })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    )
  }
}