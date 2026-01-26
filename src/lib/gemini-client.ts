interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    }
  }>
}

interface GeminiError {
  error: {
    code: number
    message: string
    status: string
    details?: Array<{
      "@type": string
      retryDelay?: string
    }>
  }
}

export class GeminiClient {
  private apiKey: string
  private baseUrl = "https://generativelanguage.googleapis.com/v1beta/models"

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private parseRetryDelay(retryDelay?: string): number {
    if (!retryDelay) return 5000 // Default 5 seconds
    const match = retryDelay.match(/(\d+)s/)
    return match ? Number.parseInt(match[1]) * 1000 : 5000
  }

  async generateText(prompt: string, model = "gemini-1.5-flash", retryCount = 0): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/${model}:generateContent?key=${this.apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (!response.ok) {
        const errorData: GeminiError = await response.json()
        console.error("Gemini API error details:", JSON.stringify(errorData, null, 2))

        if (errorData.error.code === 503) {
          if (retryCount < 3) {
            // Retry up to 3 times for service unavailable
            const delayMs = Math.min(1000 * Math.pow(2, retryCount), 10000) // Exponential backoff, max 10s
            console.log(`[v0] Service overloaded, retrying in ${delayMs}ms... (attempt ${retryCount + 1}/3)`)
            await this.delay(delayMs)
            return this.generateText(prompt, model, retryCount + 1)
          } else {
            return `عذراً، الخدمة محملة بشكل زائد حالياً. يرجى المحاولة مرة أخرى بعد قليل.

🔄 تفاصيل الخطأ: النموذج ${model} غير متاح مؤقتاً
⏰ يرجى الانتظار بضع دقائق قبل المحاولة مرة أخرى
💡 نصيحة: جرب نموذج آخر أو قم بتبسيط طلبك`
          }
        }

        if (errorData.error.code === 429) {
          const retryDelay = errorData.error.details?.find((d) => d.retryDelay)?.retryDelay
          const delayMs = this.parseRetryDelay(retryDelay)

          if (retryCount < 2) {
            // Retry up to 2 times
            console.log(`[v0] Quota exceeded, retrying in ${delayMs}ms...`)
            await this.delay(delayMs)
            return this.generateText(prompt, model, retryCount + 1)
          } else {
            return `عذراً، تم تجاوز الحد المسموح لاستخدام الذكاء الاصطناعي. يرجى المحاولة مرة أخرى بعد دقيقة. 

📊 تفاصيل الخطأ: تم استنفاد الحصة المجانية للنموذج ${model}
⏰ يرجى الانتظار قليلاً قبل إرسال رسائل جديدة
💡 نصيحة: حاول استخدام رسائل أقصر لتوفير الاستهلاك`
          }
        }

        if (errorData.error.code === 400) {
          return "عذراً، هناك خطأ في تنسيق الطلب. يرجى المحاولة مرة أخرى."
        }

        if (errorData.error.code === 403) {
          return "عذراً، مفتاح API غير صالح أو منتهي الصلاحية. يرجى التحقق من الإعدادات."
        }

        throw new Error(`Gemini API error: ${response.status} - ${errorData.error.message}`)
      }

      const data: GeminiResponse = await response.json()
      return data.candidates[0]?.content?.parts[0]?.text || "عذراً، لم أتمكن من إنتاج رد مناسب."
    } catch (error) {
      console.error("Gemini API error:", error)
      if (error instanceof Error && error.message.includes("fetch")) {
        return "عذراً، لا يمكنني الاتصال بخدمة الذكاء الاصطناعي حالياً. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
      }
      return "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
    }
  }

  async analyzeDocument(content: string, question: string, model = "gemini-1.5-flash"): Promise<string> {
    const prompt = `
أنت مساعد ذكي متخصص في تحليل الوثائق باللغة العربية. قم بتحليل المحتوى التالي والإجابة على السؤال:

المحتوى:
${content}

السؤال: ${question}

يرجى تقديم إجابة شاملة ومفيدة باللغة العربية.
`
    return this.generateText(prompt, model)
  }
}

export const geminiClient = new GeminiClient("AIzaSyBybJ9mJVfysOuu2_ecTvS97DDg_TdezMI")

