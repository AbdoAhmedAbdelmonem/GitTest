'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCcw, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Standard error logging
    console.error('System Error Boundary caught error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <Card className="relative z-10 max-w-lg w-full bg-zinc-950/50 backdrop-blur-xl border-zinc-800 shadow-2xl rounded-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        <CardHeader className="text-center pt-10 pb-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-white mb-2">
            System Interruption
          </CardTitle>
          <CardDescription className="text-zinc-400 font-medium max-w-[300px] mx-auto text-sm">
            An unexpected error has occurred while processing your request. Our technical team has been notified.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-10 space-y-6">
          <div className="flex flex-col gap-3">
            <Button
              onClick={reset}
              className="w-full bg-white text-black hover:bg-zinc-200 transition-colors h-11 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Link href="/" className="w-full">
              <Button
                variant="outline"
                className="w-full border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 h-11 text-sm font-medium rounded-xl"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-zinc-900">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-400 transition-colors">
                Diagnostic Metadata
                <ChevronRight className="w-3 h-3 text-zinc-600 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800/50">
                <code className="text-[10px] font-mono text-zinc-500 leading-relaxed break-all">
                  {error.digest || error.message || 'Reference: S-INTERNAL_SYSTEM_ERR'}
                </code>
              </div>
            </details>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
