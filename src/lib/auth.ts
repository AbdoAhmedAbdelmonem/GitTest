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
    localStorage.clear()
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
