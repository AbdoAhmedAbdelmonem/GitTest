"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Notification, NotificationContextType } from '@/lib/types'
import { getStudentSession } from '@/lib/auth'

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const user = getStudentSession()

  const fetchNotifications = useCallback(async () => {
    if (!user?.user_id) return

    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('Notifications')
        .select('*')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications:', error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.user_id, supabase])

  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('Notifications')
        .update({ seen: 'true' })
        .eq('id', notificationId)

      if (error) {
        console.error('Error marking notification as read:', error)
        return
      }

      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, seen: 'true' }
            : notif
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [supabase])

  const markAllAsRead = useCallback(async () => {
    if (!user?.user_id) return

    try {
      const { error } = await supabase
        .from('Notifications')
        .update({ seen: 'true' })
        .eq('user_id', user.user_id)
        .eq('seen', 'false')

      if (error) {
        console.error('Error marking all notifications as read:', error)
        return
      }

      setNotifications(prev =>
        prev.map(notif => ({ ...notif, seen: 'true' }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [user?.user_id, supabase])

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('Notifications')
        .insert([notification])
        .select()
        .single()

      if (error) {
        console.error('Error adding notification:', error)
        return
      }

      if (data) {
        setNotifications(prev => [data, ...prev])
      }
    } catch (error) {
      console.error('Error adding notification:', error)
    }
  }, [supabase])

  const deleteNotification = useCallback(async (notificationId: number) => {
    try {
      const { error } = await supabase
        .from('Notifications')
        .delete()
        .eq('id', notificationId)

      if (error) {
        console.error('Error deleting notification:', error)
        return
      }

      setNotifications(prev =>
        prev.filter(notif => notif.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }, [supabase])

  const refreshNotifications = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  // Force fetch notifications (used after login)
  const fetchNotificationsOnLogin = useCallback(async (userId: number) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('Notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching notifications on login:', error)
        return
      }

      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications on login:', error)
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    if (user?.user_id) {
      fetchNotifications()
    }
  }, [user?.user_id, fetchNotifications])

  // Listen for login events to fetch notifications
  useEffect(() => {
    const handleUserLogin = (event: CustomEvent) => {
      const { userId } = event.detail
      if (userId && userId === user?.user_id) {
        // User has logged in, fetch their notifications
        fetchNotificationsOnLogin(userId)
      }
    }

    window.addEventListener('userLoggedIn', handleUserLogin as EventListener)

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLogin as EventListener)
    }
  }, [user?.user_id, fetchNotificationsOnLogin])

  // Memoize unread count calculation
  const unreadCount = useMemo(() =>
    notifications.filter(n => n.seen !== 'true').length,
    [notifications]
  )

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    refreshNotifications,
    fetchNotificationsOnLogin,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}