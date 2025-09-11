export interface User {
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

export interface Quiz {
  id: number
  title: string
  description: string
  questions: QuizQuestion[]
  max_score: number
  created_at: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
}

export interface QuizAttempt {
  id: number
  user_id: number
  phone_number: string
  quiz_id: number
  score: number
  created_at: string
}
