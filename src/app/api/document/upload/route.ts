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

// In-memory storage for demo (in production, use a database)
const documents: Map<string, ProcessedDocument> = new Map()

async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase()

  try {
    if (fileName.endsWith(".txt") || fileName.endsWith(".py") || fileName.endsWith(".json")) {
      return await file.text()
    } else if (fileName.endsWith(".pdf")) {
      // For PDF processing, we'd use a library like pdf-parse
      // For now, return placeholder text
      const text = await file.text()
      return `PDF Content: ${text.substring(0, 1000)}...`
    } else if (fileName.endsWith(".pptx") || fileName.endsWith(".ppt")) {
      // For PowerPoint processing, we'd use a library like officegen
      // For now, return placeholder text
      return `PowerPoint Content: ${file.name} - Slides content would be extracted here...`
    } else if (fileName.endsWith(".ipynb")) {
      // Parse Jupyter notebook JSON
      const content = await file.text()
      try {
        const notebook = JSON.parse(content)
        let extractedText = ""

        if (notebook.cells) {
          notebook.cells.forEach((cell: any) => {
            if (cell.cell_type === "code" && cell.source) {
              extractedText += `Code Cell:\n${Array.isArray(cell.source) ? cell.source.join("") : cell.source}\n\n`
            } else if (cell.cell_type === "markdown" && cell.source) {
              extractedText += `Markdown Cell:\n${Array.isArray(cell.source) ? cell.source.join("") : cell.source}\n\n`
            }
          })
        }

        return extractedText || "No content found in notebook"
      } catch (error) {
        return "Error parsing Jupyter notebook"
      }
    }

    return "Unsupported file type"
  } catch (error) {
    console.error("Error extracting text:", error)
    return "Error extracting text from file"
  }
}

function chunkText(text: string, chunkSize = 1000, overlap = 100): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.substring(start, end))
    start = end - overlap

    if (start >= text.length) break
  }

  return chunks
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [".pdf", ".pptx", ".ppt", ".txt", ".py", ".ipynb", ".json"]
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf("."))

    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        {
          error: "Unsupported file type. Supported types: PDF, PowerPoint, Text, Python, Jupyter Notebook",
        },
        { status: 400 },
      )
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Maximum size is 10MB" }, { status: 400 })
    }

    // Extract text content
    const content = await extractTextFromFile(file)

    // Create chunks
    const chunks = chunkText(content)

    // Create document record
    const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const processedDoc: ProcessedDocument = {
      id: documentId,
      name: file.name,
      type: file.type || "unknown",
      size: file.size,
      content,
      chunks,
      uploadedAt: new Date(),
    }

    // Store document (in production, save to database)
    documents.set(documentId, processedDoc)

    return NextResponse.json({
      success: true,
      document: {
        id: processedDoc.id,
        name: processedDoc.name,
        type: processedDoc.type,
        size: processedDoc.size,
        chunksCount: chunks.length,
        uploadedAt: processedDoc.uploadedAt,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

export async function GET() {
  // Return list of uploaded documents
  const documentList = Array.from(documents.values()).map((doc) => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    chunksCount: doc.chunks.length,
    uploadedAt: doc.uploadedAt,
  }))

  return NextResponse.json({ documents: documentList })
}

