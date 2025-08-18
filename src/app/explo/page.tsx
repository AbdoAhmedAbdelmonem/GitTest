"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  GraduationCap,
  Award,
  HelpCircle,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import articlesData from "@/data/articles.json"
import Image from "next/image"

interface Message {
  id: string
  content: string
  isBot: boolean
  timestamp: Date
  category?: string
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

const categories = {
  faq: { label: "الأسئلة الشائعة", icon: HelpCircle, color: "bg-blue-500" },
  courses: { label: "الكورسات", icon: BookOpen, color: "bg-green-500" },
  internships: { label: "التدريبات", icon: GraduationCap, color: "bg-purple-500" },
  grants: { label: "المنح", icon: Award, color: "bg-orange-500" },
}

export default function LuraChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "مرحباً! أنا Explo 🤖، المساعد الذكي لموقع Chameleon FCDS. يمكنك تصفح الأسئلة الشائعة من القائمة الجانبية أو طرح سؤالك الخاص. كيف يمكنني مساعدتك اليوم؟",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // overlay states
  const [showIntroOverlay, setShowIntroOverlay] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  const articles = articlesData as Article[]

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (showIntroOverlay) {
      const timer1 = setTimeout(() => {
        setFadeOut(true) // trigger fade
      }, 4000) // start fading at 4s
      
      const timer2 = setTimeout(() => {
        setShowIntroOverlay(false) // unmount after fade completes
      }, 5000) // fully hide after 5s (1s after fade starts)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [showIntroOverlay])

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes("explo") || lowerMessage.includes("Explo")) {
      return "نعم، أنا Explo! المساعد الذكي لموقع Chameleon FCDS. يمكنك تصفح الأسئلة الشائعة من القائمة الجانبية أو طرح سؤالك الخاص. 😊"
    }

    const relevantArticles = articles.filter((article) => {
      const searchText = `${article.title} ${article.content} ${article.tags.join(" ")}`.toLowerCase()
      const words = lowerMessage.split(" ")
      return words.some((word) => word.length > 2 && searchText.includes(word))
    })

    if (relevantArticles.length > 0) {
      const bestMatch = relevantArticles[0]
      if (lowerMessage.includes("إيه") || lowerMessage.includes("ما هو") || lowerMessage.includes("ما هي")) {
        return `بناءً على معرفتي في Chameleon FCDS، ${bestMatch.summary}\n\n${bestMatch.content.substring(0, 300)}...`
      } else if (lowerMessage.includes("كيف") || lowerMessage.includes("ازاي")) {
        return `إليك الطريقة:\n\n${bestMatch.content.substring(0, 400)}...`
      } else if (lowerMessage.includes("هل") || lowerMessage.includes("ممكن")) {
        return `نعم، ${bestMatch.summary}\n\nتفاصيل أكثر: ${bestMatch.content.substring(0, 300)}...`
      } else {
        return `${bestMatch.summary}\n\n${bestMatch.content.substring(0, 350)}...`
      }
    }

    if (lowerMessage.includes("مرحبا") || lowerMessage.includes("السلام") || lowerMessage.includes("أهلا")) {
      return "أهلاً وسهلاً بك في Chameleon FCDS! أنا مساعدك الذكي. يمكنك تصفح الأسئلة الشائعة من القائمة الجانبية أو طرح سؤالك الخاص. ما الذي تريد معرفته؟"
    }

    if (lowerMessage.includes("شكرا") || lowerMessage.includes("تسلم")) {
      return "العفو! سعيد لأنني استطعت مساعدتك في Chameleon FCDS. إذا كان لديك أي أسئلة أخرى، لا تتردد في سؤالي! 😊"
    }

    if (lowerMessage.includes("مساعدة") || lowerMessage.includes("help")) {
      return "بالطبع! كمساعد Chameleon FCDS، يمكنني مساعدتك في:\n\n🔹 الأسئلة الشائعة للطلبة الجدد\n🔹 الكورسات المهمة والتقنيات\n🔹 فرص التدريب والتدريبات العملية\n🔹 المنح المحلية والعالمية\n\nيمكنك تصفح هذه المواضيع من القائمة الجانبية."
    }

