"use client"

import { useState, useCallback, memo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Send, Star, Loader2, Globe } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ToastProvider"

// ─── Types ────────────────────────────────────────────────────────────────────
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

// ─── All steps (demographics + survey) — Arabic ───────────────────────────────
const ALL_STEPS: Question[] = [
  // ──────────── البيانات الديموغرافية: احكيلنا عنك ──────────────────────
  {
    id: "demo-name", section: "احكيلنا عنك", type: "text-input",
    label: "اسمك ايه؟",
    sub: "للسحب على الجوائز قيمة جدا 🌟. ممكن تتخطاه.",
    placeholder: "اسمك",
    inputType: "text",
    required: false,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-phone", section: "احكيلنا عنك", type: "text-input",
    label: "رقم تليفونك ايه؟",
    sub: "عشان نتواصل معاك لو كسبت. ممكن تتخطاه.",
    placeholder: "رقم التليفون",
    inputType: "number",
    required: false,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-gender", section: "احكيلنا عنك", type: "radio",
    label: "إنت ولا إنتي؟",
    sub: "",
    options: ["ذكر", "أنثى"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-education", section: "احكيلنا عنك", type: "radio",
    label: "ايه حالتك دراسية حالية؟",
    sub: "",
    options: ["ثانوية عامة", "جامعة", "خريج"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },
  {
    id: "demo-field", section: "احكيلنا عنك", type: "radio-other",
    label: "ايه هو مجال دراستك؟",
    sub: "",
    options: ["علم البيانات", "هندسة", "طب", "تجارة", "فنون", "أخرى"],
    required: true,
    accent: "#f97316", accent2: "#ec4899",
  },

  // ──────────── القسم 1: الانطباع العام ──────────────────────────────────
  {
    id: "q1", section: "١ · الانطباع العام", type: "radio",
    label: "هل بتحب أسلوب كتابة\nالذكاء الاصطناعي؟",
    sub: "",
    options: ["بحبه جداً", "بحبه لحد ما", "محايد", "مش بحبه", "بفضل ماستخدمهوش"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q2", section: "١ · الانطباع العام", type: "radio",
    label: "بتقدر تفرق بين كتابة\nالإنسان وكتابة الذكاء الاصطناعي؟",
    sub: "",
    options: ["دايماً", "غالباً", "أحياناً", "نادراً", "مش بعرف أفرق"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q3", section: "١ · الانطباع العام", type: "radio",
    label: "أنهي أسلوب كتابة\nبيديك ثقة أكتر؟",
    sub: "",
    options: ["كتابة الإنسان", "كتابة الذكاء الاصطناعي", "الاتنين بالتساوي", "حسب الموضوع"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q4", section: "١ · الانطباع العام", type: "radio",
    label: "هل تفتكر إن الذكاء الاصطناعي\nيقدر ينقل المشاعر في الكتابة؟",
    sub: "",
    options: ["أيوه، بشكل كبير", "أيوه، بشكل متوسط", "بشكل محدود", "لأ، مش بيقدر ينقل مشاعر", "مش متأكد"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q5", section: "١ · الانطباع العام", type: "radio",
    label: "هل تفتكر إن الذكاء الاصطناعي\nممكن يُعتمد عليه في الكتابة؟",
    sub: "",
    options: ["في الكتابة الرسمية بس", "في الكتابة غير الرسمية بس", "في الاتنين", "مينفعش يُعتمد عليه"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },

  // ──────────── القسم 2: تقييم كتابة الذكاء الاصطناعي ────────────────────
  {
    id: "q6", section: "٢ · التقييم", type: "rating",
    label: "قيّم كتابة الذكاء الاصطناعي\nفي المواضيع العاطفية.",
    sub: "اختار تقييم من 1 لـ 5.",
    minLabel: "غير فعال", maxLabel: "فعال جداً",
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q7", section: "٢ · التقييم", type: "rating",
    label: "قيّم كتابة الذكاء الاصطناعي\nفي المواضيع المعقدة.",
    sub: "اختار تقييم من 1 لـ 5.",
    minLabel: "غير فعال", maxLabel: "فعال جداً",
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q8", section: "٢ · التقييم", type: "checkbox",
    label: "إيه أهم مميزات استخدام\nالذكاء الاصطناعي في الكتابة؟",
    sub: "اختار كل اللي ينطبق.",
    options: ["السرعة في إتمام المهام", "توفير الجهد", "صياغة اللغة/الأسلوب", "تحسين دقة القواعد", "المساعدة في توليد الأفكار"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q9", section: "٢ · التقييم", type: "checkbox",
    label: "إيه الصفات اللي في كتابة الإنسان\nومش موجودة في كتابة الذكاء الاصطناعي؟",
    sub: "اختار كل اللي ينطبق.",
    options: ["التعبير العاطفي الحقيقي", "الإبداع الشخصي", "التجربة الإنسانية", "الفهم العميق للسياق", "الأسلوب الشخصي المميز"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q10", section: "٢ · التقييم", type: "checkbox",
    label: "أنهي أدوات ذكاء اصطناعي\nبتستخدمها في الكتابة؟",
    sub: "اختار كل اللي ينطبق.",
    options: ["ChatGPT", "Grammarly", "Notion AI", "Google Gemini", "Microsoft Copilot", "QuillBot","Anthropic Claude", "مش بستخدم أدوات ذكاء اصطناعي"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q11", section: "٢ · التقييم", type: "rating",
    label: "إزاي بتقيّم إبداع\nالذكاء الاصطناعي في الكتابة؟",
    sub: "اختار تقييم من 1 لـ 5.",
    minLabel: "منخفض جداً", maxLabel: "عالي جداً",
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q12", section: "٢ · التقييم", type: "radio",
    label: "هل تتوقع إن الذكاء الاصطناعي\nهيحل محل الإنسان في الكتابة؟",
    sub: "",
    options: ["أيوه، بالكامل", "جزئياً", "في مجالات معينة بس", "لأ", "مش متأكد"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q13", section: "٢ · التقييم", type: "radio",
    label: "هل حاسس إن كتابة الذكاء\nالاصطناعي ساعات بتكون مكررة؟",
    sub: "",
    options: ["دايماً", "غالباً", "أحياناً", "نادراً", "مش حاسس بكده"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q14", section: "٢ · التقييم", type: "radio",
    label: "هل كتابة الذكاء الاصطناعي\nمحتاجة تعديل؟",
    sub: "",
    options: ["دايماً", "غالباً", "أحياناً", "نادراً", "عمري ما استخدمتها"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q15", section: "٢ · التقييم", type: "checkbox",
    label: "إيه أكتر حاجة بتميز\nكتابة الإنسان؟",
    sub: "اختار كل اللي ينطبق.",
    options: ["التعبير العاطفي", "الأسلوب الشخصي", "الإبداع والخيال", "خبرة الكاتب وفهمه للسياق", "أسلوب الكتابة غير الرسمي"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },
  {
    id: "q16", section: "٢ · التقييم", type: "radio",
    label: "مين بيغلط أكتر؟",
    sub: "",
    options: ["الإنسان", "الذكاء الاصطناعي", "الاتنين بالتساوي", "مش عارف"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },

  // ──────────── القسم 3: أسئلة مفتوحة ───────────────────────────────────
  {
    id: "q17", section: "٣ · أسئلة مفتوحة", type: "textarea",
    label: "هل تفتكر إن كتابة\nالإنسان فيها عيوب؟",
    sub: "شاركنا رأيك.",
    placeholder: "اكتب إجابتك هنا…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q18", section: "٣ · أسئلة مفتوحة", type: "textarea",
    label: "إيه أكبر فرق بين كتابة\nالإنسان وكتابة الذكاء الاصطناعي بالنسبالك؟",
    sub: "شاركنا وجهة نظرك.",
    placeholder: "اكتب إجابتك هنا…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q19", section: "٣ · أسئلة مفتوحة", type: "textarea",
    label: "إيه عيوب كتابة الذكاء الاصطناعي؟",
    sub: "شاركنا رأيك.",
    placeholder: "اكتب إجابتك هنا…",
    required: true,
    accent: "#ec4899", accent2: "#f97316",
  },
  {
    id: "q20", section: "٣ · أسئلة مفتوحة", type: "textarea",
    label: "أي تعليقات إضافية؟",
    sub: "السؤال ده اختياري ممكن تبعت ردك من غير إجابة.",
    placeholder: "اكتب أي حاجة عايز تضيفها…",
    required: false,
    accent: "#ec4899", accent2: "#f97316",
  },
]

const DEMO_COUNT = 5
const TOTAL = ALL_STEPS.length
type AnswerVal = string | string[] | number

// ─── Google Form entry ID mapping ─────────────────────────────────────────────
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
      if (qId === "demo-field" && val === "أخرى" && otherText.trim()) {
        params.append(entryId, otherText.trim())
      } else {
        params.append(entryId, val)
      }
    }
  }
  return `${FORM_BASE}?${params.toString()}`
}

// ─── Pill ─────────────────────────────────────────────────────────────────────
const Pill = memo(function Pill({ label, selected, accent, onClick }: {
  label: string; selected: boolean; accent: string; onClick: () => void
}) {
  return (
    <button onClick={onClick} className="px-5 py-3 rounded-full text-sm md:text-base font-medium transition-[border-color,background,color,box-shadow] duration-200 outline-none text-right"
      style={{
        border: `2px solid ${selected ? accent : "rgba(255,255,255,0.12)"}`,
        background: selected ? `${accent}22` : "rgba(255,255,255,0.04)",
        color: selected ? "#fff" : "rgba(255,255,255,0.55)",
        boxShadow: selected ? `0 0 20px ${accent}44` : "none",
      }}>
      {label}
    </button>
  )
})

// ─── Rating scale (1–5 cubes) ─────────────────────────────────────────────────
const RatingScale = memo(function RatingScale({ value, onChange, minLabel, maxLabel, accent, accent2 }: {
  value: number | null; onChange: (v: number) => void
  minLabel: string; maxLabel: string; accent: string; accent2: string
}) {
  return (
    <div>
      <div className="flex gap-3 mt-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => onChange(n)}
            className="flex-1 h-14 md:h-16 rounded-2xl font-bold text-lg md:text-xl transition-[transform,background,box-shadow,color] duration-150"
            style={
              value === n
                ? { background: `linear-gradient(135deg,${accent},${accent2})`, color: "#fff", boxShadow: `0 6px 24px ${accent}55`, transform: "scale(1.08)" }
                : { background: "rgba(255,255,255,0.06)", border: "2px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)" }
            }>
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

// ─── Progress bar ─────────────────────────────────────────────────────────────
const ProgressBar = memo(function ProgressBar({ step, accent, accent2 }: { step: number; accent: string; accent2: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 h-0.5 bg-white/5 z-50">
      <motion.div className="h-full" initial={false}
        animate={{ width: `${(step / TOTAL) * 100}%` }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        style={{ background: `linear-gradient(90deg,${accent},${accent2})`, willChange: "width" }} />
    </div>
  )
})

// ─── Animation presets ────────────────────────────────────────────────────────
const SLIDE   = { initial: { opacity: 0, x: -70 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 70 } }
const FADE_UP = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } }
const DUR     = { duration: 0.36, ease: [0.16, 1, 0.3, 1] } as const

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SurveyArPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerVal>>({})
  const [otherText, setOtherText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { addToast } = useToast()

  const q: Question | null = step >= 1 && step <= TOTAL ? ALL_STEPS[step - 1] : null
  const answer = q ? answers[q.id] : undefined

  const canProceed = !q
    || (q.type === "radio"       && typeof answer === "string" && answer.length > 0)
    || (q.type === "radio-other" && typeof answer === "string" && answer.length > 0 && (answer !== "أخرى" || otherText.trim().length > 0))
    || (q.type === "checkbox"    && Array.isArray(answer) && (answer as string[]).length > 0)
    || (q.type === "textarea"    && !q.required)
    || (q.type === "textarea"    && q.required && typeof answer === "string" && (answer as string).trim().length >= 5)
    || (q.type === "text-input"  && !q.required)
    || (q.type === "text-input"  && q.required && typeof answer === "string" && (answer as string).trim().length > 0)
    || (q.type === "rating"      && typeof answer === "number")

  const setAnswer = useCallback((val: AnswerVal) => {
    if (!q) return
    setAnswers((prev) => ({ ...prev, [q.id]: val }))
  }, [q])

  const handleNext = useCallback(async () => {
    // Conditional logic: skip demo-field if High School is selected
    if (q?.id === "demo-education" && answers["demo-education"] === "ثانوية عامة") {
      setAnswers((prev) => ({ ...prev, "demo-field": "Not specialized" }))
      setStep((s) => s + 2) // Skip demo-field
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
          // Send empty string to Google Forms if it's "Not specialized" and was skipped
          let finalVal = val as string
          if (qId === "demo-field" && val === "أخرى" && otherText.trim()) finalVal = otherText.trim()
          else if (qId === "demo-field" && val === "Not specialized") finalVal = ""

          params.append(entryId, finalVal)
        }
      }
      // Submit via the new API proxy
      const res = await fetch("/api/survey/submit", {
        method: "POST",
        body: params.toString(),
      })

      if (!res.ok) throw new Error("Submission failed")

      addToast("✅ اتبعت! إجاباتك اتسجلت بنجاح.", "success")
    } catch {
      addToast("⚠️ مشكلة. إجاباتك ممكن ماتكونش اتسجلت. جرب تاني.", "error")
    }
    await new Promise((r) => setTimeout(r, 800))
    setSubmitting(false)
    setStep(TOTAL + 1)
  }, [step, answers, otherText])

  const handleBack = useCallback(() => {
    // If we are on the step right AFTER the skipped demo-field (which is q1),
    // and High School was selected, jump back 2 steps instead of 1.
    const q1Index = ALL_STEPS.findIndex(s => s.id === "q1") + 1 // +1 because step 0 is intro
    if (step === q1Index && answers["demo-education"] === "ثانوية عامة") {
      setStep((s) => Math.max(s - 2, 0))
    } else {
      setStep((s) => Math.max(s - 1, 0))
    }
  }, [step, answers])

  const accent  = q?.accent  ?? "#7c3aed"
  const accent2 = q?.accent2 ?? "#db2777"

  const demoSection = "احكيلنا عنك"
  const stepDisplay = q
    ? q.section === demoSection
      ? { label: q.section, counter: `${step} / ${DEMO_COUNT}` }
      : { label: q.section, counter: `${step - DEMO_COUNT} / ${TOTAL - DEMO_COUNT}` }
    : null

  return (
    <div
      dir="rtl"
      lang="ar"
      className="relative min-h-screen w-full overflow-hidden"
      style={{ background: "#070710" }}
    >
      {/* Blobs */}
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[120px] opacity-25 survey-blob-1"
        style={{ width: 600, height: 600, background: `radial-gradient(circle,${accent},transparent 70%)`, top: "-15%", left: "-8%", willChange: "transform" }} />
      <div aria-hidden className="pointer-events-none fixed rounded-full blur-[100px] opacity-15 survey-blob-2"
        style={{ width: 500, height: 500, background: `radial-gradient(circle,${accent2},transparent 70%)`, bottom: "-10%", right: "-5%", willChange: "transform" }} />

      {/* ── Language toggle (fixed top-left in RTL) ── */}
      <a href="/survey"
        className="fixed top-5 left-5 z-50 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white/40 hover:text-white/80 hover:border-white/25 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
        title="English"
        dir="ltr">
        <Globe className="w-4.5 h-4.5" />
      </a>

      {/* Progress */}
      {step >= 1 && step <= TOTAL && <ProgressBar step={step} accent={accent} accent2={accent2} />}

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-28 py-20">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── مقدمة ── */}
          {step === 0 && (
            <motion.div key="intro" {...FADE_UP} transition={DUR}>
              <div className="flex items-center gap-2 mb-6">
                <Image src="/images/1212-removebg-preview.png" alt="Chameleon" width={22} height={22} className="object-contain" />
                <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#a855f7", letterSpacing: "0.1em" }}>
                  استبيان كاميليون 2026
                </p>
              </div>

              <h1 className="font-bold leading-[1.1] text-white mb-4" style={{ fontSize: "clamp(2.4rem,7vw,6.5rem)" }}>
                كتابة الذكاء الاصطناعي<br />
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)" }}>
                  مقابل كتابة الإنسان.
                </span>
              </h1>

              <p className="text-base md:text-lg text-white/50 max-w-xl mb-3 leading-loose font-light">
                <span className="font-semibold text-white/70">استبيان الانطباعات</span> — الاستبيان ده هدفه يستكشف انطباعات الناس عن كتابة الذكاء الاصطناعي مقارنة بكتابة الإنسان.
              </p>
              <p className="text-sm text-white/30 max-w-xl mb-8 leading-loose font-light">
                إجاباتك مجهولة الهوية وهتُستخدم لأغراض أكاديمية فقط.
              </p>

              {/* Section tags */}
              <div className="flex flex-wrap gap-2 mb-12">
                {["احكيلنا عنك", "١ · الانطباع العام", "٢ · التقييم", "٣ · أسئلة مفتوحة"].map((s) => (
                  <span key={s} className="text-xs font-medium px-3 py-1 rounded-full border border-white/10 text-white/40">{s}</span>
                ))}
              </div>

              <button onClick={() => setStep(1)}
                className="inline-flex items-center gap-4 text-white font-bold text-xl md:text-2xl px-10 py-5 rounded-2xl transition-transform duration-200 hover:scale-[1.04] active:scale-95"
                style={{ background: "linear-gradient(135deg,#7c3aed,#db2777)" }}>
                <ChevronLeft className="w-6 h-6" />
                خلينا نبدأ
              </button>
            </motion.div>
          )}

          {/* ── سؤال ── */}
          {step >= 1 && step <= TOTAL && q && (
            <motion.div key={`q${step}`} {...SLIDE} transition={DUR}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold tracking-wider" style={{ color: q.accent }}>{stepDisplay?.label}</span>
                <div className="h-px flex-1 bg-white/8" />
                <span className="text-xs text-white/25 font-medium">{stepDisplay?.counter}</span>
              </div>

              <h2 className="font-bold leading-[1.1] text-white mb-4"
                style={{ fontSize: "clamp(2.4rem,5.5vw,5rem)", whiteSpace: "pre-line" }}>
                {q.label}
              </h2>
              {q.sub && <p className="text-sm md:text-base text-white/40 mb-10 font-light leading-loose">{q.sub}</p>}
              {!q.sub && <div className="mb-10" />}

              {/* ── Text Input (name / phone) ── */}
              {q.type === "text-input" && (
                <div className="max-w-md">
                  <input
                    type={q.inputType || "text"}
                    placeholder={q.placeholder}
                    value={(answer as string) || ""}
                    onChange={(e) => setAnswer(e.target.value)}
                    dir={q.inputType === "tel" ? "ltr" : "rtl"}
                    className="w-full bg-transparent text-white text-2xl md:text-3xl font-light placeholder-white/20 outline-none border-b-2 pb-4 transition-[border-color] duration-300"
                    style={{ borderColor: (answer as string)?.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                  />
                  {!q.required && (
                    <p className="text-xs text-white/25 mt-3 flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/15" />
                      اختياري — ممكن تتخطاه
                    </p>
                  )}
                </div>
              )}

              {/* ── Rating (5 cubes) ── */}
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

              {/* Radio */}
              {q.type === "radio" && q.options && (
                <div className="flex flex-wrap gap-3 max-w-3xl">
                  {q.options.map((opt) => (
                    <Pill key={opt} label={opt} selected={answer === opt} accent={q.accent}
                      onClick={() => setAnswer(opt)} />
                  ))}
                </div>
              )}

              {/* Radio with "Other" */}
              {q.type === "radio-other" && q.options && (
                <div className="max-w-3xl">
                  <div className="flex flex-wrap gap-3">
                    {q.options.map((opt) => (
                      <Pill key={opt} label={opt} selected={answer === opt} accent={q.accent}
                        onClick={() => { setAnswer(opt); if (opt !== "أخرى") setOtherText("") }} />
                    ))}
                  </div>
                  {answer === "أخرى" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
                      <input
                        type="text"
                        placeholder="حدد مجالك…"
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

              {/* Checkbox */}
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

              {/* Textarea */}
              {q.type === "textarea" && (
                <div className="max-w-2xl">
                  <textarea rows={5}
                    value={(answer as string) || ""}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder={q.placeholder}
                    className="w-full bg-transparent text-white text-lg md:text-xl font-light placeholder-white/20 resize-none outline-none border-b-2 pb-4 transition-[border-color] duration-300 text-right leading-loose"
                    style={{ borderColor: (answer as string)?.trim() ? q.accent : "rgba(255,255,255,0.12)", caretColor: q.accent }}
                  />
                  {q.required && (
                    <p className="text-xs text-white/20 mt-2 text-left" dir="ltr">
                      {((answer as string) || "").trim().length} chars
                      {((answer as string) || "").trim().length < 5 && " · اكتب 5 حروف على الأقل"}
                    </p>
                  )}
                  {!q.required && (
                    <p className="text-xs text-white/20 mt-2">اختياري</p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center gap-6 mt-12">
                <button
                  onClick={canProceed && !submitting ? handleNext : undefined}
                  disabled={!canProceed || submitting}
                  className="flex items-center gap-3 font-bold text-base md:text-lg px-7 py-4 rounded-2xl transition-[transform,opacity] duration-200 hover:scale-[1.04] active:scale-95 disabled:cursor-not-allowed"
                  style={
                    canProceed && !submitting
                      ? { background: `linear-gradient(135deg,${q.accent},${q.accent2})`, color: "#fff", boxShadow: `0 10px 32px ${q.accent}44` }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.08)" }
                  }>
                  {submitting
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> جاري الإرسال…</>
                    : step === TOTAL
                    ? <><Send className="w-4 h-4" /> إرسال</>
                    : <>التالي <ChevronLeft className="w-4 h-4" /></>}
                </button>

                <button onClick={handleBack}
                  className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-sm font-medium">
                  <ChevronRight className="w-4 h-4" />
                  رجوع
                </button>
              </div>
            </motion.div>
          )}

          {/* ── شكراً ── */}
          {step === TOTAL + 1 && (
            <motion.div key="done" {...FADE_UP} transition={DUR}>
              <div className="flex gap-1.5 mb-10">
                {[1,2,3,4,5].map((i) => (
                  <motion.div key={i} initial={{ scale: 0, rotate: 20 }} animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 220 }}>
                    <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm font-bold tracking-widest mb-4" style={{ color: "#a855f7", letterSpacing: "0.08em" }}>
                ✦ خلصنا
              </p>
              <h2 className="font-bold leading-[1.1] text-white mb-6"
                style={{ fontSize: "clamp(2.8rem,8.5vw,8rem)" }}>
                شكراً جداً،{" "}
                <span className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(135deg,#a855f7,#ec4899,#f97316)" }}>
                  بجد.
                </span>
              </h2>
              <p className="text-lg md:text-2xl text-white/45 max-w-lg mb-14 leading-loose font-light">
                كل إجابة هتتحلل عشان نفهم ازاي الناس بتشوف كتابة الذكاء الاصطناعي.<br />
                <span className="text-white/25 text-base">إجاباتك مجهولة ومش هتتشارك بشكل فردي أبداً.</span>
              </p>
              <a href="/"
                className="inline-flex items-center gap-3 font-bold text-base px-8 py-4 rounded-2xl text-white/55 hover:text-white border border-white/10 hover:border-white/25 transition-[border-color,color,transform] duration-200 hover:scale-[1.03]">
                <ChevronLeft className="w-5 h-5" />
                الرجوع للصفحة الرئيسية
              </a>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* CSS blob drift */}
      <style>{`
        @keyframes blobDrift1{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(25px,18px) scale(1.04)}70%{transform:translate(-15px,-12px) scale(0.97)}}
        @keyframes blobDrift2{0%,100%{transform:translate(0,0) scale(1)}35%{transform:translate(-22px,-18px) scale(1.03)}65%{transform:translate(12px,22px) scale(0.97)}}
        .survey-blob-1{animation:blobDrift1 14s ease-in-out infinite}
        .survey-blob-2{animation:blobDrift2 17s ease-in-out infinite}
      `}</style>
    </div>
  )
}
