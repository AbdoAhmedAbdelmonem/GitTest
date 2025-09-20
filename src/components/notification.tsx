"use client"

import { useEffect } from "react"
import { useNotifications } from "@/hooks/use-notifications"

interface NotificationAdderProps {
  userId: number
  title?: string
  provider?: string
  type?: string
  messageContent?: string
  seen?: string
  autoAdd?: boolean
}

export function NotificationAdder({
  userId,
  title,
  provider,
  type,
  messageContent,
  seen = "false",
  autoAdd = true
}: NotificationAdderProps) {
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (autoAdd && userId) {
      const notification = {
        user_id: userId,
        title: title || null,
        provider: provider || null,
        type: type || null,
        message_content: messageContent || null,
        seen: seen
      }

      addNotification(notification)
    }
  }, [userId, title, provider, type, messageContent, seen, autoAdd, addNotification])

  // This component doesn't render anything, it just adds notifications
  return null
}

// Hook for manual notification addition
export function useAddNotification() {
  const { addNotification } = useNotifications()

  const addCustomNotification = (
    userId: number,
    title?: string,
    provider?: string,
    type?: string,
    messageContent?: string,
    seen: string = "false"
  ) => {
    const notification = {
      user_id: userId,
      title: title || null,
      provider: provider || null,
      type: type || null,
      message_content: messageContent || null,
      seen: seen
    }

    return addNotification(notification)
  }

  return addCustomNotification
}
