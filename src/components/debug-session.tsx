"use client"

import { useState, useEffect } from 'react'
import { getStudentSession } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DebugSession() {
  const [session, setSession] = useState<any>(null)
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    const sessionData = getStudentSession()
    setSession(sessionData)
  }, [])

  if (!showDebug) {
    return (
      <Button 
        onClick={() => setShowDebug(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      >
        Show Debug
      </Button>
    )
  }

  return (
    <Card className="fixed top-4 right-4 z-50 bg-gray-900 border-gray-700 max-w-md">
      <CardHeader>
        <CardTitle className="text-white flex justify-between items-center">
          Session Debug
          <Button 
            onClick={() => setShowDebug(false)}
            variant="ghost"
            size="sm"
            className="text-white"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="text-xs text-white/80 whitespace-pre-wrap overflow-auto max-h-64">
          {JSON.stringify(session, null, 2)}
        </pre>
        <div className="mt-4 text-sm">
          <div className="text-green-400">
            is_admin: {session?.is_admin ? 'true' : 'false'}
          </div>
          <div className="text-blue-400">
            Authorized: {session?.Authorized ? 'true' : 'false'}
          </div>
          <div className="text-purple-400">
            Admin Status: {session?.is_admin && session?.Authorized ? 'ADMIN' : 'NOT ADMIN'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}