import { type NextRequest, NextResponse } from "next/server"
import articlesData from "@/data/articles.json"

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

interface ChatRequest {
  message: string
  documentId?: string
  conversationHistory?: Array<{
    role: "user" | "assistant"
    content: string
  }>
}

const articles = articlesData as Article[]

function generateChatResponse(message: string, documentId?: string): string {
  const lowerMessage = message.toLowerCase()

  // Handle Explo/EXPLO name recognition
  if (
    lowerMessage.includes("إكسبلو") ||
    lowerMessage.includes("explo") ||
    lowerMessage.includes("إكسبلور") ||
    lowerMessage.includes("explor")
  ) {
    return "نعم، أنا إكسبلو! المساعد الذكي الرسمي لموقع Chameleon FCDS. كيف يمكنني مساعدتك؟ 😊"
  }

  // Handle greetings
  if (
    lowerMessage.includes("مرحبا") ||
    lowerMessage.includes("السلام") ||
    lowerMessage.includes("أهلا") ||
    lowerMessage.includes("hello")
  ) {
    return "أهلاً وسهلاً بك في Chameleon FCDS! أنا إكسبلو مساعدك الذكي الرسمي. يمكنني مساعدتك في أي استفسار حول الكلية، الكورسات، التدريبات، أو المنح. كما يمكنني تحليل الملفات التي ترفقها! ما الذي تريد معرفته؟"
  }

  // Handle thanks
  if (lowerMessage.includes("شكرا") || lowerMessage.includes("تسلم") || lowerMessage.includes("thank")) {
    return "العفو! سعيد لأنني استطعت مساعدتك في Chameleon FCDS. إذا كان لديك أي أسئلة أخرى أو ملفات تريد تحليلها، لا تتردد في سؤالي! 😊"
  }

  // Handle help requests
  if (lowerMessage.includes("مساعدة") || lowerMessage.includes("help")) {
    return "بالطبع! كمساعد Chameleon FCDS الرسمي، يمكنني مساعدتك في:\n\n🔹 الأسئلة الشائعة للطلبة الجدد\n🔹 الكورسات المهمة والتقنيات\n🔹 فرص التدريب والتدريبات العملية\n🔹 المنح المحلية والعالمية\n🔹 تحليل الملفات (PDF، PowerPoint، Python، إلخ)\n\nما الموضوع الذي يهمك؟"
  }

  // Search through articles for relevant content
  const relevantArticles = articles.filter((article) => {
    const searchText = `${article.title} ${article.content} ${article.tags.join(" ")}`.toLowerCase()
    const words = lowerMessage.split(" ")
    return words.some((word) => word.length > 2 && searchText.includes(word))
  })

  if (relevantArticles.length > 0) {
    const bestMatch = relevantArticles[0]

    if (
      lowerMessage.includes("إيه") ||
      lowerMessage.includes("ما هو") ||
      lowerMessage.includes("ما هي") ||
      lowerMessage.includes("what")
    ) {
      return `بناءً على معرفتي في Chameleon FCDS، ${bestMatch.summary}\n\n${bestMatch.content.substring(0, 300)}...`
    } else if (lowerMessage.includes("كيف") || lowerMessage.includes("ازاي") || lowerMessage.includes("how")) {
      return `إليك الطريقة:\n\n${bestMatch.content.substring(0, 400)}...`
    } else if (lowerMessage.includes("هل") || lowerMessage.includes("ممكن") || lowerMessage.includes("can")) {
      return `نعم، ${bestMatch.summary}\n\nتفاصيل أكثر: ${bestMatch.content.substring(0, 300)}...`
    } else {
      return `${bestMatch.summary}\n\n${bestMatch.content.substring(0, 350)}...`
    }
  }

  // Default response when no relevant content is found
  return 'عذراً، لم أجد معلومات محددة حول هذا الموضوع في قاعدة بيانات Chameleon FCDS الحالية. يمكنك تجربة:\n\n• إعادة صياغة السؤال بطريقة أخرى\n• اختيار فئة محددة من التبويبات\n• سؤالي عن الكورسات، التدريبات، أو المنح\n• إرفاق ملف لتحليله\n\nأو يمكنك كتابة "مساعدة" لرؤية ما يمكنني مساعدتك فيه! 🤔'
}

export async function POST(request: NextRequest) {
  try {
    const { message, documentId, conversationHistory }: ChatRequest = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate response based on message and context
    const response = generateChatResponse(message, documentId)

    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}

