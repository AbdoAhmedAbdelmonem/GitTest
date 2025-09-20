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

export interface Notification {
  id: number
  created_at: string
  title: string | null
  user_id: number | null
  seen: string | null
  provider: string | null
  type: string | null
  message_content: string | null
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'created_at'>) => Promise<void>
  deleteNotification: (notificationId: number) => Promise<void>
  refreshNotifications: () => Promise<void>
  fetchNotificationsOnLogin: (userId: number) => Promise<void>
}
