"use client"

import { useState } from 'react'
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
  Key
} from "lucide-react"
import { motion } from "framer-motion"

interface GoogleDriveAuthRequiredProps {
  userSession: any
  isAdmin: boolean
  onAuthComplete?: () => void
}

export function GoogleDriveAuthRequired({ userSession, isAdmin, onAuthComplete }: GoogleDriveAuthRequiredProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAuthenticate = async () => {
    if (!userSession?.auth_id) {
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
          authId: userSession.auth_id,
          isAdmin: isAdmin
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

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white/[0.02] border-white/10 backdrop-blur-xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isAdmin && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin Access
                </Badge>
              )}
            </div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
            >
              <Key className="w-8 h-8 text-white" />
            </motion.div>

            <CardTitle className="text-xl font-semibold text-white mb-2">
              Google Drive Authentication Required
            </CardTitle>
            
            <p className="text-white/60 text-sm">
              {isAdmin 
                ? "As an admin, you need to connect your own Google Drive account to upload and manage files."
                : "You need to connect your Google Drive account to access files."
              }
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Info */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-blue-400" />
                <span className="text-white/80">Signed in as:</span>
                <span className="text-white font-medium">
                  {userSession?.full_name || userSession?.name || 'User'}
                </span>
              </div>
              {userSession?.email && (
                <div className="text-xs text-white/60 mt-1 ml-6">
                  {userSession.email}
                </div>
              )}
            </div>

            {/* Authentication Info */}
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <AlertCircle className="h-4 w-4 text-blue-400" />
              <AlertDescription className="text-blue-300 text-sm">
                <strong>Individual Authentication Required</strong>
                <br />
                {isAdmin 
                  ? "Each admin must authenticate with their own Google account. Files you upload will be owned by your Google account, not shared accounts."
                  : "You need to authenticate with your Google account to access drive files."
                }
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
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span>You'll be redirected to Google</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span>Sign in with your Google account</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span>Grant Google Drive permissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full" />
                  <span>Return to the drive interface</span>
                </div>
              </div>
            </div>

            {/* Authentication Button */}
            <Button
              onClick={handleAuthenticate}
              disabled={isAuthenticating}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 h-12"
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