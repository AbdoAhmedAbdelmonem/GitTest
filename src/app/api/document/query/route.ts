import { type NextRequest, NextResponse } from "next/server"

interface ProcessedDocument {
  id: string
  name: string
  type: string
  size: number
  content: string
  chunks: string[]
  uploadedAt: Date
}

// This should match the storage from upload route
// In production, this would be a shared database
const documents: Map<string, ProcessedDocument> = new Map()

function findRelevantChunks(query: string, document: ProcessedDocument, maxChunks = 3): string[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(" ").filter((word) => word.length > 2)

  // Score chunks based on keyword matches
  const scoredChunks = document.chunks.map((chunk) => {
    const chunkLower = chunk.toLowerCase()
    let score = 0

    queryWords.forEach((word) => {
      const matches = (chunkLower.match(new RegExp(word, "g")) || []).length
      score += matches
    })

    return { chunk, score }
  })

  // Sort by score and return top chunks
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((item) => item.chunk)
}

function generateResponse(query: string, relevantChunks: string[], documentName: string): string {
  const queryLower = query.toLowerCase()

  if (relevantChunks.length === 0) {
    return `لم أجد معلومات ذات صلة بسؤالك في الملف "${documentName}". يمكنك تجربة إعادة صياغة السؤال أو سؤالي عن موضوع آخر من الملف.`
  }

  const context = relevantChunks.join("\n\n")

  if (queryLower.includes("لخص") || queryLower.includes("ملخص") || queryLower.includes("summary")) {
    return `ملخص من الملف "${documentName}":\n\n${context.substring(0, 500)}...\n\nهذا ملخص للأجزاء الأكثر صلة بطلبك. يمكنك سؤالي أسئلة أكثر تحديداً.`
  }

  if (queryLower.includes("اشرح") || queryLower.includes("وضح") || queryLower.includes("explain")) {
    return `شرح من الملف "${documentName}":\n\n${context.substring(0, 600)}...\n\nهل تريد المزيد من التفاصيل حول نقطة معينة؟`
  }

  if (queryLower.includes("كيف") || queryLower.includes("ازاي") || queryLower.includes("how")) {
    return `بناءً على محتوى الملف "${documentName}":\n\n${context.substring(0, 500)}...\n\nهذه هي المعلومات المتاحة حول كيفية تنفيذ ما تسأل عنه.`
  }

  // Default response
  return `من الملف "${documentName}":\n\n${context.substring(0, 600)}...\n\nهل هذا يجيب على سؤالك؟ يمكنك سؤالي المزيد من الأسئلة حول هذا الملف.`
}

export async function POST(request: NextRequest) {
  try {
    const { query, documentId } = await request.json()

    if (!query || !documentId) {
      return NextResponse.json({ error: "Query and document ID are required" }, { status: 400 })
    }

    const document = documents.get(documentId)
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    // Find relevant chunks
    const relevantChunks = findRelevantChunks(query, document)

    // Generate response
    const response = generateResponse(query, relevantChunks, document.name)

    return NextResponse.json({
      success: true,
      response,
      documentName: document.name,
      chunksUsed: relevantChunks.length,
    })
  } catch (error) {
    console.error("Query error:", error)
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 })
  }
}

