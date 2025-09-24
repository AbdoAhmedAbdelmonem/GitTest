export interface DocumentUploadResponse {
  status: string
  message: string
  document_id: string
  chunks: number
}

export interface QueryRequest {
  question: string
  language: string
  model: string
}

export interface QueryResponse {
  answer: string
  sources: string[]
  confidence: number
  model_used?: string
  error?: string
}

export class PythonBackendClient {
  private baseUrl: string

  constructor(baseUrl = "http://localhost:8000") {
    this.baseUrl = baseUrl
  }

  async uploadDocument(file: File): Promise<DocumentUploadResponse> {
    const formData = new FormData()
    formData.append("file", file)

    const response = await fetch(`${this.baseUrl}/upload-document`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return response.json()
  }

  async queryDocuments(request: QueryRequest): Promise<QueryResponse> {
    const response = await fetch(`${this.baseUrl}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`Query failed: ${response.statusText}`)
    }

    return response.json()
  }

  async listDocuments(): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/documents`)

    if (!response.ok) {
      throw new Error(`Failed to list documents: ${response.statusText}`)
    }

    const result = await response.json()
    return result.documents
  }

  async deleteDocument(documentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.statusText}`)
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`)
      return response.ok
    } catch {
      return false
    }
  }
}

export const pythonBackend = new PythonBackendClient()
