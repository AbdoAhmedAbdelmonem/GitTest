"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface ScrollAnimatedSectionProps {
  children: ReactNode
  className?: string
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideInFromLeft"
    | "slideInFromRight"
    | "slideInFromBottom"
    | "scaleIn"
    | "rotateIn"
  delay?: number
  duration?: number
}

const animationVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  },
  slideDown: {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0 },
  },
  slideInFromLeft: {
    hidden: { opacity: 0, x: -100 },
    visible: { opacity: 1, x: 0 },
  },
  slideInFromRight: {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
  },
  slideInFromBottom: {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    hidden: { opacity: 0, rotate: -180, scale: 0.5 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
}

export default function ScrollAnimatedSection({
  children,
  className = "",
  animation = "fadeIn",
  delay = 0,
  duration = 0.8,
}: ScrollAnimatedSectionProps) {
  const variants = animationVariants[animation]

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: false, // This allows animations to reverse when scrolling back up
        margin: "-100px", // Trigger animation when element is 100px from viewport
      }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1], // Custom easing for smooth animations
      }}
    >
      {children}
    </motion.div>
  )
}
