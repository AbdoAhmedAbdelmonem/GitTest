// specialization/department/level/page.tsx
"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Calendar } from "lucide-react"
import { departmentData } from "@/lib/department-data"
import React, { Suspense } from "react"
import ErrorBoundary from "@/components/ErrorBoundary"


interface Props {
  params: Promise<{ department: string; level: string }>
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

export default function LevelPage({ params }: Props) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading level...</div>}>
        <LevelContent params={params} />
      </Suspense>
    </ErrorBoundary>
  )
}

function LevelContent({ params }: Props) {
  const resolvedParams = React.use(params)
  const dept = departmentData[resolvedParams.department]
  const levelNum = Number.parseInt(resolvedParams.level)

  if (!dept || !dept.levels[levelNum]) {
    notFound()
  }

  const level = dept.levels[levelNum]
  const yearSuffix = levelNum === 1 ? "st" : levelNum === 2 ? "nd" : levelNum === 3 ? "rd" : "th"

  return (
    <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

      {/* Elegant Shapes */}

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <Link href={`/specialization/${resolvedParams.department}`}>
              <Button
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {dept.name}
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
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">{dept.name}</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">
                {levelNum}
                {yearSuffix} Year
              </span>
            </motion.h1>

            <motion.p
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="text-lg text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Complete curriculum organized by academic terms
            </motion.p>
          </div>

          {/* Tabs */}
          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <Tabs defaultValue="term1" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
                <TabsTrigger
                  value="term1"
                  className="flex items-center gap-2 data-[state=active]:bg-white/[0.1] data-[state=active]:text-white text-white/60"
                >
                  <Calendar className="w-4 h-4" />
                  First Term
                </TabsTrigger>
                <TabsTrigger
                  value="term2"
                  className="flex items-center gap-2 data-[state=active]:bg-white/[0.1] data-[state=active]:text-white text-white/60"
                >
                  <Calendar className="w-4 h-4" />
                  Second Term
                </TabsTrigger>
              </TabsList>

              <TabsContent value="term1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {level.subjects.term1.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link href={`/specialization/${resolvedParams.department}/${resolvedParams.level}/${subject.id}`}>
                        <Card className="h-full bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-500 group cursor-pointer backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                                className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/[0.15] to-transparent border border-white/[0.15] flex items-center justify-center backdrop-blur-sm"
                              >
                                <BookOpen className="w-5 h-5 text-blue-400" />
                              </motion.div>
                              <Badge variant="outline" className="bg-white/[0.03] border-white/[0.1] text-white/60">
                                Term 1
                              </Badge>
                            </div>
                            <CardTitle className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                              {subject.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-white/60 text-sm mb-4 group-hover:text-white/70 transition-colors">
                              {subject.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-white/[0.03] border-white/[0.1] text-white/60"
                              >
                                {subject.creditHours} Credits
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs bg-white/[0.03] border-white/[0.1] text-white/60"
                              >
                                5 Sections
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="term2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {level.subjects.term2.map((subject, index) => (
                    <motion.div
                      key={subject.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link href={`/specialization/${resolvedParams.department}/${resolvedParams.level}/${subject.id}`}>
                        <Card className="h-full bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.15] transition-all duration-500 group cursor-pointer backdrop-blur-sm">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ duration: 0.3 }}
                                className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500/[0.15] to-transparent border border-white/[0.15] flex items-center justify-center backdrop-blur-sm"
                              >
                                <BookOpen className="w-5 h-5 text-green-400" />
                              </motion.div>
                              <Badge variant="outline" className="bg-white/[0.03] border-white/[0.1] text-white/60">
                                Term 2
                              </Badge>
                            </div>
                            <CardTitle className="text-lg font-semibold text-white group-hover:text-white/90 transition-colors">
                              {subject.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-white/60 text-sm mb-4 group-hover:text-white/70 transition-colors">
                              {subject.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs bg-white/[0.03] border-white/[0.1] text-white/60"
                              >
                                {subject.creditHours} Credits
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs bg-white/[0.03] border-white/[0.1] text-white/60"
                              >
                                5 Sections
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none" />
    </div>
  )
}
