"use client"

import { useEffect } from "react"
import { useNotifications } from "@/hooks/use-notifications"

interface NotificationAdderProps {
  authId: string
  title?: string
  provider?: string
  type?: string
  messageContent?: string
  seen?: string
  autoAdd?: boolean
}

export function NotificationAdder({
  authId,
  title,
  provider,
  type,
  messageContent,
  seen = "false",
  autoAdd = true
}: NotificationAdderProps) {
  const { addNotification } = useNotifications()

  useEffect(() => {
    if (autoAdd && authId) {
      const notification = {
        auth_id: authId,
        title: title || null,
        provider: provider || null,
        type: type || null,
        message_content: messageContent || null,
        seen: seen
      }

      addNotification(notification)
    }
  }, [authId, title, provider, type, messageContent, seen, autoAdd, addNotification])

  // This component doesn't render anything, it just adds notifications
  return null
}

// Hook for manual notification addition
export function useAddNotification() {
  const { addNotification } = useNotifications()

  const addCustomNotification = (
    authId: string,
    title?: string,
    provider?: string,
    type?: string,
    messageContent?: string,
    seen: string = "false"
  ) => {
    const notification = {
      auth_id: authId,
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
