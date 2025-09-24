export interface ProcessedDocument {
  id: string
  name: string
  type: string
  size: number
  content: string
  chunks: string[]
  uploadedAt: Date
}

export interface DocumentChunk {
  id: string
  documentId: string
  content: string
  index: number
}

export class DocumentProcessor {
  private static instance: DocumentProcessor
  private documents: Map<string, ProcessedDocument> = new Map()

  static getInstance(): DocumentProcessor {
    if (!DocumentProcessor.instance) {
      DocumentProcessor.instance = new DocumentProcessor()
    }
    return DocumentProcessor.instance
  }

  async processFile(file: File): Promise<ProcessedDocument> {
    const content = await this.extractTextFromFile(file)
    const chunks = this.chunkText(content)

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

    this.documents.set(documentId, processedDoc)
    return processedDoc
  }

  getDocument(id: string): ProcessedDocument | undefined {
    return this.documents.get(id)
  }

  getAllDocuments(): ProcessedDocument[] {
    return Array.from(this.documents.values())
  }

  deleteDocument(id: string): boolean {
    return this.documents.delete(id)
  }

  private async extractTextFromFile(file: File): Promise<string> {
    const fileName = file.name.toLowerCase()

    try {
      if (fileName.endsWith(".txt") || fileName.endsWith(".py") || fileName.endsWith(".json")) {
        return await file.text()
      } else if (fileName.endsWith(".ipynb")) {
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

      // For PDF and PowerPoint, we'd need specialized libraries
      // For now, return a placeholder
      return `Content from ${file.name} - Advanced processing would be implemented here`
    } catch (error) {
      console.error("Error extracting text:", error)
      return "Error extracting text from file"
    }
  }

  private chunkText(text: string, chunkSize = 1000, overlap = 100): string[] {
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

  findRelevantChunks(query: string, documentId: string, maxChunks = 3): string[] {
    const document = this.documents.get(documentId)
    if (!document) return []

    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(" ").filter((word) => word.length > 2)

    const scoredChunks = document.chunks.map((chunk) => {
      const chunkLower = chunk.toLowerCase()
      let score = 0

      queryWords.forEach((word) => {
        const matches = (chunkLower.match(new RegExp(word, "g")) || []).length
        score += matches
      })

      return { chunk, score }
    })

    return scoredChunks
      .sort((a, b) => b.score - a.score)
      .slice(0, maxChunks)
      .map((item) => item.chunk)
  }
}
