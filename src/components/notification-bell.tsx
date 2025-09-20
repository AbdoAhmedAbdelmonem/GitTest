"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/hooks/use-notifications"
import { NotificationDropdown } from "./notification-dropdown"

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { unreadCount } = useNotifications()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const closeDropdown = useCallback(() => {
    setIsOpen(false)
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Focus management
  useEffect(() => {
    if (!isOpen && buttonRef.current) {
      buttonRef.current.focus()
    }
  }, [isOpen])

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={toggleDropdown}
        className="relative text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 focus:ring-2 focus:ring-white/20"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600 animate-pulse"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      <NotificationDropdown
        isOpen={isOpen}
        onClose={closeDropdown}
      />
    </div>
  )
}
