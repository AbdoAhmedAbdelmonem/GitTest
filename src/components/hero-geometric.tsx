// "use client"

import { motion } from "framer-motion"
// Removed 'next/font/google' as it causes compilation issues outside of a full Next.js build environment.
// import { Pacifico } from "next/font/google"
// Replaced 'next/image' with standard 'img' tag for broader compatibility.
// import Image from "next/image"
import { cn } from "@/lib/utils"
import Image from "next/image"
function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string
  delay?: number
  width?: number
  height?: number
  rotate?: number
  gradient?: string
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={`absolute ${className}`}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        {/* Removed backdrop-blur for performance */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-r to-transparent ${gradient} border-2 border-white/[0.15] shadow-sm after:absolute after:inset-0 after:rounded-full after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]`}
        />
      </motion.div>
    </motion.div>
  )
}

export default function HeroGeometric({
  badge = "Chameleon FCDS",
  title1 = "Master Your",
  title2 = "Future Skills",
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
        {/* Using simplified ElegantShape */}
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-indigo-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-rose-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />
        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-violet-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />
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
            {/* Replaced Next.js Image component with standard <img> tag */}
            <img 
              src="/images/1212-removebg-preview.png" 
              alt="Chameleon Logo" 
              width={20} 
              height={20}
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
            {/* Removed Pacifico.className as Pacifico font import was removed */}
            <span className={cn(
              "text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300",
              // pacifico.className,
            )} style={{ fontFamily: 'Pacifico, cursive' ,fontWeight: '400' }}>
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
