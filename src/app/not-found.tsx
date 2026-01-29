'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Compass, Search, User, Info } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center space-y-10">
        <div className="relative inline-block">
          {/* Using opacity based on user request for simple/creative design */}
          <h1 className="text-[10rem] sm:text-[12rem] font-bold leading-none tracking-tighter text-zinc-800/30 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-xl sm:text-2xl font-light tracking-[0.3em] text-white/90 uppercase mt-8">
              Page Not Found
            </h2>
          </div>
        </div>

        <p className="text-zinc-500 text-sm max-w-sm mx-auto leading-relaxed">
          The resources you are attempting to access does not exist or has been relocated to another directory.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button
              className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 h-11 px-8 text-sm font-semibold rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto border-zinc-800 bg-zinc-900/50 text-white hover:bg-zinc-800 h-11 px-8 text-sm font-medium rounded-xl"
          >
            Go Back
          </Button>
        </div>

        {/* Directory Links - Simplified navigation */}
        <div className="pt-12 border-t border-zinc-900/50 max-w-lg mx-auto">
          <p className="text-[10px] uppercase tracking-widest text-zinc-600 mb-6 font-bold">Suggested Destinations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/explo" className="p-3 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950/30 transition-all group">
              <div className="flex items-center justify-center gap-2">
                <Compass className="w-3 h-3 text-zinc-500 group-hover:text-blue-400" />
                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200">Explo</span>
              </div>
            </Link>
            <Link href="/Tournment" className="p-3 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950/30 transition-all group">
              <div className="flex items-center justify-center gap-2">
                <Search className="w-3 h-3 text-zinc-500 group-hover:text-blue-400" />
                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200">Tournament</span>
              </div>
            </Link>
            <Link href="/profile" className="p-3 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950/30 transition-all group">
              <div className="flex items-center justify-center gap-2">
                <User className="w-3 h-3 text-zinc-500 group-hover:text-blue-400" />
                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200">Profile</span>
              </div>
            </Link>
            <Link href="/about" className="p-3 rounded-xl border border-zinc-900 hover:border-zinc-800 bg-zinc-950/30 transition-all group">
              <div className="flex items-center justify-center gap-2">
                <Info className="w-3 h-3 text-zinc-500 group-hover:text-blue-400" />
                <span className="text-[11px] text-zinc-400 group-hover:text-zinc-200">About</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
