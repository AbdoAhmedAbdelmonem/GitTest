"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, ArrowLeft, ArrowRight, Play, CheckCircle, XCircle, Palette, Timer, Zap, Star, Award, Target, Eye, Sparkles, Brain, Lightbulb, BookOpen } from 'lucide-react'
import { cn } from "@/lib/utils"

interface QuizQuestion {
  numb: number
  question: string
  type: string
  answer: string
  options: string[]
  image?: string | null
}

interface QuizData {
  id: string
  name: string
  code: string
  duration: number
  questions: number
  jsonFile: string
}

interface QuizInterfaceProps {
  quizData: QuizData
  onExit: () => void
}

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

// Creative floating particles for celebrations
function FloatingParticles({ color, count = 20 }: { color: string, count?: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            y: -100,
            rotate: 360,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  )
}

const themes = [
  { name: "Ocean", primary: "#0066cc", secondary: "#004499", accent: "#00aaff", gradient: "from-blue-500/[0.15]" },
  { name: "Forest", primary: "#228B22", secondary: "#006400", accent: "#32CD32", gradient: "from-green-500/[0.15]" },
  { name: "Sunset", primary: "#FF6B35", secondary: "#CC4125", accent: "#FF8C69", gradient: "from-orange-500/[0.15]" },
  { name: "Purple", primary: "#8A2BE2", secondary: "#6A1B9A", accent: "#BA55D3", gradient: "from-purple-500/[0.15]" },
  { name: "Rose", primary: "#E91E63", secondary: "#C2185B", accent: "#F48FB1", gradient: "from-rose-500/[0.15]" },
  { name: "Teal", primary: "#009688", secondary: "#00695C", accent: "#4DB6AC", gradient: "from-teal-500/[0.15]" }
]

const durations = [
  { label: "Quick", value: 5, icon: Zap, description: "5 minutes" },
  { label: "Standard", value: 15, description: "15 minutes" },
  { label: "Extended", value: 30, description: "30 minutes" },
  { label: "Unlimited", value: 0, icon: Timer, description: "No time limit" }
]

const quizModes = [
  { 
    id: "instant", 
    name: "Instant Feedback", 
    icon: Lightbulb, 
    description: "See answers immediately with creative animations",
    color: "from-yellow-500/[0.15]"
  },
  { 
    id: "traditional", 
    name: "Traditional Mode", 
    icon: Brain, 
    description: "Answer all questions then see results",
    color: "from-indigo-500/[0.15]"
  }
]

