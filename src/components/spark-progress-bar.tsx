"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface SparkProgressBarProps {
  progress: number
  className?: string
  color?: string
  showSparks?: boolean
}

export default function SparkProgressBar({
  progress,
  className,
  color = "#0066cc",
  showSparks = true,
}: SparkProgressBarProps) {
  const sparkPositions = [20, 40, 60, 80]

  return (
    <div className={cn("relative w-full h-3 bg-white/10 rounded-full overflow-hidden", className)}>
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full opacity-30 blur-sm" style={{ backgroundColor: color }} />

      {/* Progress bar */}
      <motion.div
        className="h-full rounded-full relative overflow-hidden"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            repeatDelay: 1,
          }}
        />
      </motion.div>

      {/* Floating sparks */}
      {showSparks &&
        sparkPositions.map(
          (position, index) =>
            progress >= position && (
              <motion.div
                key={index}
                className="absolute top-1/2 -translate-y-1/2"
                style={{ left: `${position}%` }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  y: [-10, -20, -10],
                }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
              </motion.div>
            ),
        )}

      {/* Progress indicator */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-lg"
        style={{
          left: `${progress}%`,
          backgroundColor: color,
          transform: `translateX(-50%) translateY(-50%)`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
    </div>
  )
}