    return 'عذراً، لم أجد معلومات محددة حول هذا الموضوع في قاعدة بيانات Chameleon FCDS الحالية. يمكنك:\n\n• تصفح الأسئلة الشائعة من القائمة الجانبية\n• اختيار فئة محددة من التبويبات في القائمة\n• محاولة صياغة السؤال بطريقة أخرى\n\nاضغط على أيقونة القائمة في أعلى الشاشة لرؤية الأسئلة المتاحة!'
  }

  const handleQuickQuestion = (article: Article) => {
    const quickMessage: Message = {
      id: Date.now().toString(),
      content: article.title,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, quickMessage])
    setIsTyping(true)
    setIsSidebarOpen(false)

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `${article.summary}\n\n${article.content}`,
        isBot: true,
        timestamp: new Date(),
        category: article.category,
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 800)
  }

  const filteredArticles =
    activeCategory === "all" ? articles : articles.filter((article) => article.category === activeCategory)

  return (
    <div className={`${isDarkMode ? "dark" : ""}`}>
      {/* Video Intro Overlay */}
      {showIntroOverlay && (
        <div className={`fixed inset-0 z-50 bg-[#030d15] flex items-center justify-center transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <video
            autoPlay
            muted
            onEnded={() => {
              setFadeOut(true)
              setTimeout(() => setShowIntroOverlay(false), 1000)
            }}
            className="w-full h-full object-contain"
          >
            <source src="../images/Background2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto h-screen flex flex-col">
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg border-b border-gray-200 dark:border-gray-700 p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" style={{ color: "white" }} />}
                </Button>
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                    <Image
                      src="/images/Explor.png"
                      alt="Explor Logo"
                      width={32}
                      height={32}
                      className="w-6 h-6 md:w-8 md:h-8 object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    ExploAI
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Chameleon FCDS Intelligence Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Powered By AI</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white dark:bg-gray-800 shadow-lg flex overflow-hidden relative">
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
              border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 
              transition-transform duration-300 ease-in-out z-50 md:z-auto
            `}
            >
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">الأسئلة الشائعة</h3>
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 gap-1 mb-4 bg-white dark:bg-gray-800">
                    <TabsTrigger value="all" className="text-xs dark:data-[state=active]:bg-gray-700">
                      الكل
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="text-xs dark:data-[state=active]:bg-gray-700">
                      أسئلة
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-3 gap-1 bg-white dark:bg-gray-800">
                    <TabsTrigger value="courses" className="text-xs dark:data-[state=active]:bg-gray-700">
                      كورسات
                    </TabsTrigger>
                    <TabsTrigger value="internships" className="text-xs dark:data-[state=active]:bg-gray-700">
                      تدريب
                    </TabsTrigger>
                    <TabsTrigger value="grants" className="text-xs dark:data-[state=active]:bg-gray-700">
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
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] dark:bg-gray-800 dark:border-gray-700"
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
                              <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight">
                                {article.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {article.summary}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {article.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs px-2 py-0 dark:bg-gray-700 dark:text-gray-300"
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
                className="flex-1 p-3 md:p-6 overflow-y-auto scroll-smooth"
                style={{ scrollBehavior: "smooth" }}
              >
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-3 ${
                          message.isBot
                            ? "bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-100 dark:border-blue-800"
                            : "bg-gradient-to-r from-blue-500 to-green-600 text-white"
                        }`}
                      >
                        {message.isBot && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center">
                              <Image
                                src="/images/Explor.png"
                                alt="Explor"
                                width={12}
                                height={12}
                                className="w-3 h-3 object-contain"
                              />
                            </div>
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Explo</span>
                          </div>
                        )}
                        <div
                          className={`whitespace-pre-wrap text-sm md:text-base ${message.isBot ? "text-gray-800 dark:text-gray-200" : "text-white"}`}
                        >
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-2 ${message.isBot ? "text-gray-500 dark:text-gray-400" : "text-blue-100"}`}
                        >
                          {message.timestamp.toLocaleTimeString("ar-EG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl px-3 md:px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <Image
                              src="/images/nirve-logo.png"
                              alt="Nirve"
                              width={12}
                              height={12}
                              className="w-3 h-3 object-contain"
                            />
                          </div>
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Explo is typing...</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1" />
                </div>
              </div>

              {/* Mobile-only menu button */}
              <div className="md:hidden p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <Button
                  onClick={() => setIsSidebarOpen(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700"
                >
                  عرض قائمة الأسئلة الشائعة
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
