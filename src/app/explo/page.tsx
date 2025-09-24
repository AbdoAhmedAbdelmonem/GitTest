"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  BookOpen,
  GraduationCap,
  Award,
  HelpCircle,
  Mic,
  MicOff,
  Menu,
  X,
  Bot,
  MessageSquare,
  Brain,
  Sparkles,
  Rocket,
  Lightbulb,
  Cpu,
  Database,
  Code,
  Globe,
} from "lucide-react"
import articlesData from "@/data/articles.json"
import Image from "next/image"
import ScrollAnimatedSection from "@/components/scroll-animated-section"

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  category?: string
  sources?: string[]
  confidence?: number
}

interface Article {
  id: string
  title: string
  category: string
  tags: string[]
  updatedAt: string
  summary: string
  content: string
  contentHtml: string
}

interface ChatSession {
  id: string
  model: string
  messages: Message[]
  name: string
}

const categories = {
  faq: { label: "الأسئلة الشائعة", icon: HelpCircle, color: "bg-green-500" },
  courses: { label: "الكورسات", icon: BookOpen, color: "bg-emerald-500" },
  internships: { label: "التدريبات", icon: GraduationCap, color: "bg-teal-500" },
  grants: { label: "المنح", icon: Award, color: "bg-cyan-500" },
}

const FloatingIcon = ({ icon: Icon, className, delay = 0 }: { icon: React.ComponentType<{ className?: string }>, className?: string, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: [0.3, 0.8, 0.3],
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      className={`absolute pointer-events-none ${className}`}
      key={`floating-icon-${delay}`}
    >
      <Icon className="w-6 h-6 md:w-8 md:h-8 text-green-400/40" />
    </motion.div>
  );
};

