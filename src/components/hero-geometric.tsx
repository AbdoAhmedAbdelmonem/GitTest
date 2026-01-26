"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
})

export default function HeroGeometric({
  badge = "Chameleon FCDS",
  title1 = "Master Your",
  title2 = "Future Skills",
}: {
  badge?: string
  title1?: string
  title2?: string
}) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUpVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }), []);

  const animationSettings = prefersReducedMotion ? { animate: "visible" } : { initial: "hidden", animate: "visible" };

  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]"
      style={{
        backgroundImage: 'url("/images/main.png")', // Replace with your image path
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 opacity-40" style={{
        background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.3) 0%, rgba(0, 0, 0, 0) 70%)'
      }} />

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 md:mb-12"
          >
            <Image 
              src="/images/1212-removebg-preview.png" 
              alt="Kokonut UI" 
              width={20} 
              height={20}
              priority
              loading="eager"
              unoptimized={true} // Only if it's a small static image
            />
            <span className="text-sm text-white/60 tracking-wide">{badge}</span>
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} {...animationSettings} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}>
            <h1 className="text-[65px] md:text-[120px] font-bold mb-6 md:mb-8 tracking-tight leading-tight" style={{ fontFamily: 'var(--font-outfit), sans-serif',fontWeight:'bold'}}>
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

          <motion.div custom={2} variants={fadeUpVariants} {...animationSettings} transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}>
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
