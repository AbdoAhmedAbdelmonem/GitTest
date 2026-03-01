// ─── Shared Question types & Data ────────────────────────────────────────────
export type QType = "radio" | "checkbox" | "textarea" | "radio-other" | "text-input" | "rating" | "star"
export interface Question {
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
  quote?: string
}

export const DEMO_COUNT = 5;

export const FORM_BASE = "https://docs.google.com/forms/d/e/1FAIpQLSccLnBUzkM_m-vynoPJCK7YQm6I1UrHDOwpfBSY13itquf5hw/formResponse";

export const FORM_MAP: Record<string, string> = {
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
  q15b: "entry.567544651",
  q16: "entry.852766328",
  q17: "entry.900499563",
  q18: "entry.820612214",
  q19: "entry.419722609",
  q20: "entry.1505558509",
}

export const AR_TO_EN_MAP: Record<string, string> = {
  // demo-gender
  "ذكر": "Male",
  "أنثى": "Female",
  // demo-education
  "ثانوية عامة": "High School",
  "جامعة": "University",
  "خريج": "Graduated",
  // demo-field
  "علم البيانات": "Data Science",
  "هندسة": "Engineering",
  "طب": "Medicine",
  "تجارة": "Business",
  "فنون": "Arts",
  "أخرى": "Other",
  // q1
  "بحبه جداً": "I like it very much",
  "بحبه لحد ما": "I somewhat like it",
  "محايد": "Neutral",
  "مش بحبه": "I don’t like it",
  "بفضل ماستخدمهوش": "I prefer not to use it",
  // q2
  "دايماً": "Always",
  "غالباً": "Often",
  "أحياناً": "Sometimes",
  "نادراً": "Rarely",
  "مش بعرف أفرق": "Never",
  // q3
  "كتابة الإنسان": "Human writing",
  "كتابة الذكاء الاصطناعي": "AI writing",
  "الاتنين بالتساوي": "Both equally",
  "حسب الموضوع": "It depends on the topic",
  // q4
  "أيوه، بشكل كبير": "Yes, to a great extent",
  "أيوه، بشكل متوسط": "Yes, to a moderate extent",
  "بشكل محدود": "To a limited extent",
  "لأ، مش بيقدر ينقل مشاعر": "No, it cannot convey emotions",
  "مش متأكد": "Not sure",
  // q5
  "في الكتابة الرسمية بس": "Only in formal writing",
  "في الكتابة غير الرسمية بس": "Only in informal writing",
  "في الاتنين": "In both",
  "مينفعش يُعتمد عليه": "It cannot be relied upon",
  // q8
  "السرعة في إتمام المهام": "Speed in completing tasks",
  "توفير الجهد": "Saving effort",
  "صياغة اللغة/الأسلوب": "Language formulation/style",
  "تحسين دقة القواعد": "Improves grammar accuracy",
  "المساعدة في توليد الأفكار": "Helps generate ideas",
  // q9
  "التعبير العاطفي الحقيقي": "Genuine emotional expression",
  "الإبداع الشخصي": "Personal creativity",
  "التجربة الإنسانية": "Human experience",
  "الفهم العميق للسياق": "Deep contextual understanding",
  "الأسلوب الشخصي المميز": "Unique personal style",
  // q10
  "مش بستخدم أدوات ذكاء اصطناعي": "I do not use AI tools",
  // q12
  "أيوه، بالكامل": "Yes, completely",
  "جزئياً": "Partially",
  "في مجالات معينة بس": "Only in certain fields",
  "لأ": "No",
  // q13
  "مش حاسس بكده": "I don’t feel that",
  // q14
  "عمري ما استخدمتها": "I have never used it",
  // q15
  "التعبير العاطفي": "Emotional expression",
  "الأسلوب الشخصي": "Personal style",
  "الإبداع والخيال": "Creativity and imagination",
  "خبرة الكاتب وفهمه للسياق": "Writer’s experience and contextual understanding",
  "أسلوب الكتابة غير الرسمي": "Informal writing style",
  // q16
  "الإنسان": "Humans",
  "الذكاء الاصطناعي": "AI",
  "مش عارف": "I don’t know"
}

export const ALL_STEPS_EN: Question[] = [
  // ──────────── DEMOGRAPHICS: Tell Us About You ─────────────────────────
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

  // ──────────── SECTION 1: General Perception ────────────────────────────
  {
    id: "q1", section: "1 · General Perception", type: "radio",
    label: "Do you like the writing style\nof Artificial Intelligence (AI)?",
    sub: "",
    options: ["I like it very much", "I somewhat like it", "Neutral", "I don’t like it", "I prefer not to use it"],
    required: true,
    accent: "#a855f7", accent2: "#ec4899",
  },
  {
    id: "q2", section: "1 · General Perception", type: "radio",
    label: "Can you differentiate between\nHuman writing and AI writing?",
    sub: "",
    options: ["Always", "Often", "Sometimes", "Rarely", "Never"],
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

  // ──────────── SECTION 2: Evaluation of AI Writing ──────────────────────
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
    id: "q15b", section: "2 · Evaluation", type: "star",
    quote: "\"Technology has changed the way we communicate, making it faster and more efficient, yet sometimes less personal and emotionally connected.\"",
    label: "How would you rate the creativity of this text based on your personal impression?",
    sub: "Rate from 1 to 5.",
    required: true,
    accent: "#fbbf24", accent2: "#f59f0b8c",
  },
  {
    id: "q16", section: "2 · Evaluation", type: "radio",
    label: "Who makes\nmore mistakes?",
    sub: "",
    options: ["Humans", "AI", "Neutral", "I don’t know"],
    required: true,
    accent: "#6366f1", accent2: "#a855f7",
  },

  // ──────────── SECTION 3: Open-Ended Questions ─────────────────────────
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
];

export const ALL_STEPS_AR: Question[] = [
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
    label: "ايه حالتك الدراسية حاليًا؟",
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
    id: "q15b", section: "٢ · التقييم", type: "star",
    quote: "\"لقد غيَّرت التكنولوجيا الطريقة التي نتواصل بها، وجعلتها أسرع وأكثر كفاءة، ولكنها في بعض الأحيان أصبحت أقل خصوصية وترابطاً عاطفياً.\"",
    label: "كيف تقيم مستوى الإبداع في هذا النص بناءً على انطباعك الشخصي؟",
    sub: "اختار تقييم من 1 لـ 5.",
    required: true,
    accent: "#fbbf24", accent2: "#f59e0b",
  },
  {
    id: "q16", section: "٢ · التقييم", type: "radio",
    label: "مين بيغلط أكتر؟",
    sub: "",
    options: ["الإنسان", "الذكاء الاصطناعي", "محايد", "مش عارف"],
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
];

export const TOTAL = ALL_STEPS_EN.length;
