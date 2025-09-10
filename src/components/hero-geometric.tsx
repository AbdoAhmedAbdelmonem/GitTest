"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { memo, useMemo } from "react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

const StaticShape = memo(function StaticShape({
  className,
  width = 400,
  height = 100,
  rotate = 0,
  color = "rgba(99, 102, 241, 0.2)",
  borderColor = "rgba(255, 255, 255, 0.15)"
}: {
  className?: string
  width?: number
  height?: number
  rotate?: number
  color?: string
  borderColor?: string
}) {
  return (
    <div 
      className={cn("absolute", className)}
      style={{
        width,
        height,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div className="absolute inset-0 rounded-full" style={{
        background: color,
        border: `1px solid ${borderColor}`,
        boxShadow: '0 8px 32px 0 rgba(255,255,255,0.1)',
        backdropFilter: 'blur(2px)',
      }} />
    </div>
  )
})

export default function HeroGeometric({
  badge = "Kokonut UI",
  title1 = "Elevate Your",
  title2 = "Digital Vision",
}: {
  badge?: string
  title1?: string
  title2?: string
}) {
  const fadeUpVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3 + i * 0.15,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  }), []);

  const staticShapes = useMemo(() => (
    <>
      <StaticShape
        width={600}
        height={140}
        rotate={12}
        color="rgba(99, 102, 241, 0.25)"
        borderColor="rgba(199, 210, 254, 0.3)"
        className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
      />
      <StaticShape
        width={500}
        height={120}
        rotate={-15}
        color="rgba(244, 63, 94, 0.25)"
        borderColor="rgba(253, 164, 175, 0.3)"
        className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
      />
      <StaticShape
        width={300}
        height={80}
        rotate={-8}
        color="rgba(139, 92, 246, 0.25)"
        borderColor="rgba(196, 181, 253, 0.3)"
        className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
      />
      <StaticShape
        width={200}
        height={60}
        rotate={20}
        color="rgba(245, 158, 11, 0.25)"
        borderColor="rgba(253, 230, 138, 0.3)"
        className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
      />
      <StaticShape
        width={150}
        height={40}
        rotate={-25}
        color="rgba(6, 182, 212, 0.25)"
        borderColor="rgba(103, 232, 249, 0.3)"
        className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
      />
    </>
  ), []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-40" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, rgba(0, 0, 0, 0) 70%)'
      }} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {staticShapes}
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Image 
              src="/images/1212-removebg-preview.png" 
              alt="Kokonut UI" 
              width={20} 
              height={20}
              priority
            />
            <span className="text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="text-[65px] md:text-[120px] font-bold mb-6 md:mb-8 tracking-tight leading-tight">
              <span className="text-white">
                {title1}
              </span>
              <br />
              <span className={cn(
                "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
                pacifico.className,
              )}>
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4">
              Transforming ideas into vibrant digital experiences, adapting seamlessly like a chameleon to every challenge and vision.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}
