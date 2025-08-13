"use client"

import { motion } from "framer-motion"
import { Pacifico } from "next/font/google"
import Image from "next/image"
import { cn } from "@/lib/utils"

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-pacifico",
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
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2 + i * 0.1,
        ease: "easeOut",
      },
    }),
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030303]">
      {/* Optimized background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Using simple CSS shapes instead of complex components */}
        <div className="absolute left-[-10%] md:left-[-5%] top-[15%] md:top-[20%] w-[600px] h-[140px] rotate-12 opacity-20 rounded-full bg-indigo-500/10 border border-indigo-300/10"></div>
        <div className="absolute right-[-5%] md:right-[0%] top-[70%] md:top-[75%] w-[500px] h-[120px] -rotate-15 opacity-20 rounded-full bg-rose-500/10 border border-rose-300/10"></div>
        <div className="absolute left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%] w-[300px] h-[80px] -rotate-8 opacity-20 rounded-full bg-violet-500/10 border border-violet-300/10"></div>
      </div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-rose-500/5"></div>

      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
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

          <motion.h1 
            custom={1} 
            initial="hidden" 
            animate="visible" 
            variants={fadeUpVariants}
            className="text-[65px] md:text-[120px] font-bold mb-6 md:mb-8 tracking-tight leading-tight"
          >
            <span className="text-white">{title1}</span>
            <br />
            <span className={cn(
              "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
              pacifico.className,
            )}>
              {title2}
            </span>
          </motion.h1>

          <motion.p 
            custom={2} 
            initial="hidden" 
            animate="visible" 
            variants={fadeUpVariants}
            className="text-base sm:text-lg md:text-xl text-white/40 mb-8 leading-relaxed font-light tracking-wide max-w-xl mx-auto px-4"
          >
            Transforming ideas into vibrant digital experiences, adapting seamlessly like a chameleon to every challenge and vision.
          </motion.p>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent pointer-events-none"></div>
    </div>
  )
}
