"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  AlertCircle, 
  ExternalLink, 
  CheckCircle,
  Loader2,
  User,
  Key,
  RefreshCw
} from "lucide-react"
import { motion } from "framer-motion"

interface AdminAuthGuardProps {
  userSession: any
  onAuthStatusChange?: (hasAuth: boolean) => void
  children: React.ReactNode
}

export function AdminAuthGuard({ userSession, onAuthStatusChange, children }: AdminAuthGuardProps) {
  const [authStatus, setAuthStatus] = useState<'checking' | 'authenticated' | 'needs-auth'>('checking')
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkAuthStatus = async () => {
    if (!userSession?.user_id) {
      setAuthStatus('needs-auth')
      return
    }

    try {
      const response = await fetch(`/api/google-drive/check-access?userId=${userSession.user_id}`)
      const result = await response.json()

      if (response.ok) {
        // Admin user has their own Google Drive tokens
        if (result.hasAccess && result.isAdmin) {
          setAuthStatus('authenticated')
          onAuthStatusChange?.(true)
        } else {
          setAuthStatus('needs-auth')
          onAuthStatusChange?.(false)
        }
      } else {
        setAuthStatus('needs-auth')
        onAuthStatusChange?.(false)
      }
    } catch (err) {
      console.error('Error checking auth status:', err)
      setAuthStatus('needs-auth')
      onAuthStatusChange?.(false)
    }
  }

  useEffect(() => {
    checkAuthStatus()
  }, [userSession?.user_id])

  const handleAuthenticate = async () => {
    if (!userSession?.user_id) {
      setError('No user session found')
      return
    }

    setIsAuthenticating(true)
    setError(null)

    try {
      const response = await fetch('/api/google-drive/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userSession.user_id,
          isAdmin: true
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate auth URL')
      }

      // Redirect to Google OAuth
      window.location.href = result.data.authUrl
    } catch (err) {
      console.error('Authentication error:', err)
      setError(err instanceof Error ? err.message : 'Failed to authenticate')
      setIsAuthenticating(false)
    }
  }

  // Show loading while checking
  if (authStatus === 'checking') {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-white/60">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Checking authentication status...</span>
        </div>
      </div>
    )
  }

  // Show auth requirement if user needs to authenticate
  if (authStatus === 'needs-auth') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Authentication Required
                </Badge>
              </div>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center"
              >
                <Key className="w-8 h-8 text-white" />
              </motion.div>

              <CardTitle className="text-xl font-semibold text-white mb-2">
                Connect Your Google Drive
              </CardTitle>
              
              <p className="text-white/60 text-sm">
                As an admin, you need to authenticate with your own Google account to upload and manage files.
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* User Info */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-white/80">Admin User:</span>
                  <span className="text-white font-medium">
                    {userSession?.full_name || userSession?.name || 'Unknown'}
                  </span>
                </div>
                {userSession?.email && (
                  <div className="text-xs text-white/60 mt-1 ml-6">
                    {userSession.email}
                  </div>
                )}
              </div>

              {/* Authentication Info */}
              <Alert className="bg-amber-500/10 border-amber-500/20">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                <AlertDescription className="text-amber-300 text-sm">
                  <strong>Individual Authentication Required</strong>
                  <br />
                  Each admin must authenticate with their own Google account. Files you upload will be owned by your Google account, ensuring proper ownership and permissions.
                </AlertDescription>
              </Alert>

              {error && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Authentication Steps */}
              <div className="space-y-2 text-sm text-white/60">
                <p className="font-medium text-white/80">What happens next:</p>
                <div className="space-y-1 ml-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full" />
                    <span>Redirect to Google authentication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full" />
                    <span>Sign in with your Google account</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full" />
                    <span>Grant Google Drive permissions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-amber-400 rounded-full" />
                    <span>Return with full admin access</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleAuthenticate}
                  disabled={isAuthenticating}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 h-12"
                >
                  {isAuthenticating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting to Google...
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect Google Drive
                    </>
                  )}
                </Button>

                <Button
                  onClick={checkAuthStatus}
                  variant="outline"
                  className="w-full bg-transparent border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Check Status
                </Button>
              </div>

              {/* Security Note */}
              <div className="text-xs text-white/40 text-center">
                <Shield className="w-3 h-3 inline mr-1" />
                Your authentication is secure and individual to your account
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // User is authenticated, show the children
  return <>{children}</>
}