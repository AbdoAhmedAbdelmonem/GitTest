export interface StudentUser {
  user_id: number
  username: string
  phone_number: string
  specialization: string
  age: number
  current_level: number
  is_admin: boolean
  is_banned: boolean
  created_at: string
  profile_image?: string
  email?: string
  Authorized?: boolean // Google Drive authorization status
}

export function getStudentSession(): StudentUser | null {
  if (typeof window === "undefined") return null

  const session = localStorage.getItem("student_session")
  if (!session) return null

  try {
    return JSON.parse(session)
  } catch {
    return null
  }
}

export function clearStudentSession(): void {
  if (typeof window !== "undefined") {
    // Clear all localStorage
    localStorage.clear()
    
    // Clear all sessionStorage
    sessionStorage.clear()
    
    // Clear all cookies by setting them to expire
    document.cookie.split(";").forEach((c) => {
      const eqPos = c.indexOf("=")
      const name = eqPos > -1 ? c.substr(0, eqPos) : c
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
      document.cookie = `${name.trim()}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`
    })
    
    // Clear Supabase session
    import('@/lib/supabase/client').then(({ createBrowserClient }) => {
      const supabase = createBrowserClient()
      supabase.auth.signOut({ scope: 'global' })
    })
  }
}

export function isAuthenticated(): boolean {
  return getStudentSession() !== null
}

export function setStudentSession(user: StudentUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("student_session", JSON.stringify(user))
  }
}
