"use client"

import { use } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, FileText, Video, BookOpen, ClipboardList, GraduationCap, ExternalLink } from "lucide-react"
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
  params: Promise<{ department: string; level: string; subject: string }>
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

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.8 + i * 0.1,
      ease: [0.25, 0.4, 0.25, 1],
    },
  }),
}

export default function SubjectPage({ params }: Props) {
  const { department, level: levelParam, subject: subjectParam } = use(params)
  const dept = departmentData[department]
  const levelNum = Number.parseInt(levelParam)

  if (!dept || !dept.levels[levelNum]) {
    notFound()
  }

  const level = dept.levels[levelNum]
  const subject = [...level.subjects.term1, ...level.subjects.term2].find((s) => s.id === subjectParam)

  if (!subject) {
    notFound()
  }

  const yearSuffix = levelNum === 1 ? "st" : levelNum === 2 ? "nd" : levelNum === 3 ? "rd" : "th"

  const sections = [
    {
      id: "lectures",
      title: "Lectures",
      icon: BookOpen,
      color: "from-blue-500/[0.15]",
      iconColor: "text-blue-400",
      content: subject.materials.lectures,
      description: "Access comprehensive lecture materials and notes",
      buttonText: "Open Lecture Materials",
    },
    {
      id: "sections",
      title: "Sections",
      icon: FileText,
      color: "from-green-500/[0.15]",
      iconColor: "text-green-400",
      content: subject.materials.sections,
      description: "Practice problems, worksheets, and section materials",
      buttonText: "Open Section Materials",
    },
    {
      id: "videos",
      title: "Videos",
      icon: Video,
      color: "from-purple-500/[0.15]",
      iconColor: "text-purple-400",
      content: subject.materials.videos,
      description: "Watch comprehensive video lectures and tutorials",
      buttonText: "Open Video Playlist",
    },
    {
      id: "quizzes",
      title: "Quizzes",
      icon: ClipboardList,
      color: "from-orange-500/[0.15]",
      iconColor: "text-orange-400",
      content: null,
      description: "Quizzes and practice tests will be added here",
      buttonText: "Coming Soon",
    },
    {
      id: "exams",
      title: "Last Exams",
      icon: GraduationCap,
      color: "from-red-500/[0.15]",
      iconColor: "text-red-400",
      content: null,
      description: "Previous exam papers and solutions will be available here",
      buttonText: "Coming Soon",
    },
  ]

  return (
    <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Elegant Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={380}
          height={95}
          rotate={6}
          gradient="from-indigo-500/[0.15]"
          className="left-[-5%] top-[22%]"
        />
        <ElegantShape
          delay={0.5}
          width={300}
          height={75}
          rotate={-8}
          gradient="from-rose-500/[0.15]"
          className="right-[-1%] top-[55%]"
        />
        <ElegantShape
          delay={0.4}
          width={160}
          height={50}
          rotate={-2}
          gradient="from-violet-500/[0.15]"
          className="left-[12%] bottom-[12%]"
        />
        <ElegantShape
          delay={0.6}
          width={120}
          height={35}
          rotate={12}
          gradient="from-amber-500/[0.15]"
          className="right-[22%] top-[18%]"
        />
        <ElegantShape
          delay={0.7}
          width={90}
          height={25}
          rotate={-18}
          gradient="from-cyan-500/[0.15]"
          className="left-[25%] top-[8%]"
        />
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Link href={`/specialization/${department}/${levelParam}`}>
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {levelNum}
                {yearSuffix} Year
              </Button>
            </Link>
          </motion.div>

          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {subject.name}
              </span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-lg text-white/60 mb-6 max-w-2xl mx-auto leading-relaxed"
            >
              {subject.description}
            </motion.p>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex justify-center gap-4 mb-8 flex-wrap"
            >
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/[0.03] border-white/[0.1] text-white/70">
                {dept.name}
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/[0.03] border-white/[0.1] text-white/70">
                {levelNum}
                {yearSuffix} Year
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-2 bg-white/[0.03] border-white/[0.1] text-white/70">
                {subject.creditHours} Credits
              </Badge>
            </motion.div>
          </div>

          {/* Tabs */}
          <motion.div custom={3} variants={fadeUpVariants} initial="hidden" animate="visible">
            <Tabs defaultValue="lectures" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                {sections.map((section, index) => {
                  const IconComponent = section.icon
                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="flex items-center gap-2 data-[state=active]:bg-white/[0.1] data-[state=active]:text-white text-white/60"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="hidden sm:inline">{section.title}</span>
                    </TabsTrigger>
                  )
                })}
              </TabsList>

              {sections.map((section, index) => {
                const IconComponent = section.icon
                return (
                  <TabsContent key={section.id} value={section.id}>
                    <motion.div custom={index} variants={tabVariants} initial="hidden" animate="visible">
                      <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-3 text-white">
                            <motion.div
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.3 }}
                              className={cn(
                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                "bg-gradient-to-r to-transparent border border-white/[0.15]",
                                "backdrop-blur-sm shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                                section.color,
                              )}
                            >
                              <IconComponent className={cn("w-6 h-6", section.iconColor)} />
                            </motion.div>
                            {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {section.content ? (
                            <div className="space-y-4">
                              <p className="text-white/60 mb-4 leading-relaxed">
                                {section.description} for {subject.name}.
                              </p>
                              <Button
                                asChild
                                className="w-full bg-white/[0.05] border border-white/[0.1] text-white hover:bg-white/[0.1] backdrop-blur-sm"
                              >
                                <a
                                  href={section.content}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  {section.buttonText}
                                </a>
                              </Button>
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                className={cn(
                                  "w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center",
                                  "bg-gradient-to-r to-transparent border border-white/[0.15]",
                                  "backdrop-blur-sm",
                                  section.color,
                                )}
                              >
                                <IconComponent className={cn("w-8 h-8", section.iconColor)} />
                              </motion.div>
                              <p className="text-white/50 mb-4 leading-relaxed">{section.description}.</p>
                              <p className="text-sm text-white/30">
                                This section is currently being prepared and will be available soon.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}