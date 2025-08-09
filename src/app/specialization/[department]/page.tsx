"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, GraduationCap } from "lucide-react"
import { departmentData } from "@/lib/department-data"
import { cn } from "@/lib/utils"

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
        duration: 1.2,
        delay: delay * 0.3,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 0.6 },
      }}
      className={cn("absolute", className)}
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
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]",
          )}
        />
      </motion.div>
    </motion.div>
  )
}

interface Props {
  params: { department: string }
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      delay: 0.5 + i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.8 + i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

export default function DepartmentPage({ params }: Props) {
  const dept = departmentData[params.department]

  if (!dept) {
    notFound()
  }

  const levels = ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  const levelColors = [
    "from-emerald-500/[0.15]",
    "from-blue-500/[0.15]",
    "from-purple-500/[0.15]",
    "from-orange-500/[0.15]",
  ]

  return (
    <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Elegant Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={450}
          height={110}
          rotate={8}
          gradient="from-indigo-500/[0.15]"
          className="left-[-8%] top-[20%]"
        />
        <ElegantShape
          delay={0.5}
          width={350}
          height={90}
          rotate={-12}
          gradient="from-rose-500/[0.15]"
          className="right-[-3%] top-[65%]"
        />
        <ElegantShape
          delay={0.4}
          width={200}
          height={60}
          rotate={-5}
          gradient="from-violet-500/[0.15]"
          className="left-[8%] bottom-[8%]"
        />
        <ElegantShape
          delay={0.6}
          width={160}
          height={45}
          rotate={18}
          gradient="from-amber-500/[0.15]"
          className="right-[18%] top-[12%]"
        />
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Link href="/specialization">
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Specializations
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-16">
            <motion.h1
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">{dept.name}</span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              {dept.description}
            </motion.p>

            <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
              <Badge
                variant="outline"
                className="text-lg px-4 py-2 bg-white/[0.03] border-white/[0.15] text-white/70 backdrop-blur-sm"
              >
                Choose Your Academic Level
              </Badge>
            </motion.div>
          </div>

          {/* Level Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {levels.map((level, index) => (
              <motion.div key={level} custom={index} variants={cardVariants} initial="hidden" animate="visible">
                <Link href={`/specialization/${params.department}/${index + 1}`}>
                  <Card className="h-full bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-500 group cursor-pointer backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
                          "bg-gradient-to-r to-transparent border-2 border-white/[0.15]",
                          "backdrop-blur-[2px] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                          levelColors[index],
                        )}
                      >
                        <GraduationCap className="w-8 h-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                        {level}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-white/60 group-hover:text-white/70 transition-colors mb-4">
                        Access {level.toLowerCase()} curriculum and study materials
                      </p>
                      <Badge variant="outline" className="bg-white/[0.03] border-white/[0.1] text-white/60">
                        {dept.levels[index + 1]?.subjects.term1.length +
                          dept.levels[index + 1]?.subjects.term2.length || 0}{" "}
                        Subjects
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}
