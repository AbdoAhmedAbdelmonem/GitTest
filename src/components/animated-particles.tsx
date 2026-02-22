// [PERF] Optimized: reduced particle cap (100→60), pauses loop when tab is hidden, throttled mousemove via rAF
"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  color: string
}

export default function AnimatedParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animationFrameRef = useRef<number>()
  const mouseMoveScheduled = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const colors = [
      "rgba(139, 92, 246, 0.6)",  // purple
      "rgba(236, 72, 153, 0.6)",  // pink
      "rgba(59, 130, 246, 0.6)",  // blue
      "rgba(16, 185, 129, 0.5)",  // emerald
      "rgba(245, 158, 11, 0.5)", // amber
    ]

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createParticles = () => {
      // Reduced cap from 100 → 60 for lower CPU usage
      const particleCount = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 20000))
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.2,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    const drawParticle = (particle: Particle) => {
      if (!ctx) return

      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = particle.color.replace(/[\d.]+\)$/, `${particle.opacity})`)
      ctx.fill()

      // Add glow effect
      ctx.shadowBlur = 15
      ctx.shadowColor = particle.color
      ctx.fill()
      ctx.shadowBlur = 0
    }

    const connectParticles = () => {
      if (!ctx) return

      const particles = particlesRef.current
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15
            ctx.beginPath()
            ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      if (!ctx || !canvas) return

      // Pause animation when tab is hidden to save CPU
      if (document.hidden) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle) => {
        // Move particle
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Mouse interaction - subtle attraction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 200) {
          const force = (200 - distance) / 200
          particle.speedX += (dx / distance) * force * 0.02
          particle.speedY += (dy / distance) * force * 0.02
        }

        // Apply friction
        particle.speedX *= 0.99
        particle.speedY *= 0.99

        // Boundary check with wrap-around
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Subtle opacity pulsing
        particle.opacity = 0.3 + Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.2

        drawParticle(particle)
      })

      connectParticles()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Throttled mouse-move via rAF flag to prevent hundreds of calls/sec
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseMoveScheduled.current) {
        mouseMoveScheduled.current = true
        requestAnimationFrame(() => {
          mouseRef.current = { x: e.clientX, y: e.clientY }
          mouseMoveScheduled.current = false
        })
      }
    }

    const handleResize = () => {
      resizeCanvas()
      createParticles()
    }

    resizeCanvas()
    createParticles()
    animate()

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: "transparent" }}
    />
  )
}
