// Updated type definitions for the new database structure
export interface StudentUser {
  auth_id: string // UUID from auth.users - Primary identifier
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
}

// Admin-specific data (from admins table)
export interface AdminData {
  admin_id: number
  auth_id: string
  google_id?: string
  google_email?: string
  access_token?: string
  refresh_token?: string
  token_expiry?: string
  authorized: boolean
  created_at: string
  updated_at: string
}

// Combined user with admin info (for admin endpoints)
export interface UserWithAdminInfo extends StudentUser {
  adminData?: AdminData
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

// Helper function to check if user is an authorized admin
export function isAuthorizedAdmin(user: StudentUser | null): boolean {
  return user?.is_admin === true && !user?.is_banned
}

// Helper function to get admin data from localStorage
export function getAdminData(): AdminData | null {
  if (typeof window === "undefined") return null

  const adminDataStr = localStorage.getItem("admin_data")
  if (!adminDataStr) return null

  try {
    return JSON.parse(adminDataStr)
  } catch {
    return null
  }
}

// Helper function to set admin data in localStorage
export function setAdminData(adminData: AdminData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_data", JSON.stringify(adminData))
  }
}

// Helper function to clear admin data
export function clearAdminData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_data")
  }
}

// Helper to check if admin has Google Drive authorization
export function hasGoogleDriveAccess(): boolean {
  const user = getStudentSession()
  const adminData = getAdminData()
  
  return (
    user?.is_admin === true &&
    !user?.is_banned &&
    adminData?.authorized === true &&
    !!adminData?.access_token
  )
}
