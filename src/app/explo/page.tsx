"use client"

import { Rubik } from 'next/font/google'
import { useState, useRef, useEffect } from "react"
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
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import articlesData from "@/data/articles.json"
import Image from "next/image"

const rubik = Rubik({ subsets: ['latin'] })

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
      content: "مرحباً! أنا Explo، المساعد الافتراضي لموقع Chameleon FCDS. كيف يمكنني مساعدتك اليوم؟ يمكنك البدء بسؤالي عن الكورسات، التدريبات او اختيار احد المواضيع المحفوظة في قاعدة بياناتي من القائمة علي اليمين.",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      return "نعم، أنا Explo! المساعد الذكي الرسمي لموقع Chameleon FCDS. كيف يمكنني مساعدتك؟ 😊"
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
      return "أهلاً وسهلاً بك في Chameleon FCDS! أنا مساعدك الذكي . يمكنني مساعدتك في أي استفسار حول الكلية، الكورسات، التدريبات، أو المنح. ما الذي تريد معرفته؟"
    }

    if (lowerMessage.includes("شكرا") || lowerMessage.includes("تسلم")) {
      return "العفو! سعيد لأنني استطعت مساعدتك في Chameleon FCDS. إذا كان لديك أي أسئلة أخرى، لا تتردد في سؤالي! 😊"
    }

    if (lowerMessage.includes("مساعدة") || lowerMessage.includes("help")) {
      return "بالطبع! كمساعد Chameleon FCDS الرسمي، يمكنني مساعدتك في:\n\n🔹 الأسئلة الشائعة للطلبة الجدد\n🔹 الكورسات المهمة والتقنيات\n🔹 فرص التدريب والتدريبات العملية\n🔹 المنح المحلية والعالمية\n\nما الموضوع الذي يهمك؟"
    }

    return 'عذراً، لم أجد معلومات محددة حول هذا الموضوع في قاعدة بيانات Chameleon FCDS الحالية. يمكنك تجربة:\n\n• إعادة صياغة السؤال بطريقة أخرى\n• اختيار فئة محددة من التبويبات أعلاه\n• سؤالي عن الكورسات، التدريبات، أو المنح\n\nأو يمكنك كتابة "مساعدة" لرؤية ما يمكنني مساعدتك فيه! 🤔'
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(inputValue),
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
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
    <div className={`${rubik.className} dark`}>
      {/* Custom scrollbar styles for chat area */}
      <style jsx>{`
        .chat-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .chat-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
        }
      `}</style>
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
            <source src="/images/Background2.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      
      <div className="min-h-screen bg-[#030303] overflow-hidden"
        style={{
          backgroundImage: "url('/images/Background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />
        <div className="max-w-7xl mx-auto h-screen flex flex-col">
          <div className="bg-white/[0.02] border-b border-white/[0.08] backdrop-blur-sm p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
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
                  <p className="text-xs md:text-sm text-white/60">Chameleon FCDS ChatBot Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm text-white/60">Powered By FCDS (اللائحة الداخلية و اراء الطلبة السابقين)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-white/[0.02] border-white/[0.08] backdrop-blur-sm flex overflow-hidden relative">
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
              border-l border-white/[0.08] bg-white/[0.02] backdrop-blur-sm 
              transition-transform duration-300 ease-in-out z-50 md:z-auto
            `}
            >
              <div className="p-4">
                <h3 className="font-semibold text-white mb-4">الفئات السريعة</h3>
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 gap-1 mb-4 bg-white/[0.02] border-white/[0.08] backdrop-blur-sm">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-white/[0.05] data-[state=active]:text-white">
                      الكل
                    </TabsTrigger>
                    <TabsTrigger value="faq" className="text-xs data-[state=active]:bg-white/[0.05] data-[state=active]:text-white">
                      أسئلة
                    </TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-3 gap-1 bg-white/[0.02] border-white/[0.08] backdrop-blur-sm">
                    <TabsTrigger value="courses" className="text-xs data-[state=active]:bg-white/[0.05] data-[state=active]:text-white">
                      كورسات
                    </TabsTrigger>
                    <TabsTrigger value="internships" className="text-xs data-[state=active]:bg-white/[0.05] data-[state=active]:text-white">
                      تدريب
                    </TabsTrigger>
                    <TabsTrigger value="grants" className="text-xs data-[state=active]:bg-white/[0.05] data-[state=active]:text-white">
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
                        className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.15] backdrop-blur-sm"
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
                              <h4 className="font-medium text-sm text-white line-clamp-2 leading-tight">
                                {article.title}
                              </h4>
                              <p className="text-xs text-white/60 mt-1 line-clamp-2">
                                {article.summary}
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {article.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs px-2 py-0 bg-white/[0.03] border-white/[0.1] text-white/60"
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
                style={{ scrollBehavior: "smooth" }}
              >
                <div className="space-y-4 max-w-4xl mx-auto">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-3 md:px-4 py-3 ${
                          message.isBot
                            ? "bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm"
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
                            <span className="text-xs font-medium text-white/70">Explo</span>
                          </div>
                        )}
                        <div
                          className={`whitespace-pre-wrap text-sm md:text-base ${message.isBot ? "text-white" : "text-white"}`}
                        >
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-2 ${message.isBot ? "text-white/60" : "text-blue-100"}`}
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
                      <div className="bg-white/[0.02] border border-white/[0.08] backdrop-blur-sm rounded-2xl px-3 md:px-4 py-3">
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
                          <span className="text-xs font-medium text-white/70">Explo is typing...</span>
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

              <div className="border-t border-white/[0.08] p-3 md:p-4 bg-white/[0.02] backdrop-blur-sm">
                <div className="flex gap-2 md:gap-3 max-w-4xl mx-auto">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="اكتب سؤالك هنا... أو قل 'Explo' لاستدعائي"
                      className="pl-10 md:pl-12 pr-4 py-2 md:py-3 rounded-xl border-2 border-white/[0.08] focus:border-white/[0.15] transition-colors bg-white/[0.02] text-white placeholder-white/40 backdrop-blur-sm text-sm md:text-base"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute left-1 md:left-2 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6 md:h-8 md:w-8"
                    >
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 rounded-xl"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
                <p className="text-xs text-white/60 mt-2 text-center max-w-4xl mx-auto">
                  اضغط على أي سؤال من الجانب أو اكتب سؤالك الخاص
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
