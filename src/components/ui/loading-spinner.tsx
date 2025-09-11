"use client"

import { cn } from "@/lib/utils"
import React from "react"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ 
  className, 
  size = "md", 
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  }

  return (
    <div className={cn("flex items-center justify-center", className)} {...props}>
      <div
        className={cn(
          "animate-spin rounded-full border-t-transparent border-b-transparent",
          "border-l-white/70 border-r-white/30",
          "bg-transparent shadow-[0_0_15px_rgba(255,255,255,0.1)]",
          sizeClasses[size]
        )}
      />
    </div>
  )
}

// Optional animated version with gradient and glow effect
export function FancyLoadingSpinner({ 
  className, 
  size = "md", 
  ...props 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-14 h-14 border-4",
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)} {...props}>
      {/* Outer spinning circle */}
      <div
        className={cn(
          "absolute animate-spin rounded-full border-t-transparent border-purple-500/50",
          "border-r-indigo-500/50 border-b-rose-500/50 border-l-blue-500/50",
          "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
          sizeClasses[size]
        )}
      />
      
      {/* Inner spinning circle (opposite direction) */}
      <div
        className={cn(
          "absolute animate-spin-slow rounded-full border-t-pink-500/30",
          "border-r-transparent border-b-violet-500/30 border-l-transparent",
          "animate-[spin_2s_linear_infinite_reverse]",
          sizeClasses[size]
        )}
        style={{ width: `calc(${sizeClasses[size].split(' ')[0]} - 6px)`, height: `calc(${sizeClasses[size].split(' ')[1]} - 6px)` }}
      />
      
      {/* Center dot */}
      <div className={cn(
        "absolute rounded-full bg-white/10 backdrop-blur-sm",
        size === "sm" ? "w-1.5 h-1.5" : size === "md" ? "w-2.5 h-2.5" : "w-4 h-4"
      )}/>
    </div>
  )
}