export default function ExploChatbot() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "1",
      model: "gemini-1.5-flash",
      name: "Explo Plus 1.0",
      messages: [
        {
          id: "1",
          content:
            "مرحباً! أنا Explo، المساعد الافتراضي لموقع Chameleon FCDS. كيف يمكنني مساعدتك اليوم؟ يمكنك البدء بسؤالي عن الكورسات، التدريبات او اختيار احد المواضيع المحفوظة في قاعدة بياناتي من القائمة علي اليمين.",
          isBot: true,
          timestamp: new Date("2025-01-01T00:00:00Z"), // Fixed timestamp for hydration
        },
      ],
    },
  ])
  const [activeSessionId, setActiveSessionId] = useState("1")

  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isListening, setIsListening] = useState(false)
  const [isSpeechRecognitionSupported, setIsSpeechRecognitionSupported] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showIntroVideo, setShowIntroVideo] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const articles = articlesData as Article[]

  const activeSession = chatSessions.find((session) => session.id === activeSessionId) || chatSessions[0]
  const messages = activeSession.messages

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check for speech recognition support on client side
  useEffect(() => {
    setIsSpeechRecognitionSupported("webkitSpeechRecognition" in window)
  }, [])

  // Force dark mode and apply Rubik font
  useEffect(() => {
    document.documentElement.classList.add("dark")
    
    // Apply Rubik font to the body if not already applied
    if (!document.body.style.fontFamily?.includes('Rubik')) {
      // Load Google Fonts Rubik
      const link = document.createElement('link')
      link.href = 'https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&display=swap'
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      
      // Apply font to body
      document.body.style.fontFamily = 'Rubik, sans-serif'
    }
  }, [])

  // Handle intro video fade out
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntroVideo(false)
    }, 4500) // 4.5 seconds

    return () => clearTimeout(timer)
  }, [])

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      model: "default",
      name: "جلسة جديدة",
      messages: [
        {
          id: Date.now().toString(),
          content: "مرحباً! أنا إكسبلو، المساعد الذكي لكلية Chameleon FCDS. كيف يمكنني مساعدتك اليوم؟ يمكنك البدء بسؤالي عن الكورسات، التدريبات أو اختيار أحد المواضيع المحفوظة في قاعدة البيانات من الشريط الجانبي.",
          isBot: true,
          timestamp: new Date(),
        },
      ],
    }

    setChatSessions((prev) => [...prev, newSession])
    setActiveSessionId(newSession.id)
  }

  const switchToSession = (sessionId: string) => {
    setActiveSessionId(sessionId)
  }

  const deleteSession = (sessionId: string) => {
    if (chatSessions.length <= 1) return // Keep at least one session

    setChatSessions((prev) => prev.filter((session) => session.id !== sessionId))

    if (activeSessionId === sessionId) {
      const remainingSessions = chatSessions.filter((session) => session.id !== sessionId)
      setActiveSessionId(remainingSessions[0].id)
    }
  }

  const generateResponse = async (userMessage: string): Promise<Message> => {
    // Use local fallback response only
    const fallbackResponse = getFallbackResponse(userMessage)

    return {
      id: (Date.now() + 1).toString(),
      content: fallbackResponse || "عذراً، لا أستطيع الإجابة على هذا السؤال حالياً. يرجى المحاولة مرة أخرى أو اختيار سؤال من الشريط الجانبي.",
      isBot: true,
      timestamp: new Date(),
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    // Update the active session's messages
    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId ? { ...session, messages: [...session.messages, userMessage] } : session,
      ),
    )

    setInputValue("")
    setIsTyping(true)

    try {
      const botResponse = await generateResponse(inputValue)

      setTimeout(
        () => {
          setChatSessions((prev) =>
            prev.map((session) =>
              session.id === activeSessionId ? { ...session, messages: [...session.messages, botResponse] } : session,
            ),
          )
          setIsTyping(false)
        },
        1500, // Fixed delay instead of random
      )
    } catch (error) {
      console.error("Error generating response:", error)
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
        isBot: true,
        timestamp: new Date(),
      }
      setChatSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId ? { ...session, messages: [...session.messages, errorResponse] } : session,
        ),
      )
      setIsTyping(false)
    }
  }

  const handleQuickQuestion = (article: Article) => {
    const quickMessage: Message = {
      id: Date.now().toString(),
      content: article.title,
      isBot: false,
      timestamp: new Date(),
    }

    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId ? { ...session, messages: [...session.messages, quickMessage] } : session,
      ),
    )
    setIsTyping(true)
    setIsSidebarOpen(false)

      setTimeout(() => {
        const botResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: `**${article.title}**\n\n${article.content}`,
          isBot: true,
          timestamp: new Date(),
          category: article.category,
          sources: [`من قاعدة بيانات ${categories[article.category as keyof typeof categories]?.label}`],
          confidence: 100, // 100% confidence since it's from our JSON data
        }

        setChatSessions((prev) =>
          prev.map((session) =>
            session.id === activeSessionId ? { ...session, messages: [...session.messages, botResponse] } : session,
          ),
        )
      setIsTyping(false)
    }, 800)
  }

  const filteredArticles =
    activeCategory === "all" ? articles : articles.filter((article) => article.category === activeCategory)

  const startListening = () => {
    if (!isSpeechRecognitionSupported) {
      alert("التعرف على الصوت غير مدعوم في هذا المتصفح")
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = "ar-EG"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInputValue(transcript)
    }

    recognition.start()
  }

  const getFallbackResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for common greetings
    if (lowerMessage.includes("مرحبا") || lowerMessage.includes("السلام") || lowerMessage.includes("أهلا")) {
      return "مرحباً بك! أنا إكسبلو، مساعدك الذكي في موقع Chameleon FCDS. كيف يمكنني مساعدتك اليوم؟"
    }

    // Check for questions about the college
    if (lowerMessage.includes("كلية") || lowerMessage.includes("حاسبات") || lowerMessage.includes("fcds")) {
      return "كلية حاسبات وعلوم البيانات بالإسكندرية تقدم برامج متميزة في علوم الحاسوب وعلوم البيانات والذكاء الاصطناعي."
    }

    // Check for course-related questions
    if (lowerMessage.includes("كورس") || lowerMessage.includes("مادة") || lowerMessage.includes("دراسة")) {
      return "يمكنك العثور على معلومات الكورسات في الشريط الجانبي، أو انتظار عودة الاتصال بنموذج الذكاء الاصطناعي للحصول على إجابات مفصلة."
    }

    return ""
  }

  return (
    <div className="min-h-screen bg-[#030303] relative overflow-hidden font-[Rubik]" suppressHydrationWarning style={{ fontFamily: 'Rubik, sans-serif' }}>
      {/* Intro Video Overlay */}
      <AnimatePresence>
        {showIntroVideo && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <video
              autoPlay
              muted
              playsInline
              className="w-full h-full bg-[#030d15]"
              onEnded={() => setShowIntroVideo(false)}
            >
              <source src="/images/Background2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back to Chameleon Button */}
      <div className="fixed top-4 left-4 z-50">
        <a
          href="https://chameleon-nu.tech"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/20"
          style={{ fontFamily: 'Rubik, sans-serif' }}
        >
          ← Back to Chameleon
        </a>
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.05] via-transparent to-emerald-500/[0.05] blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-tl from-teal-500/[0.05] via-transparent to-cyan-500/[0.05] blur-3xl" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5"
          style={{ backgroundImage: 'url(/images/Background.png)' }}
        />

        {/* Floating Icons Container */}
        <AnimatePresence>
          <div className="absolute inset-0">
            <FloatingIcon icon={Brain} className="top-10 md:top-20 left-4 md:left-10" delay={0} />
            <FloatingIcon icon={Sparkles} className="top-20 md:top-40 right-10 md:right-20" delay={1} />
            <FloatingIcon icon={Rocket} className="bottom-20 md:bottom-40 left-10 md:left-20" delay={2} />
            <FloatingIcon icon={Lightbulb} className="bottom-10 md:bottom-20 right-4 md:right-10" delay={3} />
            <FloatingIcon icon={Cpu} className="top-32 md:top-60 left-1/2" delay={4} />
            <FloatingIcon icon={Database} className="bottom-32 md:bottom-60 right-1/3" delay={5} />
            <FloatingIcon icon={Code} className="top-40 md:top-80 right-1/4" delay={6} />
            <FloatingIcon icon={Globe} className="bottom-40 md:bottom-80 left-1/3" delay={7} />
          </div>
        </AnimatePresence>
      </div>

      <ScrollAnimatedSection className="pt-24 md:pt-32 pb-8 md:pb-16 relative z-10">
        <div className="container mx-auto px-3 md:px-4" style={{ fontFamily: 'Rubik, sans-serif' }}>
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 mb-4 md:mb-6"
            >
              <Bot className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
              <span className="text-xs md:text-sm text-white/60 tracking-wide font-rubik">Chat Assistant</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl md:text-4xl lg:text-6xl font-bold text-white mb-4 md:mb-6"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              EXPLO{" "}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
                إكسبلو
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-sm md:text-lg text-white/60 max-w-3xl mx-auto mb-6 md:mb-8 px-2"
              style={{ fontFamily: 'Rubik, sans-serif' }}
            >
              المساعد الذكي لكلية حاسبات وعلوم البيانات - استكشف المعرفة مع المساعدة المتقدمة
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 md:gap-4"
            >
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-rubik">
                <Brain className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                مساعد ذكي
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm font-rubik">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                محادثة تفاعلية
              </Badge>
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto h-screen flex flex-col">
            <div className="bg-white/5 dark:bg-white/[0.02] rounded-t-2xl shadow-lg border border-white/10 p-4 md:p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 md:gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden text-white font-rubik"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </Button>

                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 border-white/20">
                      <Image
                        src="/images/Explor.png"
                        alt="Explo Logo"
                        width={32}
                        height={32}
                        className="w-6 h-6 md:w-8 md:h-8 object-contain"
                      />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white bg-green-400 animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-lg md:text-2xl font-bold text-green-400" style={{ fontFamily: 'Rubik, sans-serif' }}>EXPLO إكسبلو</h1>
                    <p className="text-xs md:text-sm text-white/60" style={{ fontFamily: 'Rubik, sans-serif' }}>
                      المساعد الذكي لـ Chameleon FCDS - جلسة محادثة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 md:gap-4">
                  {/* Removed AI assistant indicator */}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 overflow-x-auto">
                <div className="flex gap-1">
                  {chatSessions.map((session) => (
                    <div key={session.id} className="flex items-center">
                      <Button
                        variant={activeSessionId === session.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => switchToSession(session.id)}
                        className="text-xs whitespace-nowrap font-rubik"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        جلسة {session.id}
                      </Button>
                      {chatSessions.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSession(session.id)}
                          className="ml-1 p-1 h-6 w-6 text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  size="sm"
                  onClick={() => createNewSession()}
                  className="text-xs whitespace-nowrap text-white bg-green-600 hover:bg-green-700 font-rubik"
                >
                  <Bot className="w-3 h-3 mr-1" />
                  محادثة جديدة
                </Button>
              </div>
            </div>

            <div className="flex-1 bg-white/5 dark:bg-white/[0.02] shadow-lg flex overflow-hidden relative border-x border-white/10 backdrop-blur-xl">
              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              <div
                className={`
                ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
                md:translate-x-0 fixed md:relative right-0 top-0 h-full w-80 md:w-80
                border-l border-white/10 bg-white/[0.02] backdrop-blur-xl
                transition-transform duration-300 ease-in-out z-50 md:z-auto
              `}
              >
                <div className="p-4" style={{ fontFamily: 'Rubik, sans-serif' }}>
                  <h3 className="font-semibold text-white mb-4">الفئات السريعة</h3>
                  <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 gap-1 mb-4 bg-white/10 p-1 rounded-lg">
                      <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white/20 font-rubik">
                        الكل
                      </TabsTrigger>
                      <TabsTrigger value="faq" className="text-xs data-[state=active]:bg-white/20 font-rubik">
                        أسئلة
                      </TabsTrigger>
                    </TabsList>
                    <TabsList className="grid w-full grid-cols-3 gap-1 bg-white/10 p-1 rounded-lg">
                      <TabsTrigger value="courses" className="text-xs data-[state=active]:bg-white/20 font-rubik">
                        كورسات
                      </TabsTrigger>
                      <TabsTrigger value="internships" className="text-xs data-[state=active]:bg-white/20 font-rubik">
                        تدريب
                      </TabsTrigger>
                      <TabsTrigger value="grants" className="text-xs data-[state=active]:bg-white/20 font-rubik">
                        منح
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <ScrollArea className="h-[calc(100vh-280px)] px-4">
                  <div className="space-y-3">
                    {filteredArticles.map((article) => {
                      const categoryInfo = categories[article.category as keyof typeof categories]
                      return (
                        <Card
                          key={article.id}
                          className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                          onClick={() => handleQuickQuestion(article)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-8 h-8 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                              >
                                <categoryInfo.icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm text-white line-clamp-2 leading-tight font-rubik">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-white/60 mt-1 line-clamp-2 font-rubik">
                                  {article.summary}
                                </p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {article.tags.slice(0, 2).map((tag) => (
                                    <Badge
                                      key={tag}
                                      variant="secondary"
                                      className="text-xs px-2 py-0 bg-white/10 text-white/80 border-white/20 font-rubik"
                                    >
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex-1 flex flex-col min-w-0">
                <div
                  ref={messagesContainerRef}
                  className="flex-1 p-3 md:p-6 overflow-y-auto scroll-smooth chat-scroll"
                  style={{ scrollBehavior: "smooth", fontFamily: 'Rubik, sans-serif' }}
                  suppressHydrationWarning
                >
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                      >
                        <div
                          className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-3 ${
                            message.isBot
                              ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800"
                              : "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                          }`}
                        >
                          {message.isBot && (
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center">
                                <Image
                                  src="/images/Explor.png"
                                  alt="EXPLO"
                                  width={12}
                                  height={12}
                                  className="w-3 h-3 object-contain"
                                />
                              </div>
                              <span className="text-xs font-medium text-green-600 dark:text-green-400 font-rubik">إكسبلو</span>
                            </div>
                          )}

                          <div
                            className={`whitespace-pre-wrap text-sm md:text-base font-rubik ${message.isBot ? "text-gray-800 dark:text-gray-200" : "text-white"}`}
                          >
                            {message.content}
                          </div>

                          <div
                            className={`text-xs mt-2 font-rubik ${message.isBot ? "text-gray-500 dark:text-gray-400" : "text-green-100"}`}
                          >
                            {message.timestamp.toLocaleTimeString("ar-EG", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                      >
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-100 dark:border-green-800 rounded-2xl px-3 md:px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                              <Image
                                src="/images/Explor.png"
                                alt="EXPLO"
                                width={12}
                                height={12}
                                className="w-3 h-3 object-contain"
                              />
                            </div>
                            <span className="text-xs font-medium text-green-600 dark:text-green-400 font-rubik">
                              إكسبلو يحلل بذكاء...
                            </span>
                          </div>
                          <div className="flex gap-1 mt-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    <div ref={messagesEndRef} className="h-1" />
                  </div>
                </div>

                <div className="border-t border-white/10 p-3 md:p-4 bg-white/[0.02] backdrop-blur-xl">
                  <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="اكتب سؤالك هنا..."
                        className="pl-16 md:pl-20 pr-4 py-2 md:py-3 rounded-xl border-2 border-white/20 focus:border-green-400 transition-colors bg-white/5 text-white placeholder:text-white/60 font-rubik"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        style={{ fontFamily: 'Rubik, sans-serif' }}
                      />

                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 md:h-8 md:w-8"
                        onClick={startListening}
                        disabled={isListening || !isSpeechRecognitionSupported}
                      >
                        {isListening ? (
                          <MicOff className="w-3 h-3 md:w-4 md:h-4 text-red-500" />
                        ) : (
                          <Mic className={`w-3 h-3 md:w-4 md:h-4 ${isSpeechRecognitionSupported ? 'text-white/60' : 'text-white/30'}`} />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-white/60 mt-2 text-center max-w-4xl mx-auto font-rubik">
                    💬 مساعدة تفاعلية للطلاب
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimatedSection>
    </div>
  )
}
