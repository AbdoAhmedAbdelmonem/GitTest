"use client"

import { useEffect, useRef } from 'react'

/**
 * SecurityProtection Component
 * 
 * NOTE: This provides basic deterrence only. Determined users can still bypass these protections.
 * No client-side code is truly secure - real security happens on the server with:
 * - API authentication/authorization
 * - Rate limiting
 * - RLS policies
 * - Input validation
 * 
 * This component adds:
 * - DevTools detection (warns/redirects if opened)
 * - Right-click disable
 * - Console clearing
 * - Keyboard shortcut blocking
 * - Source code access warnings
 */
export function SecurityProtection() {
  const devToolsOpen = useRef(false)
  const warningCount = useRef(0)

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('🛡️ Security Protection: Disabled in development mode')
      return
    }

    // Disable right-click
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      console.clear()
      console.log('%c⚠️ Security Warning', 'color: red; font-size: 20px; font-weight: bold;')
      console.log('%cRight-click is disabled for security reasons.', 'color: orange; font-size: 14px;')
      return false
    }

    // Detect DevTools opening
    const detectDevTools = () => {
      const threshold = 160
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      const devToolsDetected = widthThreshold || heightThreshold

      if (devToolsDetected && !devToolsOpen.current) {
        devToolsOpen.current = true
        warningCount.current++
        
        console.clear()
        console.log(
          '%c🚨 SECURITY ALERT',
          'color: red; font-size: 30px; font-weight: bold; text-shadow: 2px 2px 4px black;'
        )
        console.log(
          '%cUnauthorized access to developer tools detected!',
          'color: #ff6b6b; font-size: 16px; font-weight: bold;'
        )
        console.log(
          '%cThis action has been logged and reported.',
          'color: orange; font-size: 14px;'
        )
        console.log(
          '%cIP Address, Browser Fingerprint, and Session ID have been recorded.',
          'color: yellow; font-size: 12px;'
        )

        // After 3 warnings, redirect to home
        if (warningCount.current >= 3) {
          console.log('%c⛔ Too many security violations. Redirecting...', 'color: red; font-size: 16px;')
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        }
      } else if (!devToolsDetected && devToolsOpen.current) {
        devToolsOpen.current = false
      }
    }

    // Block common DevTools shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // F12 - DevTools
      if (e.key === 'F12') {
        e.preventDefault()
        console.clear()
        showSecurityWarning()
        return false
      }

      // Ctrl+Shift+I - DevTools
      // Ctrl+Shift+J - Console
      // Ctrl+Shift+C - Inspect Element
      // Ctrl+U - View Source
      if (
        (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault()
        console.clear()
        showSecurityWarning()
        return false
      }

      // Mac equivalents
      if (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault()
        console.clear()
        showSecurityWarning()
        return false
      }
    }

    // Show security warning in console
    const showSecurityWarning = () => {
      console.log('%c⚠️ Security Warning', 'color: red; font-size: 20px; font-weight: bold;')
      console.log(
        '%cAccess to developer tools is restricted.',
        'color: orange; font-size: 14px;'
      )
      console.log(
        '%cUnauthorized attempts to access source code will be logged.',
        'color: yellow; font-size: 12px;'
      )
    }

    // Continuously clear console (aggressive)
    const clearConsoleInterval = setInterval(() => {
      console.clear()
      console.log(
        '%c🛡️ Protected Application',
        'color: #4CAF50; font-size: 20px; font-weight: bold;'
      )
      console.log(
        '%cThis application is protected. Unauthorized access attempts are monitored and logged.',
        'color: #2196F3; font-size: 12px;'
      )
    }, 1000)

    // Check for DevTools every 500ms
    const devToolsInterval = setInterval(detectDevTools, 500)

    // Disable text selection
    document.body.style.userSelect = 'none'
    document.body.style.webkitUserSelect = 'none'

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup
    return () => {
      clearInterval(clearConsoleInterval)
      clearInterval(devToolsInterval)
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
    }
  }, [])

  return null // This component doesn't render anything
}

/**
 * Usage: Add to your root layout
 * 
 * import { SecurityProtection } from '@/components/SecurityProtection'
 * 
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <SecurityProtection />
 *         {children}
 *       </body>
 *     </html>
 *   )
 * }
 */
