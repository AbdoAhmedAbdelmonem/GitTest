"use client"

import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Send, Star, Loader2, Globe } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ToastProvider"

type QType = "radio" | "checkbox" | "textarea" | "radio-other" | "text-input" | "rating"
interface Question {
  id: string
  section: string
  type: QType
  label: string
  sub: string
  options?: readonly string[]
  placeholder?: string
  required: boolean
  accent: string
  accent2: string
  inputType?: string
  minLabel?: string
  maxLabel?: string
}

const ALL_STEPS: Question[] = [
  {
    id: "demo-name", section: "Tell Us About You", type: "text-input",
    label: "What is\nyour name?",
    sub: "Used only for the prize draw. You can skip this.",
    placeholder: "Your name",
    inputType: "text",
    required: false,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-phone", section: "Tell Us About You", type: "text-input",
    label: "What is your\nphone number?",
    sub: "So we can contact you if you win. You can skip this.",
    placeholder: "Phone number",
    inputType: "tel",
    required: false,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-gender", section: "Tell Us About You", type: "radio",
    label: "What is\nyour gender?",
    sub: "",
    options: ["Male", "Female"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-education", section: "Tell Us About You", type: "radio",
    label: "What is your current\neducational status?",
    sub: "",
    options: ["High School", "University", "Graduated"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-field", section: "Tell Us About You", type: "radio-other",
    label: "What is your\nfield of study?",
    sub: "",
    options: ["Data Science", "Engineering", "Medicine", "Business", "Arts", "Other"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },

  {
    id: "q1", section: "1 · General Perception", type: "radio",
    label: "Do you like the writing style\nof Artificial Intelligence (AI)?",
    sub: "",
    options: ["I like it very much", "I somewhat like it", "Neutral", "I don't like it", "I prefer not to use it"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q2", section: "1 · General Perception", type: "radio",
    label: "Can you differentiate between\nHuman writing and AI writing?",
    sub: "",
    options: ["Always", "Often", "Sometimes", "Rarely", "I can't tell the difference"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q3", section: "1 · General Perception", type: "radio",
    label: "Which writing style gives\nyou more trust?",
    sub: "",
    options: ["Human writing", "AI writing", "Both equally", "It depends on the topic"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q4", section: "1 · General Perception", type: "radio",
    label: "Do you think AI can convey\nemotions in writing?",
    sub: "",
    options: ["Yes, to a great extent", "Yes, to a moderate extent", "To a limited extent", "No, it cannot convey emotions", "Not sure"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q5", section: "1 · General Perception", type: "radio",
    label: "Do you think AI can be\nrelied upon in writing?",
    sub: "",
    options: ["Only in formal writing", "Only in informal writing", "In both", "It cannot be relied upon"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },

  {
    id: "q6", section: "2 · Evaluation", type: "rating",
    label: "Rate AI writing in\nemotionally related topics.",
    sub: "Select a rating from 1 to 5.",
    minLabel: "Not effective", maxLabel: "Very effective",
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q7", section: "2 · Evaluation", type: "rating",
    label: "Rate AI writing in\ncomplex topics.",
    sub: "Select a rating from 1 to 5.",
    minLabel: "Not effective", maxLabel: "Very effective",
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q8", section: "2 · Evaluation", type: "checkbox",
    label: "What are the main advantages\nof using AI in writing?",
    sub: "Select all that apply.",
    options: ["Speed in completing tasks", "Saving effort", "Language formulation/style", "Improves grammar accuracy", "Helps generate ideas"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q9", section: "2 · Evaluation", type: "checkbox",
    label: "What qualities does human writing\nhave that AI lacks?",
    sub: "Select all that apply.",
    options: ["Genuine emotional expression", "Personal creativity", "Human experience", "Deep contextual understanding", "Unique personal style"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q10", section: "2 · Evaluation", type: "checkbox",
    label: "Which AI tools do you\nuse for writing?",
    sub: "Select all that apply.",
    options: ["ChatGPT", "Grammarly", "Notion AI", "Google Gemini", "Microsoft Copilot", "QuillBot","Anthropic Claude", "I do not use AI tools"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q11", section: "2 · Evaluation", type: "rating",
    label: "How would you rate the\ncreativity of AI in writing?",
    sub: "Select a rating from 1 to 5.",
    minLabel: "Very low", maxLabel: "Very high",
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q12", section: "2 · Evaluation", type: "radio",
    label: "Do you expect AI to replace\nhumans in writing in the future?",
    sub: "",
    options: ["Yes, completely", "Partially", "Only in certain fields", "No", "Not sure"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q13", section: "2 · Evaluation", type: "radio",
    label: "Do you feel that AI writing\nis sometimes repetitive?",
    sub: "",
    options: ["Always", "Often", "Sometimes", "Rarely", "I don’t feel that"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q14", section: "2 · Evaluation", type: "radio",
    label: "Does AI writing\nneed editing?",
    sub: "",
    options: ["Always", "Often", "Sometimes", "Rarely", "I have never used it"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q15", section: "2 · Evaluation", type: "checkbox",
    label: "What most distinguishes\nhuman writing?",
    sub: "Select all that apply.",
    options: ["Emotional expression", "Personal style", "Creativity and imagination", "Writer’s experience and contextual understanding", "Informal writing style"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q16", section: "2 · Evaluation", type: "radio",
    label: "Who makes\nmore mistakes?",
    sub: "",
    options: ["Humans", "AI", "Both equally", "I don’t know"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },

  {
    id: "q17", section: "3 · Open-Ended", type: "textarea",
    label: "Do you think human writing\nhas flaws?",
    sub: "Share your thoughts.",
    placeholder: "Write your answer here…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q18", section: "3 · Open-Ended", type: "textarea",
    label: "What is the biggest difference between\nhuman writing and AI writing for you?",
    sub: "Share your perspective.",
    placeholder: "Write your answer here…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q19", section: "3 · Open-Ended", type: "textarea",
    label: "What are the disadvantages\nof AI writing?",
    sub: "Share your thoughts.",
    placeholder: "Write your answer here…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q20", section: "3 · Open-Ended", type: "textarea",
    label: "Any additional\ncomments?",
    sub: "This question is optional.",
    placeholder: "Write anything you'd like to add…",
    required: false,
    accent: "#ec4899", accent2: "#f97316",
  },
]

const DEMO_COUNT = 5
const TOTAL = ALL_STEPS.length
type AnswerVal = string | string[] | number

const FORM_BASE = "https://docs.google.com/forms/d/e/1FAIpQLSccLnBUzkM_m-vynoPJCK7YQm6I1UrHDOwpfBSY13itquf5hw/formResponse"
const FORM_MAP: Record<string, string> = {
  "demo-name":  "entry.370956578",
  "demo-phone": "entry.968909870",
  "demo-gender": "entry.263172818",
  "demo-education": "entry.235049594",
  "demo-field": "entry.1219083178",
  q1: "entry.972993282",
  q2: "entry.1741197498",
  q3: "entry.1380048267",
  q4: "entry.483864413",
  q5: "entry.920271814",
  q6: "entry.910298884",
  q7: "entry.1737461253",
  q8: "entry.906059351",
  q9: "entry.763758449",
  q10: "entry.846490920",
  q11: "entry.661497356",
  q12: "entry.1911349500",
  q13: "entry.815641367",
  q14: "entry.839296493",
  q15: "entry.237650546",
  q16: "entry.852766328",
  q17: "entry.900499563",
  q18: "entry.820612214",
  q19: "entry.419722609",
  q20: "entry.1505558509",
}

function buildGoogleFormUrl(answers: Record<string, AnswerVal>, otherText: string): string {
  const params = new URLSearchParams()
  for (const [qId, entryId] of Object.entries(FORM_MAP)) {
    const val = answers[qId]
    if (val === undefined || val === null || val === "") continue
    if (Array.isArray(val)) {
      for (const v of val) params.append(entryId, v)
    } else if (typeof val === "number") {
      params.append(entryId, String(val))
    } else {
      if (qId === "demo-field" && val === "Other" && otherText.trim()) {
        params.append(entryId, otherText.trim())
      } else {
        params.append(entryId, val)
      }
    }
  }
  return `${FORM_BASE}?${params.toString()}`
}

const Pill = memo(function Pill({ label, selected, accent, onClick }: {
  label: string; selected: boolean; accent: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="px-5 py-3 rounded-full text-sm md:text-base font-medium transition-[border-color,background,color,box-shadow] duration-200 outline-none text-left"
      style={{
        border: `2px solid ${selected ? accent : "rgba(255,255,255,0.12)"}`,
        background: selected ? `${accent}22` : "rgba(255,255,255,0.04)",
        color: selected ? "#fff" : "rgba(255,255,255,0.55)",
        boxShadow: selected ? `0 0 20px ${accent}44` : "none",
      }}
    >
      {label}
    </button>
  )
})

const RatingScale = memo(function RatingScale({ value, onChange, minLabel, maxLabel, accent, accent2 }: {
  value: number | null; onChange: (v: number) => void
  minLabel: string; maxLabel: string; accent: string; accent2: string
}) {
  return (
    <div>
      <div className="flex gap-3 mt-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            className="flex-1 h-14 md:h-16 rounded-2xl font-bold text-lg md:text-xl transition-[transform,background,box-shadow,color] duration-150"
            style={
              value === n
                ? { background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff", boxShadow: `0 6px 24px ${accent}55`, transform: "scale(1.08)" }
                : { background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
            }
          >
            {n}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-xs text-white/35 font-medium">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
})

const ProgressBar = memo(function ProgressBar({ step, accent, accent2 }: { step: number; accent: string; accent2: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
      <motion.div
        className="h-full"
        initial={false}
        animate={{ width: `${(step / TOTAL) * 100}%` }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ background: `linear-gradient(90deg,${accent},${accent2})`, willChange: "width" }}
      />
    </div>
  )
})

const SLIDE   = { initial: { opacity: 0, x: 70 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -70 } }
const FADE_UP = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } }
const DUR     = { duration: 0.36, ease: [0.16, 1, 0.3, 1] } as const

export default function SurveyPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerVal>>({})
  const [otherText, setOtherText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { addToast } = useToast()

  const q: Question | null = step >= 1 && step <= TOTAL ? ALL_STEPS[step - 1] : null
  const answer = q ? answers[q.id] : undefined

  const canProceed = !q
    || (q.type === "radio"       && typeof answer === "string" && answer.length > 0)
    || (q.type === "radio-other" && typeof answer === "string" && answer.length > 0 && (answer !== "Other" || otherText.trim().length > 0))
    || (q.type === "checkbox"    && Array.isArray(answer) && (answer as string[]).length > 0)
    || (q.type === "textarea"    && !q.required)
    || (q.type === "textarea"    && q.required && typeof answer === "string" && (answer as string).trim().length >= 5)
    || (q.type === "text-input"  && !q.required) // name/phone are optional — always can proceed
    || (q.type === "text-input"  && q.required && typeof answer === "string" && (answer as string).trim().length > 0)
    || (q.type === "rating"      && typeof answer === "number")

  const setAnswer = useCallback((val: AnswerVal) => {
    if (!q) return
    setAnswers((prev) => ({ ...prev, [q.id]: val }))
  }, [q])

  const handleNext = useCallback(async () => {
    if (q?.id === "demo-education" && answers["demo-education"] === "High School") {
      setAnswers((prev) => ({ ...prev, "demo-field": "Not specialized" }))
      setStep((s) => s + 2)
      return
    }

    if (step < TOTAL) { setStep((s) => s + 1); return }
    setSubmitting(true)
    try {
      const params = new URLSearchParams()
      for (const [qId, entryId] of Object.entries(FORM_MAP)) {
        const val = answers[qId]
        if (val === undefined || val === null || val === "") continue
        if (Array.isArray(val)) {
          for (const v of val) params.append(entryId, v)
        } else if (typeof val === "number") {
          params.append(entryId, String(val))
        } else {
          let finalVal = val as string
          if (qId === "demo-field" && val === "Other" && otherText.trim()) finalVal = otherText.trim()
          else if (qId === "demo-field" && val === "Not specialized") finalVal = ""
          params.append(entryId, finalVal)
        }
      }
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        body: params.toString(),
      })

      if (!res.ok) throw new Error("Submission failed")

      addToast("Response sent! Your answers have been recorded successfully.", "success")
    } catch {
      addToast("Submission issue. Your answers may not have been recorded. Please try again.", "error")
    }
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setStep(TOTAL + 1)
  }, [step, answers, otherText])

  const handleBack = useCallback(() => {
    const q1Index = ALL_STEPS.findIndex(s => s.id === "q1") + 1
    if (step === q1Index && answers["demo-education"] === "High School") {
      setStep((s) => Math.max(s - 2, 0))
    } else {
      setStep((s) => Math.max(s - 1, 0))
    }
  }, [step, answers])

  const accent  = q?.accent  ?? "#7c3aed"
  const accent2 = q?.accent2 ?? "#db2777"

  const stepDisplay = q
    ? q.section === "Tell Us About You"
      ? { label: q.section, counter: `${step} / ${DEMO_COUNT}` }
      : { label: q.section, counter: `${step - DEMO_COUNT} / ${TOTAL - DEMO_COUNT}` }
    : null

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-outfit" style={{ background: "#070710" }}>

      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[120px] opacity-25 survey-blob-1"
        style={{ width: 600, height: 600, background: `radial-gradient(circle,${accent},transparent 70%)`, top: "-15%", right: "-8%", willChange: "transform" }} />
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[100px] opacity-15 survey-blob-2"
        style={{ width: 500, height: 500, background: `radial-gradient(circle,${accent2},transparent 70%)`, bottom: "-10%", left: "-5%", willChange: "transform" }} />

      <a href="/survey/ar"
        className="fixed top-5 right-5 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-white/80 hover:border-white/25 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
        title="عربي"
        dir="rtl">
        <Globe className="w-4.5 h-4.5" />
      </a>

      {step >= 1 && step <= TOTAL && <ProgressBar step={step} accent={accent} accent2={accent2} />}

      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-28 py-20">
        <AnimatePresence mode="wait" initial={false}>

          {step === 0 && (
            <motion.div key="intro" {...FADE_UP} transition={DUR}>
              <div className="flex items-center gap-2 mb-6">
                <Image src="/images/1212-removebg-preview.png" alt="Chameleon" width={22} height={22} className="object-contain" />
                <p className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: "#a855f7" }}>
                  Chameleon Survey 2026
                </p>
              </div>
              <h1 className="font-extrabold leading-[0.93] tracking-tight text-white mb-4" style={{ fontSize: "clamp(2.4rem,7vw,6.5rem)" }}>
                AI Writing vs<br />
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)" }}>
                  Human Writing.
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/50 max-w-xl mb-3 leading-relaxed font-light">
                <span className="font-semibold text-white/70">Perception Survey</span> — This survey aims to explore people&apos;s perceptions of Artificial Intelligence (AI) writing compared to human writing.
              </p>
              <p className="text-sm text-white/30 max-w-xl mb-8 leading-relaxed font-light">
                Your responses are anonymous and will be used for academic purposes only.
              </p>

              <div className="flex flex-wrap gap-2 mb-12">
                {["Tell Us About You", "1 · General Perception", "2 · Evaluation", "3 · Open-Ended"].map((s) => (
                  <span key={s} className="text-xs font-medium px-3 py-1 rounded-full border border-white/10 text-white/40">
                    {s}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-4 text-white font-bold text-xl md:text-2xl px-10 py-5 rounded-2xl transition-transform duration-200 hover:scale-[1.04] active:scale-95"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}
              >
                Begin Survey <ChevronRight className="w-6 h-6" />
              </button>
            </motion.div>
          )}

          {step >= 1 && step <= TOTAL && q && (
            <motion.div key={`q${step}`} {...SLIDE} transition={DUR}>

              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase" style={{ color: q.accent }}>
                  {stepDisplay?.label}
                </span>
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-xs text-white/25 font-medium">{stepDisplay?.counter}</span>
              </div>

              <h2 className="font-extrabold leading-[0.95] tracking-tight text-white mb-4"
                style={{ fontSize: "clamp(2.4rem,5.5vw,5.5rem)", whiteSpace: "pre-line" }}>
                {q.label}
              </h2>
              {q.sub && <p className="text-sm md:text-base text-white/40 mb-10 font-light">{q.sub}</p>}
              {!q.sub && <div className="mb-10" />}

              {q.type === "text-input" && (
                <div className="max-w-md">
                  <input
                    type={q.inputType || "text"}
                    placeholder={q.placeholder}
                    value={(answer as string) || ""}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="w-full bg-transparent text-white text-2xl md:text-3xl font-light placeholder-white/20 outline-none border-b-2 pb-4 transition-[border-color] duration-300"
                    style={{ borderColor: (answer as string)?.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                  />
                  {!q.required && (
                    <p className="text-xs text-white/25 mt-3 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/15" />
                      Optional — skip if you prefer
                    </p>
                  )}
                </div>
              )}

              {q.type === "rating" && (
                <div className="max-w-lg">
                  <RatingScale
                    value={(answer as number) ?? null}
                    onChange={setAnswer}
                    minLabel={q.minLabel ?? ""}
                    maxLabel={q.maxLabel ?? ""}
                    accent={q.accent} accent2={q.accent2} />
                </div>
              )}

              {q.type === "radio" && q.options && (
                <div className="flex flex-wrap gap-3 max-w-3xl">
                  {q.options.map((opt) => (
                    <Pill key={opt} label={opt} selected={answer === opt} accent={q.accent}
                      onClick={() => setAnswer(opt)} />
                  ))}
                </div>
              )}

              {q.type === "radio-other" && q.options && (
                <div className="max-w-3xl">
                  <div className="flex flex-wrap gap-3">
                    {q.options.map((opt) => (
                      <Pill key={opt} label={opt} selected={answer === opt} accent={q.accent}
                        onClick={() => { setAnswer(opt); if (opt !== "Other") setOtherText("") }} />
                    ))}
                  </div>
                  {answer === "Other" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      <input
                        type="text"
                        placeholder="Please specify your field…"
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                        autoFocus
                        className="mt-5 w-full max-w-md bg-transparent text-white text-lg font-light placeholder-white/20 outline-none border-b-2 pb-3 transition-[border-color] duration-300"
                        style={{ borderColor: otherText.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                      />
                    </motion.div>
                  )}
                </div>
              )}

              {q.type === "checkbox" && q.options && (
                <div className="flex flex-wrap gap-3 max-w-3xl">
                  {q.options.map((opt) => {
                    const checked = Array.isArray(answer) && (answer as string[]).includes(opt)
                    return (
                      <Pill key={opt} label={opt} selected={checked} accent={q.accent}
                        onClick={() => {
                          const prev = (answer as string[]) || []
                          setAnswer(checked ? prev.filter((v) => v !== opt) : [...prev, opt])
                        }} />
                    )
                  })}
                </div>
              )}

              {q.type === "textarea" && (
                <div className="max-w-2xl">
                  <textarea
                    rows={5}
                    value={(answer as string) || ""}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full bg-transparent text-white text-lg md:text-xl font-light placeholder-white/20 resize-none outline-none border-b-2 pb-4 transition-[border-color] duration-300"
                    style={{ borderColor: (answer as string)?.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                  />
                  {q.required && (
                    <p className="text-xs text-white/20 mt-2">
                      {((answer as string) || "").trim().length} chars
                      {((answer as string) || "").trim().length < 5 && " · minimum 5 characters"}
                    </p>
                  )}
                  {!q.required && (
                    <p className="text-xs text-white/20 mt-2">Optional</p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-6 mt-12">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm font-medium"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>

                <button
                  onClick={canProceed && !submitting ? handleNext : undefined}
                  disabled={!canProceed || submitting}
                  className="flex items-center gap-3 font-bold text-base md:text-lg px-7 py-4 rounded-2xl transition-[transform,opacity] duration-200 hover:scale-[1.04] active:scale-95 disabled:cursor-not-allowed"
                  style={
                    canProceed && !submitting
                      ? { background: `linear-gradient(135deg,${q.accent},${q.accent2})`, color: "#fff", boxShadow: `0 10px 32px ${q.accent}44` }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {submitting
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting…</>
                    : step === TOTAL
                    ? <><Send className="w-4 h-4" /> Submit</>
                    : <>Continue <ChevronRight className="w-4 h-4" /></>}
                </button>
              </div>
            </motion.div>
          )}

          {step === TOTAL + 1 && (
            <motion.div key="done" {...FADE_UP} transition={DUR}>
              <div className="flex gap-1.5 mb-10">
                {[1,2,3,4,5].map((i) => (
                  <motion.div key={i} initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 220 }}>
                    <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "#a855f7" }}>✦ All done</p>
              <h2 className="font-extrabold leading-[0.93] tracking-tight text-white mb-6"
                style={{ fontSize: "clamp(3rem,9vw,8rem)" }}>
                Thank you,{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)" }}>
                  genuinely.
                </span>
              </h2>
              <p className="text-lg md:text-2xl text-white/45 max-w-lg mb-14 leading-relaxed font-light">
                Every response will be analyzed to understand how people perceive AI writing.<br />
                <span className="text-white/25 text-base">Your answers are anonymous and will never be shared individually.</span>
              </p>
              <a href="/"
                className="inline-flex items-center gap-3 font-bold text-base px-8 py-4 rounded-2xl text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-[border-color,color,transform] duration-200 hover:scale-[1.03]">
                Back to Home <ChevronRight className="w-5 h-5" />
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>{`
        @keyframes blobDrift1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(-25px,18px) scale(1.04)}70%{transform:translate(15px,-12px) scale(0.97)}}
        @keyframes blobDrift2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(22px,-18px) scale(1.03)}65%{transform:translate(-12px,22px) scale(0.97)}}
        .survey-blob-1{animation:blobDrift1 14s ease-in-out infinite}
        .survey-blob-2{animation:blobDrift2 17s ease-in-out infinite}
      `}</style>
    </div>
  )
}


