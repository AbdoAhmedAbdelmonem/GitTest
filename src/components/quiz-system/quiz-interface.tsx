"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Trophy,
  ArrowLeft,
  ArrowRight,
  Play,
  CheckCircle,
  XCircle,
  Palette,
  Timer,
  Zap,
  Star,
  Award,
  Target,
  Eye,
  Sparkles,
  Brain,
  Lightbulb,
  BookOpen,
  Cable,
  Snail,
  Infinity,
  User,
  Code,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createBrowserClient } from "@/lib/supabase/client";
import { getStudentSession } from "@/lib/auth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Dialog as ImageDialog, DialogContent as ImageDialogContent } from "@/components/ui/dialog";

interface QuizQuestion {
  numb: number;
  question: string;
  type: string;
  answer: string;
  options: string[];
  image?: string | null;
}

interface QuizData {
  id: string;
  name: string;
  code: string;
  duration: number;
  jsonFile: string;
}

interface QuizInterfaceProps {
  quizData: QuizData;
  onExit: () => void;
}

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 1.2,
        delay: delay * 0.3,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 0.6 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function FloatingParticles({
  color,
  count = 20,
}: {
  color: string;
  count?: number;
}) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 0,
            scale: 0,
          }}
          animate={{
            y: -100,
            rotate: 360,
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

const themes = [
  {
    name: "Ocean",
    primary: "#0066cc",
    secondary: "#004499",
    accent: "#00aaff",
    gradient: "from-blue-500/[0.15]",
  },
  {
    name: "Forest",
    primary: "#228B22",
    secondary: "#006400",
    accent: "#32CD32",
    gradient: "from-green-500/[0.15]",
  },
  {
    name: "Sunset",
    primary: "#FF6B35",
    secondary: "#CC4125",
    accent: "#FF8C69",
    gradient: "from-orange-500/[0.15]",
  },
  {
    name: "Purple",
    primary: "#8A2BE2",
    secondary: "#6A1B9A",
    accent: "#BA55D3",
    gradient: "from-purple-500/[0.15]",
  },
  {
    name: "Rose",
    primary: "#E91E63",
    secondary: "#C2185B",
    accent: "#F48FB1",
    gradient: "from-rose-500/[0.15]",
  },
  {
    name: "Teal",
    primary: "#009688",
    secondary: "#00695C",
    accent: "#4DB6AC",
    gradient: "from-teal-500/[0.15]",
  },
];

const durations = [
  { label: "Lightning", value: 0.1, icon: Zap, description: "1 Minute" },
  { label: "Short", value: 5, icon: Star, description: "5 Minutes" },
  { label: "Standard (DEF)", value: 15, icon: Cable, description: "15 Minutes" },
  { label: "Extended", value: 30, icon: Clock, description: "30 Minutes" },
  { label: "Indolent", value: 60, icon: Snail, description: "1 Hour" },
  { label: "Unlimited", value: 0, icon: Infinity, description: "No Time Limit" },
];

const quizModes = [
  {
    id: "instant",
    name: "Instant Feedback",
    icon: Lightbulb,
    description: "See Answers Immediately With Creative Animations",
    color: "from-yellow-500/[0.15]",
  },
  {
    id: "traditional",
    name: "Traditional Mode",
    icon: Brain,
    description: "Answer All Questions Then See Results",
    color: "from-indigo-500/[0.15]",
  },
];

export default function QuizInterface({
  quizData,
  onExit,
}: QuizInterfaceProps) {
  const [currentStep, setCurrentStep] = useState<
    "setup" | "quiz" | "results" | "review"
  >("setup");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [selectedTheme, setSelectedTheme] = useState(themes[0]);
  const [selectedMode, setSelectedMode] = useState("traditional");
  const [showSettings, setShowSettings] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerRevealed, setAnswerRevealed] = useState<{
    [key: number]: boolean;
  }>({});
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizStatus, setQuizStatus] = useState<
    "completed" | "timed-out" | "in-progress"
  >("in-progress");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [maxAttemptsReached, setMaxAttemptsReached] = useState(false);
  const [showAttemptsDialog, setShowAttemptsDialog] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const submissionInProgress = useRef(false);
  const supabase = createBrowserClient();

  // Check authentication status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const session = getStudentSession();
      setIsAuthenticated(!!session);
      
      // Check quiz attempts if authenticated
      if (session) {
        await checkQuizAttempts();
      }
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    loadQuestions();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--quiz-primary",
      selectedTheme.primary
    );
    document.documentElement.style.setProperty(
      "--quiz-secondary",
      selectedTheme.secondary
    );
    document.documentElement.style.setProperty(
      "--quiz-accent",
      selectedTheme.accent
    );
  }, [selectedTheme]);

  // Function to check quiz attempts
  const checkQuizAttempts = async (): Promise<void> => {
    try {
      const session = getStudentSession();
      if (!session) {
        return;
      }

      // Get today's date at midnight for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Query Supabase for today's attempts for this specific quiz
      const { data, error, count } = await supabase
        .from("quiz_data")
        .select("*", { count: "exact" })
        .eq("user_id", session.user_id)
        .eq("quiz_id", quizData.code)
        .gte("solved_at", todayISO);

      if (error) {
        console.error("Error checking quiz attempts:", error);
        return;
      }

      const attemptsCount = count || 0;
      setAttemptsToday(attemptsCount);
      setMaxAttemptsReached(attemptsCount >= 2);
    } catch (error) {
      console.error("Unexpected error checking attempts:", error);
    }
  };

  const loadQuestions = async () => {
    try {
      const response = await fetch(quizData.jsonFile);
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error("Failed to load questions:", error);
      setQuestions([
        {
          numb: 1,
          question: "Sample question - What is 2 + 2?",
          type: "Mathematics",
          answer: "4",
          options: ["2", "3", "4", "5"],
          image: null,
        },
      ]);
    }
  };

  // Function to handle image display
  const handleShowImage = (imageUrl: string | null | undefined) => {
    if (imageUrl) {
      setCurrentImage(imageUrl);
      setShowImageDialog(true);
    }
  };

  const startQuiz = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    
    // Check attempts before starting
    await checkQuizAttempts();
    
    if (maxAttemptsReached) {
      setShowAttemptsDialog(true);
      return;
    }
    
    setCurrentStep("quiz");

    if (selectedDuration > 0) {
      // Only set timer for non-unlimited durations
      setTimeLeft(selectedDuration * 60);
      startTimer();
    } else {
      // For unlimited duration, set a very large number or skip timer completely
      setTimeLeft(Number.MAX_SAFE_INTEGER); // Effectively unlimited
    }
  };

  const startTimer = () => {
    // No timeout handling here, just count down
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Only clear the timer here
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const selectAnswer = (answer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer,
    }));

    // In traditional mode, we need to check answers continuously
    if (selectedMode === "traditional") {
      // Calculate current score based on all answered questions
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
          correctAnswers++;
        }
      });
    }

    if (selectedMode === "instant") {
      setShowAnswer(true);
      setAnswerRevealed((prev) => ({
        ...prev,
        [currentQuestion]: true,
      }));

      // Show celebration for correct answers
      if (answer === questions[currentQuestion].answer) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      setQuizStatus("completed");
      finishQuiz();
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setShowAnswer(answerRevealed[currentQuestion - 1] || false);
    }
  };

  // Updated saveScoreToSupabase function with all required fields
  const saveScoreToSupabase = async (finalScore: number, status: "completed" | "timed-out") => {
    // Additional guard against double submission
    if (submissionInProgress.current && quizSubmitted) {
      console.log("Submission already in progress, skipping database save");
      return;
    }
    
    // Set flags to prevent further submissions
    submissionInProgress.current = true;
    setQuizSubmitted(true);
    
    try {
      const session = getStudentSession();
      if (!session) {
        console.error("No user session found");
        return;
      }

      // Use the quiz code directly instead of trying to parse it as an integer
      const quizId = quizData.code;
      
      const quizResult = {
        user_id: session.user_id,
        quiz_id: quizId,
        score: Math.round((finalScore / questions.length) * 100),
        how_finished: status,
        chosen_theme: selectedTheme.name,
        answering_mode: selectedMode,
        duration_selected: selectedDuration === 0 ? "Unlimited" : `${selectedDuration} minutes`,
        total_questions: questions.length,
      };

      console.log("Saving quiz data:", quizResult);
      
      const { data, error } = await supabase
        .from("quiz_data")
        .insert([quizResult])
        .select();

      if (error) {
        console.error("Error saving quiz data to Supabase:", error.message);
      } else {
        console.log("Quiz data saved successfully:", data);
        // Update attempts count after successful submission
        setAttemptsToday(prev => prev + 1);
        setMaxAttemptsReached(attemptsToday + 1 >= 2);
      }
    } catch (error) {
      console.error("Unexpected error saving quiz data:", error);
    }
  };

  // Updated saveScore function for localStorage
  const saveScore = (finalScore: number, status: "completed" | "timed-out") => {
    const quizResult = {
      quizId: quizData.code,
      score: finalScore,
      totalQuestions: questions.length,
      status: status,
      timestamp: new Date().toISOString(),
      answers: userAnswers,
      theme: selectedTheme.name,
      mode: selectedMode,
      duration: selectedDuration,
    };

    localStorage.setItem(
      `quiz_${quizData.id}_result`,
      JSON.stringify(quizResult)
    );
  };

  const finishQuiz = () => {
    // Use ref to prevent double execution
    if (submissionInProgress.current) {
      console.log("Submission already in progress");
      return;
    }
    
    // Set flag immediately
    submissionInProgress.current = true;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });

    setScore(correctAnswers);
    setCurrentStep("results");

    // Save to localStorage and database
    saveScore(correctAnswers, quizStatus);
    saveScoreToSupabase(correctAnswers, quizStatus);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getScoreMessage = () => {
    const percentage = Math.round((score / questions.length) * 100);
    if (percentage >= 90)
      return {
        message: "Outstanding! Perfect mastery! 🏆",
        color: "text-yellow-400",
      };
    if (percentage >= 80)
      return {
        message: "Excellent work! Well done! ⭐",
        color: "text-green-400",
      };
    if (percentage >= 70)
      return { message: "Great job! Keep it up! 👏", color: "text-blue-400" };
    if (percentage >= 60)
      return {
        message: "Good effort! Room for improvement! 📚",
        color: "text-white-400",
      };
    return {
      message: "Keep studying! You'll do better next time! 💪",
      color: "text-red-400",
    };
  };

  useEffect(() => {
    if (currentStep === "quiz" && timeLeft > 0 && selectedDuration > 0) {
      // Only start timer if not unlimited and time left is positive
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Start the timer
      startTimer();
    } else if (timeLeft === 0 && currentStep === "quiz" && selectedDuration > 0) {
      // Only handle timeout for non-unlimited durations
      handleTimeExpired();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLeft, currentStep, selectedDuration]);

  const handleTimeExpired = () => {
    // Use ref to prevent double execution
    if (submissionInProgress.current) {
      console.log("Time expired submission already in progress");
      return;
    }
    
    // Set the flag immediately
    submissionInProgress.current = true;
    console.log("Time expired, handling quiz completion");
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question, index) => {
      if (userAnswers[index] === question.answer) {
        correctAnswers++;
      }
    });

    // Update state
    setQuizStatus("timed-out");
    setScore(correctAnswers);
    setCurrentStep("results");
    
    // Save to localStorage first (this is synchronous)
    saveScore(correctAnswers, "timed-out");
    
    // Then save to database
    saveScoreToSupabase(correctAnswers, "timed-out");
  };

  useEffect(() => {
    if (selectedMode === "traditional" && currentStep === "quiz") {
      // Calculate current score based on all answered questions
      let correctAnswers = 0;
      questions.forEach((question, index) => {
        if (userAnswers[index] === question.answer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers); // Update score in real-time
    }
  }, [userAnswers, selectedMode, currentStep, questions]);

  // Authentication Dialog Component
  const AuthDialog = () => (
    <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
      <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Authentication Required
          </DialogTitle>
          <DialogDescription className="text-white/70">
            You need to be logged in to start this quiz. Please sign in to continue.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <Button 
            onClick={() => {
              // Redirect to login page or show login modal
              window.location.href = "/auth";
            }}
            className="w-full py-3 text-lg"
            style={{
              backgroundColor: selectedTheme.primary,
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = selectedTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selectedTheme.primary;
              e.currentTarget.style.color = "white";
            }}
            >
            Sign In
            </Button>
            <Button 
            variant="outline" 
            onClick={() => setShowAuthDialog(false)}
            className="w-full py-3 text-lg border-white/30"
            style={{
              backgroundColor: "white",
              color: selectedTheme.primary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = selectedTheme.primary;
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = selectedTheme.primary;
            }}
            >
            Cancel
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Attempts Limit Dialog Component
  const AttemptsDialog = () => (
    <Dialog open={showAttemptsDialog} onOpenChange={setShowAttemptsDialog}>
      <DialogContent className="bg-black/80 backdrop-blur-md border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            Maximum Attempts Reached
          </DialogTitle>
          <DialogDescription className="text-white/70">
            You have already used {attemptsToday} out of 2 attempts for this quiz today. 
            Please try again tomorrow.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 mt-4">
            <Button 
            onClick={() => setShowAttemptsDialog(false)}
            className="w-full py-3 text-lg"
            style={{
              backgroundColor: selectedTheme.primary,
              color: "white",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = selectedTheme.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = selectedTheme.primary;
              e.currentTarget.style.color = "white";
            }}
            >
            Okay
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (currentStep === "setup") {
    return (
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <AuthDialog />
        <AttemptsDialog />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Elegant Shapes with Theme Colors */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={450}
            height={110}
            rotate={8}
            gradient={selectedTheme.gradient}
            className="left-[-8%] top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={350}
            height={90}
            rotate={-12}  // This is correct, keep as is
            gradient={selectedTheme.gradient}
            className="right-[-3%] top-[65%]"
          />
          <ElegantShape
            delay={0.4}
            width={200}
            height={60}
            rotate={-5}  // This is correct, keep as is
            gradient={selectedTheme.gradient}
            className="left-[8%] bottom-[8%]"
          />
          <ElegantShape
            delay={0.6}
            width={160}
            height={45}
            rotate={18}
            gradient={selectedTheme.gradient}
            className="right-[18%] top-[12%]"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl"
          >
            <Card className="bg-black/40 border-white/20 backdrop-blur-lg text-white">
              <CardHeader className="text-center pb-8">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.history.back()}
                    className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 bg-black/20"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(!showSettings)}
                    className="text-white/90 hover:text-white hover:bg-white/10 border border-white/20 bg-black/20"
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                </div>

                <motion.div
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center justify-center mb-4">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center",
                        "bg-gradient-to-r to-transparent border-2 border-white/30",
                        "backdrop-blur-[2px] shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
                        selectedTheme.gradient
                      )}
                      style={{
                        background: `linear-gradient(to right, ${selectedTheme.primary}40, transparent)`,
                      }}
                    >
                      <Target className="w-10 h-10 text-white" />
                    </motion.div>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                    {quizData.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className="text-lg px-6 py-3 border-white/30 text-white/90 backdrop-blur-sm bg-black/20"
                    style={{ backgroundColor: `${selectedTheme.primary}30` }}
                  >
                    Code: {quizData.code}
                  </Badge>
                </motion.div>
              </CardHeader>

              <CardContent className="space-y-8">
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-6 p-6 bg-black/30 rounded-xl border border-white/20"
                    >
                      <h3 className="text-xl font-semibold flex items-center text-white">
                        <Palette className="w-5 h-5 mr-3" />
                        Customize Your Experience
                      </h3>

                      <div>
                        <label className="block text-sm font-medium mb-4 text-white/90">
                          Choose Theme
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {themes.map((theme) => (
                            <motion.button
                              key={theme.name}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedTheme(theme)}
                              className={cn(
                                "p-4 rounded-xl border-2 transition-all backdrop-blur-sm",
                                selectedTheme.name === theme.name
                                  ? "border-white scale-105 shadow-lg bg-black/30"
                                  : "border-white/30 hover:border-white/50 bg-black/20"
                              )}
                              style={{ backgroundColor: `${theme.primary}30` }}
                            >
                              <div
                                className="w-8 h-8 rounded-full mx-auto mb-2"
                                style={{ backgroundColor: theme.primary }}
                              />
                              <div className="text-sm font-medium text-white">
                                {theme.name}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quiz Mode Selection */}
                <div>
                  <label className="block text-lg font-medium mb-6 text-white flex items-center">
                    <Sparkles className="w-5 h-5 mr-3" />
                    Choose Quiz Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizModes.map((mode) => {
                      const IconComponent = mode.icon;
                      return (
                        <motion.button
                          key={mode.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedMode(mode.id)}
                          className={cn(
                            "p-6 rounded-xl border-2 transition-all backdrop-blur-sm text-left",
                            selectedMode === mode.id
                              ? "border-white bg-black/40 scale-105"
                              : "border-white/30 hover:border-white/50 hover:bg-black/20 bg-black/10"
                          )}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-lg flex items-center justify-center",
                                "bg-gradient-to-r to-transparent border border-white/30",
                                mode.color
                              )}
                              style={{
                                background: `linear-gradient(to right, ${selectedTheme.primary}40, transparent)`,
                              }}
                            >
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-white mb-2">
                                {mode.name}
                              </div>
                              <div className="text-sm text-white/80">
                                {mode.description}
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-medium mb-6 text-white flex items-center">
                    <Timer className="w-5 h-5 mr-3" />
                    Select Duration
                  </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {durations.map((duration) => {
                      const IconComponent = duration.icon || Clock;
                      return (
                        <motion.button
                        key={duration.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedDuration(duration.value)}
                        className={cn(
                          "p-6 rounded-xl border-2 transition-all backdrop-blur-sm text-center",
                          selectedDuration === duration.value
                          ? "scale-105"
                          : "hover:border-white/50 hover:bg-black/20 bg-black/10"
                        )}
                        style={{
                          borderColor:
                          selectedDuration === duration.value
                            ? selectedTheme.primary
                            : "rgba(255, 255, 255, 0.3)",
                          backgroundColor:
                          selectedDuration === duration.value
                            ? "rgba(0, 0, 0, 0.4)"
                            : undefined,
                        }}
                        >
                        <IconComponent
                          className="w-8 h-8 mx-auto mb-3"
                          style={{
                          color:
                            selectedDuration === duration.value
                            ? selectedTheme.primary
                            : "white",
                          }}
                        />
                        <div className="text-lg font-semibold text-white mb-1">
                          {duration.label}
                        </div>
                        <div className="text-sm text-white/80">
                          {duration.description}
                        </div>
                        </motion.button>
                      );
                    })}
                    </div>
                </div>

                <div className="bg-black/30 p-6 rounded-xl border border-white/20">
                  <h3 className="font-semibold mb-4 text-white text-lg">
                    Quiz Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {questions.length}
                      </div>
                      <div className="text-sm text-white/80">Questions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedDuration === 0 ? "∞" : `${selectedDuration}m`}
                      </div>
                      <div className="text-sm text-white/80">Duration</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedTheme.name}
                      </div>
                      <div className="text-sm text-white/80">Theme</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white mb-1">
                        {selectedMode === "instant" ? "Instant" : "Traditional"}
                      </div>
                      <div className="text-sm text-white/80">Mode</div>
                    </div>
                  </div>
                  
                  {/* Attempts counter */}
                  {isAuthenticated && (
                    <div className="mt-6 pt-4 border-t border-white/20">
                      <div className="flex items-center justify-center gap-2 text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>Attempts today: {attemptsToday}/2</span>
                        {maxAttemptsReached && (
                          <Badge variant="destructive" className="ml-2">
                            Limit Reached
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={startQuiz}
                    disabled={maxAttemptsReached}
                    className="w-full py-6 text-xl font-semibold rounded-xl"
                    style={{ 
                      backgroundColor: maxAttemptsReached ? "#666" : selectedTheme.primary,
                      cursor: maxAttemptsReached ? "not-allowed" : "pointer"
                    }}
                  >
                    <Play className="w-6 h-6 mr-3" />
                    {maxAttemptsReached ? "Maximum Attempts Reached" : "Start Quiz Adventure"}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentStep === "quiz") {
    const currentQ = questions[currentQuestion];
    const isAnswered = userAnswers[currentQuestion] !== undefined;
    const isCorrect = userAnswers[currentQuestion] === currentQ?.answer;

    return (
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Celebration particles for correct answers */}
        <AnimatePresence>
          {showCelebration && (
            <FloatingParticles color={selectedTheme.primary} count={30} />
          )}
        </AnimatePresence>

        {/* Elegant Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={400}
            height={100}
            rotate={10}
            gradient={selectedTheme.gradient}
            className="left-[-6%] top-[18%]"
          />
          <ElegantShape
            delay={0.5}
            width={320}
            height={80}
            rotate={-10}
            gradient={selectedTheme.gradient}
            className="right-[-2%] top-[60%]"
          />
          <ElegantShape
            delay={0.4}
            width={180}
            height={55}
            rotate={-3}
            gradient={selectedTheme.gradient}
            className="left-[10%] bottom-[10%]"
          />
        </div>

        {/* Timer and Score Display */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          {selectedDuration > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <Card
                className="bg-black/[0.3] backdrop-blur-md border-white/[0.1] shadow-md"
                style={{ padding: "0.25rem 1rem", borderRadius: "1rem" }}
              >
                <CardContent className="p-0">
                  <div className="flex items-center text-white">
                    <Clock
                      className={`w-4 h-4 mr-2`}
                      style={{ color: selectedTheme.accent }}
                    />
                    <span
                      className="font-mono text-lg font-semibold"
                      style={{ color: selectedTheme.accent }}
                    >
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Progress */}
        <div className="relative z-10 pt-6 px-6">
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-white/70 text-sm">
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <Badge
                variant="outline"
                className="border-white/[0.15] text-white/70 px-4 py-2"
                style={{ backgroundColor: `${selectedTheme.primary}20` }}
              >
                {currentQ?.type}
              </Badge>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-white/[0.1] rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  backgroundColor: selectedTheme.primary,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="relative z-10 px-6 pb-6">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg text-white">
                  <CardHeader className="pb-6">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl leading-relaxed font-medium flex-1">
                        {currentQ?.question}
                      </CardTitle>
                      {currentQ?.image && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShowImage(currentQ.image)}
                            className="ml-4 border-white/[0.15] text-white hover:bg-white/[0.05] bg-transparent"
                            style={{
                              backgroundColor: selectedTheme.primary,
                              color: "white",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "white";
                              e.currentTarget.style.color = selectedTheme.primary;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = selectedTheme.primary;
                              e.currentTarget.style.color = "white";
                            }}
                            >
                            <Code className="w-4 h-4 mr-2" />
                            Show Code
                            </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {currentQ?.options.map((option, index) => {
                        const isSelected =
                          userAnswers[currentQuestion] === option;
                        const isCorrectOption = option === currentQ.answer;
                        const showFeedback =
                          selectedMode === "instant" && showAnswer;

                        return (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{
                              scale: showFeedback ? 1 : 1.02,
                              x: showFeedback ? 0 : 8,
                            }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() =>
                              !showFeedback && selectAnswer(option)
                            }
                            disabled={showFeedback}
                            className={cn(
                              "w-full p-6 text-left rounded-xl border-2 transition-all backdrop-blur-sm relative overflow-hidden",
                              showFeedback
                                ? isCorrectOption
                                  ? "border-green-400 bg-green-500/[0.2] shadow-lg shadow-green-500/[0.3]"
                                  : isSelected
                                  ? "border-red-400 bg-red-500/[0.2] shadow-lg shadow-red-500/[0.3]"
                                  : "border-white/[0.15] bg-white/[0.02]"
                                : isSelected
                                ? "border-white bg-white/[0.1] shadow-lg"
                                : "border-white/[0.15] hover:border-white/[0.3] hover:bg-white/[0.03]"
                            )}
                            style={{
                              backgroundColor:
                                !showFeedback && isSelected
                                  ? `${selectedTheme.primary}20`
                                  : undefined,
                            }}
                          >
                            {/* Creative feedback animations */}
                            <AnimatePresence>
                              {showFeedback && isCorrectOption && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="absolute top-4 right-4"
                                >
                                  <CheckCircle className="w-8 h-8 text-green-400" />
                                </motion.div>
                              )}
                              {showFeedback &&
                                isSelected &&
                                !isCorrectOption && (
                                  <motion.div
                                    initial={{ scale: 0, rotate: 180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="absolute top-4 right-4"
                                  >
                                    <XCircle className="w-8 h-8 text-red-400" />
                                  </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center transition-all",
                                  showFeedback
                                    ? isCorrectOption
                                      ? "border-green-400 bg-green-400"
                                      : isSelected
                                      ? "border-red-400 bg-red-400"
                                      : "border-white/[0.4]"
                                    : isSelected
                                    ? "border-white bg-white"
                                    : "border-white/[0.4]"
                                )}
                              >
                                {!showFeedback && isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-4 h-4 rounded-full"
                                    style={{
                                      backgroundColor: selectedTheme.primary,
                                    }}
                                  />
                                )}
                                {showFeedback &&
                                  (isCorrectOption ||
                                    (isSelected && !isCorrectOption)) && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="w-4 h-4 rounded-full bg-white"
                                    />
                                  )}
                              </div>
                              <span className="text-lg">{option}</span>
                            </div>

                            {/* Ripple effect for correct answers */}
                            {showFeedback && isCorrectOption && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0.8 }}
                                animate={{ scale: 4, opacity: 0 }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0 bg-green-400/[0.3] rounded-xl"
                              />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Creative answer explanation for instant mode */}
                    <AnimatePresence>
                      {selectedMode === "instant" && showAnswer && (
                        <motion.div
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -20, scale: 0.9 }}
                          className="mt-6 p-6 rounded-xl border border-white/[0.15] bg-white/[0.03] backdrop-blur-sm"
                        >
                          <div className="flex items-center mb-3">
                            {isCorrect ? (
                              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                            ) : (
                              <XCircle className="w-6 h-6 text-red-400 mr-3" />
                            )}
                            <span
                              className={cn(
                                "text-lg font-semibold",
                                isCorrect ? "text-green-400" : "text-red-400"
                              )}
                            >
                              {isCorrect ? "Correct! Well done!" : "Incorrect"}
                            </span>
                          </div>
                          <p className="text-white/80">
                            The correct answer is:{" "}
                            <span className="font-semibold text-white">
                              {currentQ?.answer}
                            </span>
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <div className="relative z-10 px-6 pb-6">
          <div className="max-w-4xl mx-auto flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className="border-white/[0.15] text-white hover:bg-white/[0.05] px-8 py-3 bg-transparent"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={nextQuestion}
                disabled={selectedMode === "traditional" && !isAnswered}
                className="px-8 py-3 text-lg font-semibold"
                style={{ backgroundColor: selectedTheme.primary }}
              >
                {currentQuestion === questions.length - 1 ? (
                  <>
                    <Trophy className="w-5 h-5 mr-2" />
                    Finish
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Image Dialog */}
        <ImageDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <ImageDialogContent className="bg-black/90 backdrop-blur-md border-white/20 max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Code Reference</h3>
                <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageDialog(false)}
                className="text-white hover:bg-white/10"
                style={{
                  backgroundColor: selectedTheme.primary,
                  color: "white",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = selectedTheme.primary;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = selectedTheme.primary;
                  e.currentTarget.style.color = "white";
                }}
                >
                ✕
                </Button>
            </div>
            {currentImage && (
              <div className="relative w-full h-96 bg-gray-900 rounded-lg overflow-hidden">
                <img
                  src={currentImage}
                  alt="Code reference"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <p className="text-sm text-white/70 mt-4 text-center">
              Refer to this code snippet to answer the question
            </p>
          </ImageDialogContent>
        </ImageDialog>
      </div>
    );
  }

  if (currentStep === "results") {
    const percentage = Math.round((score / questions.length) * 100);
    const scoreInfo = getScoreMessage();

    return (
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Celebration particles for high scores */}
        {percentage >= 80 && (
          <FloatingParticles color={selectedTheme.primary} count={50} />
        )}

        {/* Elegant Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={500}
            height={120}
            rotate={12}
            gradient={selectedTheme.gradient}
            className="left-[-10%] top-[15%]"
          />
          <ElegantShape
            delay={0.5}
            width={400}
            height={100}
            rotate={-15}
            gradient={selectedTheme.gradient}
            className="right-[-5%] top-[70%]"
          />
          <ElegantShape
            delay={0.4}
            width={250}
            height={70}
            rotate={-8}
            gradient={selectedTheme.gradient}
            className="left-[5%] bottom-[5%]"
          />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl"
          >
            <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg text-white text-center">
              <CardHeader className="pb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="mx-auto mb-6"
                >
                  {percentage >= 80 ? (
                    <div className="relative">
                      <Trophy
                        className="w-24 h-24 mx-auto"
                        style={{ color: selectedTheme.primary }}
                      />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star
                          className="w-8 h-8"
                          style={{ color: selectedTheme.accent }}
                        />
                      </motion.div>
                  </div>
                  ) : percentage >= 60 ? (
                    <Award
                      className="w-24 h-24 mx-auto"
                      style={{ color: selectedTheme.secondary }}
                    />
                  ) : (
                    <Target
                      className="w-24 h-24 mx-auto"
                      style={{ color: selectedTheme.accent }}
                    />
                  )}
                </motion.div>

                <CardTitle className="text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                  Quiz{" "}
                  {quizStatus === "timed-out" ? "Time Expired!" : "Completed!"}
                </CardTitle>
                {quizStatus === "timed-out" && (
                  <p className="text-orange-400 text-lg mb-2">
                    Time&apos;s up! Your progress has been saved.
                  </p>
                )}
                <p className={cn("text-xl", scoreInfo.color)}>
                  {scoreInfo.message}
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="relative">
                  <div className="w-40 h-40 mx-auto relative">
                    <svg
                      className="w-full h-full transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="35"
                        stroke={selectedTheme.primary}
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 35}`}
                        initial={{ strokeDashoffset: 2 * Math.PI * 35 }}
                        animate={{
                          strokeDashoffset:
                            2 * Math.PI * 35 * (1 - percentage / 100),
                        }}
                        transition={{
                          duration: 2,
                          delay: 0.5,
                          ease: "easeOut",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                        className="text-4xl font-bold"
                      >
                        {percentage}%
                      </motion.span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {score}
                    </div>
                    <div className="text-sm text-white/60">Correct</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-400 mb-1">
                      {questions.length - score}
                    </div>
                    <div className="text-sm text-white/60">Incorrect</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="bg-white/[0.03] p-6 rounded-xl border border-white/[0.08]"
                  >
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-400 mb-1">
                      {questions.length}
                    </div>
                    <div className="text-sm text-white/60">Total</div>
                  </motion.div>
                </div>

                <div className="flex gap-4" style={{ display: "grid" }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep("review")}
                      style={{
                        backgroundColor: selectedTheme.primary,
                        color: "white",
                      }}
                      className="w-full border-white/[0.15] text-white hover:bg-white/[0.05] py-4 text-lg"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Review Answers
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                      setCurrentStep("setup");
                      setCurrentQuestion(0);
                      setUserAnswers({});
                      setScore(0);
                      setAnswerRevealed({});
                      setQuizStatus("in-progress");
                      setQuizSubmitted(false); 
                      // Reset submission state
                      window.location.reload(); // Refresh the page
                      }}
                      style={{
                      backgroundColor: selectedTheme.primary,
                      color: "white",
                      }}
                      className="w-full border-white/[0.15] text-white hover:bg-white/[0.05] py-4 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Try Again
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button
                      onClick={() => window.history.back()}
                      className="w-full py-4 text-lg font-semibold"
                      style={{ backgroundColor: selectedTheme.primary }}
                    >
                      <ArrowLeft className="w-5 h-5 mr-2" />
                      Back to Course
                    </Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  if (currentStep === "review") {
    return (
      <div className="relative min-h-screen w-full bg-[#030303] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.05] via-transparent to-rose-500/[0.05] blur-3xl" />

        {/* Elegant Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <ElegantShape
            delay={0.3}
            width={450}
            height={110}
            rotate={8}
            gradient={selectedTheme.gradient}
            className="left-[-8%] top-[20%]"
          />
          <ElegantShape
            delay={0.5}
            width={350}
            height={90}
            rotate={-12}  // This is correct, keep as is
            gradient={selectedTheme.gradient}
            className="right-[-3%] top-[65%]"
          />
          <ElegantShape
            delay={0.4}
            width={200}
            height={60}
            rotate={-5}  // This is correct, keep as is
            gradient={selectedTheme.gradient}
            className="left-[8%] bottom-[8%]"
          />
        </div>

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-8"
              >
                <Button
                  variant="ghost"
                  onClick={() => setCurrentStep("results")}
                  className="text-white/60 hover:text-white hover:bg-white/[0.05] border border-white/[0.08]"
                  style={{ backgroundColor: `${selectedTheme.primary}20` }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Results
                </Button>
                <Badge
                  variant="outline"
                  className="text-lg px-6 py-3 border-white/[0.15] text-white/70"
                  style={{ backgroundColor: `${selectedTheme.primary}20` }}
                >
                  Answer Review
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Your Quiz Answers
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/60"
              >
                Review your performance and learn from the correct answers
              </motion.p>
            </div>

            {/* Answer blocks */}
            <div className="grid gap-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.answer;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={cn(
                        "bg-white/[0.02] border-2 backdrop-blur-lg transition-all",
                        isCorrect
                          ? "border-green-500/[0.3] bg-green-500/[0.05]"
                          : "border-red-500/[0.3] bg-red-500/[0.05]"
                      )}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                                        <Badge
                            variant="outline"
                            className="text-sm px-3 py-1 border-white/[0.15] text-white/70"
                            style={{
                              backgroundColor: `${selectedTheme.primary}20`,
                            }}
                          >
                            Question {index + 1}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-sm px-3 py-1 border-white/[0.15] text-white/70"
                            style={{
                              backgroundColor: `${selectedTheme.primary}20`,
                            }}
                          >
                            {question.type}
                          </Badge>
                          {question.image && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShowImage(question.image)}
                              className="border-white/[0.15] text-white hover:bg-white/[0.05] bg-transparent"
                            >
                              <Code className="w-3 h-3 mr-1" />
                              View Code
                            </Button>
                          )}
                        </div>
                        <CardTitle className="text-xl text-white leading-relaxed">
                          {question.question}
                        </CardTitle>
                      </div>
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        className="ml-4"
                      >
                        {isCorrect ? (
                          <div className="w-12 h-12 rounded-full bg-green-500/[0.2] border-2 border-green-400 flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-red-500/[0.2] border-2 border-red-400 flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-red-400" />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* User's answer */}
                      <div className="p-4 rounded-lg border border-white/[0.08] bg-white/[0.02]">
                        <div className="flex items-center gap-3 mb-2">
                          <BookOpen className="w-5 h-5 text-white/60" />
                          <span className="text-sm font-medium text-white/60">
                            Your Answer:
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-lg font-medium",
                            isCorrect ? "text-green-400" : "text-red-400"
                          )}
                        >
                          {userAnswer || "No answer selected"}
                        </p>
                      </div>

                      {/* Correct answer (if different) */}
                      {!isCorrect && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.5 }}
                          className="p-4 rounded-lg border border-green-500/[0.3] bg-green-500/[0.05]"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Lightbulb className="w-5 h-5 text-green-400" />
                            <span className="text-sm font-medium text-green-400">
                              Correct Answer:
                            </span>
                          </div>
                          <p className="text-lg font-medium text-green-400">
                            {question.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: questions.length * 0.1 + 0.5 }}
          className="mt-12"
        >
          <Card className="bg-white/[0.02] border-white/[0.08] backdrop-blur-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Quiz Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-green-500/[0.1] border border-green-500/[0.3]">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {score}
                  </div>
                  <div className="text-sm text-white/60">
                    Correct Answers
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-red-500/[0.1] border border-red-500/[0.3]">
                  <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-400 mb-1">
                    {questions.length - score}
                  </div>
                  <div className="text-sm text-white/60">
                    Incorrect Answers
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/[0.05] border border-white/[0.15]">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-white/60">Final Score</div>
                </div>
              </div>

              <div
                className="flex gap-4 mt-8 justify-center"
                style={{ display: "-grid" }}
              >
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("results")}
                  className="border-white/[0.15] text-white hover:bg-white/[0.05] px-8 py-3"
                  style={{
                    backgroundColor: selectedTheme.primary,
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = selectedTheme.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = selectedTheme.primary;
                    e.currentTarget.style.color = "white";
                  }}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Results
                </Button>
                <Button
                  onClick={() => window.history.back()}
                  className="px-8 py-3 font-semibold"
                  style={{ backgroundColor: selectedTheme.primary }}
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Back to Course
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>

    {/* Image Dialog */}
    <ImageDialog open={showImageDialog} onOpenChange={setShowImageDialog}>
      <ImageDialogContent className="bg-black/90 backdrop-blur-md border-white/20 max-w-4xl">
        <DialogHeader className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Code Reference</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageDialog(false)}
            className="text-white hover:bg-white/10"
          >
            ✕
          </Button>
        </DialogHeader>
        {currentImage && (
            <div className="relative w-full h-96 bg-transparent rounded-lg overflow-hidden">
            <img
              src={currentImage}
              alt="Code reference"
              className="w-full h-full object-contain"
            />
            </div>
        )}
        <p className="text-sm text-white/70 mt-4 text-center">
          Refer to this code snippet to answer the question num.{currentQuestion + 1}
        </p>
      </ImageDialogContent>
    </ImageDialog>
  </div>
);
  }
  return null;
}