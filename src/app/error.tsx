'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, RefreshCcw, Home, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('System Error caught by boundary:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Sophisticated Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-slate-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      <Card className="relative z-10 max-w-lg w-full bg-black/40 backdrop-blur-2xl border-white/5 shadow-[0_0_50px_-12px_rgba(255,255,255,0.05)] rounded-2xl overflow-hidden border-t-white/10">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        <CardHeader className="text-center pt-12 pb-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-6 shadow-inner ring-1 ring-white/10">
            <AlertCircle className="w-8 h-8 text-red-400/80 stroke-[1.5px]" />
          </div>
          <CardTitle className="text-2xl font-light tracking-tight text-white mb-2">
            System Interruption
          </CardTitle>
          <CardDescription className="text-slate-400 font-medium leading-relaxed max-w-[280px] mx-auto">
            A serious error occurred while processing your request. Our systems have logged this event.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-8 pb-12 space-y-8">
          <div className="space-y-3">
            <Button
              onClick={() => reset()}
              className="w-full bg-white text-black hover:bg-slate-200 transition-all duration-300 h-12 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 group"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
              Attempt Reconstruction
            </Button>
            
            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full border-white/5 bg-white/[0.02] text-white hover:bg-white/[0.05] transition-all duration-300 h-12 text-sm font-medium rounded-xl border-t-white/10"
              >
                <Home className="w-4 h-4 mr-2 opacity-60" />
                Return to Safety
              </Button>
            </Link>
          </div>

          <div className="pt-6 border-t border-white/[0.03]">
            <details className="group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
                  Diagnostic Metadata
                </span>
                <ChevronRight className="w-3 h-3 text-slate-600 group-open:rotate-90 transition-transform duration-300" />
              </summary>
              <div className="mt-4 p-4 rounded-lg bg-black/40 border border-white/5 animate-in fade-in slide-in-from-top-2 duration-300">
                <code className="text-[11px] font-mono text-red-300/60 leading-relaxed break-all">
                  {error.digest || error.message || 'Reference: S-INTERNAL_FAILURE'}
                </code>
                <p className="mt-3 text-[10px] text-slate-600 leading-tight">
                  This identifier unique to your session assists our technical team in resolution.
                </p>
              </div>
            </details>
          </div>
        </CardContent>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </Card>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </div>
  )
}