export default function QuizInterface({ quizData, onExit }: QuizInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<'setup' | 'quiz' | 'results' | 'review'>('setup')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({})
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedDuration, setSelectedDuration] = useState(15)
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [selectedMode, setSelectedMode] = useState("traditional")
  const [showSettings, setShowSettings] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [answerRevealed, setAnswerRevealed] = useState<{[key: number]: boolean}>({})
  const [showCelebration, setShowCelebration] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    loadQuestions()
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--quiz-primary', selectedTheme.primary)
    document.documentElement.style.setProperty('--quiz-secondary', selectedTheme.secondary)
    document.documentElement.style.setProperty('--quiz-accent', selectedTheme.accent)
  }, [selectedTheme])

  const loadQuestions = async () => {
    try {
      const response = await fetch(quizData.jsonFile)
      const data = await response.json()
      setQuestions(data)
    } catch (error) {
      console.error('Failed to load questions:', error)
      setQuestions([
        {
          numb: 1,
          question: "Sample question - What is 2 + 2?",
          type: "Mathematics",
          answer: "4",
          options: ["2", "3", "4", "5"],
          image: null
        }
      ])
    }
  }

  const startQuiz = () => {
    setCurrentStep('quiz')
    
    if (selectedDuration > 0) {
      setTimeLeft(selectedDuration * 60)
      startTimer()
    }
  }

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const selectAnswer = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }))

    if (selectedMode === "instant") {
      setShowAnswer(true)
      setAnswerRevealed(prev => ({
        ...prev,
        [currentQuestion]: true
      }))
      
      // Show celebration for correct answers
      if (answer === questions[currentQuestion].answer) {
        setShowCelebration(true)
        setTimeout(() => setShowCelebration(false), 2000)
      }
    }
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowAnswer(false)
    } else {
      finishQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setShowAnswer(answerRevealed[currentQuestion - 1] || false)
    }
  }

  const finishQuiz = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    let correctAnswers = 0
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    setCurrentStep('results')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreMessage = () => {
    const percentage = Math.round((score / questions.length) * 100)
    if (percentage >= 90) return { message: "Outstanding! Perfect mastery! 🏆", color: "text-yellow-400" }
    if (percentage >= 80) return { message: "Excellent work! Well done! ⭐", color: "text-green-400" }
    if (percentage >= 70) return { message: "Great job! Keep it up! 👏", color: "text-blue-400" }
    if (percentage >= 60) return { message: "Good effort! Room for improvement! 📚", color: "text-orange-400" }
    return { message: "Keep studying! You'll do better next time! 💪", color: "text-red-400" }
  }

  if (currentStep === 'setup') {
    return (
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Elegant Shapes with Theme Colors */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={450}
            height={110}
            rotate={8}
            gradient={selectedTheme.gradient}
            className="left-[-8%] top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={350}
            height={90}
            rotate={-12}
            gradient={selectedTheme.gradient}
            className="right-[-3%] top-[65%]"
          />
          <ElegantShape
            delay={0.4}
            width={200}
            height={60}
            rotate={-5}
            gradient={selectedTheme.gradient}
            className="left-[8%] bottom-[8%]"
          />
          <ElegantShape
            delay={0.6}
            width={160}
            height={45}
            rotate={18}
            gradient={selectedTheme.gradient}
            className="right-[18%] top-[12%]"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl"
          >
            <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg text-white">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onExit}
                    className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </div>
                
                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center",
                        "bg-gradient-to-r to-transparent border-2 border-white/[0.15]",
                        "backdrop-blur-[2px] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        selectedTheme.gradient,
                      )}
                    >
                      <Target className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                    {quizData.name}
                  </h1>
                  <Badge 
                    variant="outline" 
                    className="text-lg px-6 py-3 border-white/[0.15] text-white/70 backdrop-blur-sm"
                    style={{ backgroundColor: `${selectedTheme.primary}20` }}
                  >
                    Code: {quizData.code}
                  </Badge>
                </motion.div>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 p-6 bg-white/[0.03] rounded-xl border border-white/[0.08]"
                    >
                      <h3 className="text-xl font-semibold flex items-center text-white">
                        <Palette className="w-5 h-5 mr-3" />
                        Customize Your Experience
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium mb-4 text-white/80">Choose Theme</label>
                        <div className="grid grid-cols-3 gap-3">
                          {themes.map((theme) => (
                            <motion.button
                              key={theme.name}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedTheme(theme)}
                              className={cn(
                                "p-4 rounded-xl border-2 transition-all backdrop-blur-sm",
                                selectedTheme.name === theme.name
                                  ? "border-white scale-105 shadow-lg"
                                  : "border-white/[0.15] hover:border-white/[0.3]"
                              )}
                              style={{ backgroundColor: `${theme.primary}20` }}
                            >
                              <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ backgroundColor: theme.primary }} />
                              <div className="text-sm font-medium text-white">
                                {theme.name}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quiz Mode Selection */}
                <div>
                  <label className="block text-lg font-medium mb-6 text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Choose Quiz Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizModes.map((mode) => {
                      const IconComponent = mode.icon
                      return (
                        <motion.button
                          key={mode.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedMode(mode.id)}
                          className={cn(
                            "p-6 rounded-xl border-2 transition-all backdrop-blur-sm text-left",
                            selectedMode === mode.id
                              ? "border-white bg-white/[0.08] scale-105"
                              : "border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.03]"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center",
                              "bg-gradient-to-r to-transparent border border-white/[0.15]",
                              mode.color
                            )}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-white mb-2">{mode.name}</div>
                              <div className="text-sm text-white/60">{mode.description}</div>
                            </div>
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
                
                <div>
                  <label className="block text-lg font-medium mb-6 text-white flex items-center">
                    <Timer className="w-5 h-5 mr-3" />
                    Select Duration
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {durations.map((duration) => {
                      const IconComponent = duration.icon || Clock
                      return (
                        <motion.button
                          key={duration.value}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDuration(duration.value)}
                          className={cn(
                            "p-6 rounded-xl border-2 transition-all backdrop-blur-sm text-center",
                            selectedDuration === duration.value
                              ? "border-white bg-white/[0.08] scale-105"
                              : "border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.03]"
                          )}
                        >
                          <IconComponent className="w-8 h-8 mx-auto mb-3 text-white" />
                          <div className="text-lg font-semibold text-white mb-1">{duration.label}</div>
                          <div className="text-sm text-white/60">{duration.description}</div>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
                
                <div className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]">
                  <h3 className="font-semibold mb-4 text-white text-lg">Quiz Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">{questions.length}</div>
                      <div className="text-sm text-white/60">Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedDuration === 0 ? '∞' : `${selectedDuration}m`}
                      </div>
                      <div className="text-sm text-white/60">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">{selectedTheme.name}</div>
                      <div className="text-sm text-white/60">Theme</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedMode === "instant" ? "Instant" : "Traditional"}
                      </div>
                      <div className="text-sm text-white/60">Mode</div>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={startQuiz}
                    className="w-full py-6 text-xl font-semibold rounded-xl"
                    style={{ backgroundColor: selectedTheme.primary }}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    Start Quiz Adventure
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (currentStep === 'quiz') {
    const currentQ = questions[currentQuestion]
    const isAnswered = userAnswers[currentQuestion] !== undefined
    const isCorrect = userAnswers[currentQuestion] === currentQ?.answer
    
    return (
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Celebration particles for correct answers */}
        <AnimatePresence>
          {showCelebration && (
            <FloatingParticles color={selectedTheme.primary} count={30} />
          )}
        </AnimatePresence>

        {/* Elegant Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={400}
            height={100}
            rotate={10}
            gradient={selectedTheme.gradient}
            className="left-[-6%] top-[18%]"
          />
          <ElegantShape
            delay={0.5}
            width={320}
            height={80}
            rotate={-10}
            gradient={selectedTheme.gradient}
            className="right-[-2%] top-[60%]"
          />
          <ElegantShape
            delay={0.4}
            width={180}
            height={55}
            rotate={-3}
            gradient={selectedTheme.gradient}
            className="left-[10%] bottom-[10%]"
          />
        </div>

        {/* Timer */}
        {selectedDuration > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed top-6 right-6 z-50"
          >
            <Card className="bg-black/[0.3] backdrop-blur-lg border-white/[0.15]">
              <CardContent className="p-4">
                <div className="flex items-center text-white">
                  <Clock className="w-5 h-5 mr-3" />
                  <span className="font-mono text-xl font-bold">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Progress */}
        <div className="relative z-10 pt-6 px-6">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-lg">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Badge 
                variant="outline" 
                className="border-white/[0.15] text-white/70 px-4 py-2"
                style={{ backgroundColor: `${selectedTheme.primary}20` }}
              >
                {currentQ?.type}
              </Badge>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="relative z-10 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg text-white">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl leading-relaxed font-medium">
                      {currentQ?.question}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      {currentQ?.options.map((option, index) => {
                        const isSelected = userAnswers[currentQuestion] === option
                        const isCorrectOption = option === currentQ.answer
                        const showFeedback = selectedMode === "instant" && showAnswer
                        
                        return (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: showFeedback ? 1 : 1.02, x: showFeedback ? 0 : 8 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => !showFeedback && selectAnswer(option)}
                            disabled={showFeedback}
                            className={cn(
                              "w-full p-6 text-left rounded-xl border-2 transition-all backdrop-blur-sm relative overflow-hidden",
                              showFeedback
                                ? isCorrectOption
                                  ? "border-green-400 bg-green-500/[0.2] shadow-lg shadow-green-500/[0.3]"
                                  : isSelected
                                  ? "border-red-400 bg-red-500/[0.2] shadow-lg shadow-red-500/[0.3]"
                                  : "border-white/[0.15] bg-white/[0.02]"
                                : isSelected
                                ? "border-white bg-white/[0.1] shadow-lg"
                                : "border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.03]"
                            )}
                            style={{
                              backgroundColor: !showFeedback && isSelected 
                                ? `${selectedTheme.primary}20` 
                                : undefined
                            }}
                          >
                            {/* Creative feedback animations */}
                            <AnimatePresence>
                              {showFeedback && isCorrectOption && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="absolute top-4 right-4"
                                >
                                  <CheckCircle className="w-8 h-8 text-green-400" />
                                </motion.div>
                              )}
                              {showFeedback && isSelected && !isCorrectOption && (
                                <motion.div
                                  initial={{ scale: 0, rotate: 180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="absolute top-4 right-4"
                                >
                                  <XCircle className="w-8 h-8 text-red-400" />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <div className="flex items-center">
                              <div className={cn(
                                "w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
                                showFeedback
                                  ? isCorrectOption
                                    ? "border-green-400 bg-green-400"
                                    : isSelected
                                    ? "border-red-400 bg-red-400"
                                    : "border-white/[0.4]"
                                  : isSelected
                                  ? "border-white bg-white"
                                  : "border-white/[0.4]"
                              )}>
                                {!showFeedback && isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: selectedTheme.primary }}
                                  />
                                )}
                                {showFeedback && (isCorrectOption || (isSelected && !isCorrectOption)) && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 rounded-full bg-white"
                                  />
                                )}
                              </div>
                              <span className="text-lg">{option}</span>
                            </div>

                            {/* Ripple effect for correct answers */}
                            {showFeedback && isCorrectOption && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0.8 }}
                                animate={{ scale: 4, opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0 bg-green-400/[0.3] rounded-xl"
                              />
                            )}
                          </motion.button>
                        )
                      })}
                    </div>

                    {/* Creative answer explanation for instant mode */}
                    <AnimatePresence>
                      {selectedMode === "instant" && showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          className="mt-6 p-6 rounded-xl border border-white/[0.15] bg-white/[0.03] backdrop-blur-sm"
                        >
                          <div className="flex items-center mb-3">
                            {isCorrect ? (
                              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-400 mr-3" />
                            )}
                            <span className={cn(
                              "text-lg font-semibold",
                              isCorrect ? "text-green-400" : "text-red-400"
                            )}>
                              {isCorrect ? "Correct! Well done!" : "Incorrect"}
                            </span>
                          </div>
                          <p className="text-white/80">
                            The correct answer is: <span className="font-semibold text-white">{currentQ?.answer}</span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 px-6 pb-6">
          <div className="max-w-4xl mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="border-white/[0.15] text-white hover:bg-white/[0.05] px-8 py-3"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={nextQuestion}
                disabled={!isAnswered}
                className="px-8 py-3 text-lg font-semibold"
                style={{ backgroundColor: selectedTheme.primary }}
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'results') {
    const percentage = Math.round((score / questions.length) * 100)
    const scoreInfo = getScoreMessage()
    
    return (
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Celebration particles for high scores */}
        {percentage >= 80 && <FloatingParticles color={selectedTheme.primary} count={50} />}

        {/* Elegant Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={500}
            height={120}
            rotate={12}
            gradient={selectedTheme.gradient}
            className="left-[-10%] top-[15%]"
          />
          <ElegantShape
            delay={0.5}
            width={400}
            height={100}
            rotate={-15}
            gradient={selectedTheme.gradient}
            className="right-[-5%] top-[70%]"
          />
          <ElegantShape
            delay={0.4}
            width={250}
            height={70}
            rotate={-8}
            gradient={selectedTheme.gradient}
            className="left-[5%] bottom-[5%]"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl"
          >
            <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg text-white text-center">
              <CardHeader className="pb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6"
                >
                  {percentage >= 80 ? (
                    <div className="relative">
                      <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star className="w-8 h-8 text-yellow-300" />
                      </motion.div>
                    </div>
                  ) : percentage >= 60 ? (
                    <Award className="w-24 h-24 text-blue-400 mx-auto" />
                  ) : (
                    <Target className="w-24 h-24 text-orange-400 mx-auto" />
                  )}
                </motion.div>
                
                <CardTitle className="text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Quiz Completed!
                </CardTitle>
                <p className={cn("text-xl", scoreInfo.color)}>
                  {scoreInfo.message}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <div className="relative">
                  <div className="w-40 h-40 mx-auto relative">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke={selectedTheme.primary}
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                        animate={{ 
                          strokeDashoffset: 2 * Math.PI * 35 * (1 - percentage / 100)
                        }}
                        transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="text-4xl font-bold"
                      >
                        {percentage}%
                      </motion.span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-400 mb-1">{score}</div>
                    <div className="text-sm text-white/60">Correct</div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-400 mb-1">{questions.length - score}</div>
                    <div className="text-sm text-white/60">Incorrect</div>
                  </motion.div>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-400 mb-1">{questions.length}</div>
                    <div className="text-sm text-white/60">Total</div>
                  </motion.div>
                </div>
                
                <div className="flex gap-4">
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('review')}
                      style={{ backgroundColor: selectedTheme.primary ,color: 'white' }}
                      className="w-full border-white/[0.15] text-white hover:bg-white/[0.05] py-4 text-lg"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Review Answers
                    </Button>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep('setup')
                        setCurrentQuestion(0)
                        setUserAnswers({})
                        setScore(0)
                        setAnswerRevealed({})
                      }}
                      style={{ backgroundColor: selectedTheme.primary ,color: 'white' }}
                      className="w-full border-white/[0.15] text-white hover:bg-white/[0.05] py-4 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={onExit}
                      className="w-full py-4 text-lg font-semibold"
                      style={{ backgroundColor: selectedTheme.primary }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Course
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  if (currentStep === 'review') {
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
            gradient={selectedTheme.gradient}
            className="left-[-8%] top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={350}
            height={90}
            rotate={-12}
            gradient={selectedTheme.gradient}
            className="right-[-3%] top-[65%]"
          />
          <ElegantShape
            delay={0.4}
            width={200}
            height={60}
            rotate={-5}
            gradient={selectedTheme.gradient}
            className="left-[8%] bottom-[8%]"
          />
        </div>

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
              >
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep('results')}
                  className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Results
                </Button>
                <Badge 
                  variant="outline" 
                  className="text-lg px-6 py-3 border-white/[0.15] text-white/70"
                  style={{ backgroundColor: `${selectedTheme.primary}20` }}
                >
                  Answer Review
                </Badge>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80"
              >
                Your Quiz Answers
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/60"
              >
                Review your performance and learn from the correct answers
              </motion.p>
            </div>

            {/* Answer blocks */}
            <div className="grid gap-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index]
                const isCorrect = userAnswer === question.answer
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={cn(
                      "bg-white/[0.02] border-2 backdrop-blur-lg transition-all",
                      isCorrect 
                        ? "border-green-500/[0.3] bg-green-500/[0.05]" 
                        : "border-red-500/[0.3] bg-red-500/[0.05]"
                    )}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <Badge 
                                variant="outline" 
                                className="text-sm px-3 py-1 border-white/[0.15] text-white/70"
                              >
                                Question {index + 1}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className="text-sm px-3 py-1 border-white/[0.15] text-white/70"
                              >
                                {question.type}
                              </Badge>
                            </div>
                            <CardTitle className="text-xl text-white leading-relaxed">
                              {question.question}
                            </CardTitle>
                          </div>
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.1 + 0.3 }}
                            className="ml-4"
                          >
                            {isCorrect ? (
                              <div className="w-12 h-12 rounded-full bg-green-500/[0.2] border-2 border-green-400 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-400" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-red-500/[0.2] border-2 border-red-400 flex items-center justify-center">
                                <XCircle className="w-6 h-6 text-red-400" />
                              </div>
                            )}
                          </motion.div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <div className="space-y-4">
                          {/* User's answer */}
                          <div className="p-4 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                            <div className="flex items-center gap-3 mb-2">
                              <BookOpen className="w-5 h-5 text-white/60" />
                              <span className="text-sm font-medium text-white/60">Your Answer:</span>
                            </div>
                            <p className={cn(
                              "text-lg font-medium",
                              isCorrect ? "text-green-400" : "text-red-400"
                            )}>
                              {userAnswer || "No answer selected"}
                            </p>
                          </div>

                          {/* Correct answer (if different) */}
                          {!isCorrect && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.5 }}
                              className="p-4 rounded-lg border border-green-500/[0.3] bg-green-500/[0.05]"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <Lightbulb className="w-5 h-5 text-green-400" />
                                <span className="text-sm font-medium text-green-400">Correct Answer:</span>
                              </div>
                              <p className="text-lg font-medium text-green-400">
                                {question.answer}
                              </p>
                            </motion.div>
                          )}

                          {/* All options with visual feedback */}
                          <div className="grid gap-2">
                            <span className="text-sm font-medium text-white/60 mb-2">All Options:</span>
                            {question.options.map((option, optionIndex) => {
                              const isUserChoice = option === userAnswer
                              const isCorrectOption = option === question.answer
                              
                              return (
                                <motion.div
                                  key={optionIndex}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 + optionIndex * 0.05 + 0.6 }}
                                  className={cn(
                                    "p-3 rounded-lg border-2 transition-all",
                                    isCorrectOption
                                      ? "border-green-400 bg-green-500/[0.1]"
                                      : isUserChoice && !isCorrectOption
                                      ? "border-red-400 bg-red-500/[0.1]"
                                      : "border-white/[0.08] bg-white/[0.02]"
                                  )}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={cn(
                                      "text-sm",
                                      isCorrectOption
                                        ? "text-green-400 font-medium"
                                        : isUserChoice && !isCorrectOption
                                        ? "text-red-400"
                                        : "text-white/70"
                                    )}>
                                      {option}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {isCorrectOption && (
                                        <CheckCircle className="w-4 h-4 text-green-400" />
                                      )}
                                      {isUserChoice && !isCorrectOption && (
                                        <XCircle className="w-4 h-4 text-red-400" />
                                      )}
                                      {isUserChoice && (
                                        <Badge variant="outline" className="text-xs border-white/[0.15] text-white/60">
                                          Your choice
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: questions.length * 0.1 + 0.5 }}
              className="mt-12"
            >
              <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Quiz Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-green-500/[0.1] border border-green-500/[0.3]">
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-400 mb-1">{score}</div>
                      <div className="text-sm text-white/60">Correct Answers</div>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/[0.1] border border-red-500/[0.3]">
                      <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-red-400 mb-1">{questions.length - score}</div>
                      <div className="text-sm text-white/60">Incorrect Answers</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/[0.05] border border-white/[0.15]">
                      <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-400 mb-1">
                        {Math.round((score / questions.length) * 100)}%
                      </div>
                      <div className="text-sm text-white/60">Final Score</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 mt-8 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('results')}
                      className="border-white/[0.15] text-white hover:bg-white/[0.05] px-8 py-3"
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Results
                    </Button>
                    <Button
                      onClick={onExit}
                      className="px-8 py-3 font-semibold"
                      style={{ backgroundColor: selectedTheme.primary }}
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Back to Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
