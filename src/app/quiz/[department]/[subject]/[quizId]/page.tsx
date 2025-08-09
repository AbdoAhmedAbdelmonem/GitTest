"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { departmentData } from "@/lib/department-data"
import QuizInterface from "@/components/quiz-system/quiz-interface"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const [quizData, setQuizData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const { department, subject, quizId } = params
    
    try {
      const dept = departmentData[department as string]
      if (!dept) {
        throw new Error("Department not found")
      }

      // Find the subject across all levels and terms
      let foundSubject = null
      let foundQuiz = null

      for (const level of Object.values(dept.levels)) {
        const allSubjects = [...level.subjects.term1, ...level.subjects.term2]
        foundSubject = allSubjects.find(s => s.id === subject)
        
        if (foundSubject && foundSubject.materials.quizzes) {
          foundQuiz = foundSubject.materials.quizzes.find((q: any) => q.id === quizId)
          if (foundQuiz) break
        }
      }

      if (!foundSubject || !foundQuiz) {
        throw new Error("Quiz not found")
      }

      setQuizData({
        ...foundQuiz,
        subjectName: foundSubject.name,
        departmentName: dept.name
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [params])

  const handleExit = () => {
    router.push(`/specialization/${params.department}/${params.subject}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading quiz...</div>
      </div>
    )
  }

  if (error || !quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <CardTitle>Quiz Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-white/70">
              {error || "The requested quiz could not be found."}
            </p>
            <Button
              onClick={handleExit}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <QuizInterface quizData={quizData} onExit={handleExit} />
}
