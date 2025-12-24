// Recap Types for Chameleon 2025 Year-in-Review

export interface RecapData {
  // User Info
  username: string
  profileImage?: string
  specialization: string
  level: number
  memberSince: string
  daysSinceJoined: number
  
  // Quiz Statistics
  totalQuizzes: number
  bestScore: number
  averageScore: number
  totalQuestionsAnswered: number
  
  // Tournament Stats
  tournamentRank?: number
  tournamentPoints: number
  
  // Insights
  favoriteMode: 'speed' | 'traditional' | 'balanced'
  mostActiveMonth: string
  mostActiveDay: string
  averageQuizDuration: string
  perfectScoreCount: number
  
  // Personalization
  personalizedTitle: string
  personalizedMessage: string
  
  // Engagement
  longestStreak: number
  quizzesThisYear: number
}

export interface RecapSlide {
  id: string
  type: 'intro' | 'journey' | 'stats' | 'tournament' | 'style' | 'peak' | 'specialization' | 'community' | 'celebration' | 'outro'
  title: string
  subtitle?: string
  mainValue?: string | number
  description?: string
  gradient: string
  icon?: string
  animationType: 'fade' | 'scale' | 'slide' | 'bounce'
}

// Personalized titles based on user performance
export const PERSONALIZED_TITLES: Record<string, { title: string; message: string }> = {
  'quiz-champion': {
    title: '🏆 Quiz Champion',
    message: 'Your quiz scores are legendary! You\'ve mastered the art of learning.'
  },
  'speed-demon': {
    title: '⚡ Speed Demon',
    message: 'Lightning-fast and accurate! Time bends to your will.'
  },
  'consistent-learner': {
    title: '📚 Consistent Learner',
    message: 'Your dedication to learning is inspiring. Every day counts!'
  },
  'perfectionist': {
    title: '✨ Perfectionist',
    message: 'Multiple perfect scores! You set the bar high.'
  },
  'rising-star': {
    title: '⭐ Rising Star',
    message: 'Your journey has just begun, and it\'s already shining bright!'
  },
  'tournament-warrior': {
    title: '⚔️ Tournament Warrior',
    message: 'Battling your way to the top of the leaderboard!'
  },
  'knowledge-seeker': {
    title: '🔍 Knowledge Seeker',
    message: 'Curiosity drives you. Keep exploring!'
  },
  'chameleon-veteran': {
    title: '🦎 Chameleon Veteran',
    message: 'A true Chameleon! Adapting and thriving since the beginning.'
  }
}

// Gradient themes for each slide type
export const SLIDE_GRADIENTS: Record<string, string> = {
  intro: 'from-purple-900 via-indigo-900 to-blue-900',
  journey: 'from-blue-900 via-cyan-900 to-teal-900',
  stats: 'from-green-900 via-emerald-900 to-teal-900',
  tournament: 'from-yellow-900 via-orange-900 to-red-900',
  style: 'from-pink-900 via-rose-900 to-red-900',
  peak: 'from-indigo-900 via-purple-900 to-pink-900',
  specialization: 'from-cyan-900 via-blue-900 to-indigo-900',
  community: 'from-violet-900 via-purple-900 to-fuchsia-900',
  celebration: 'from-amber-900 via-yellow-900 to-orange-900',
  outro: 'from-slate-900 via-gray-900 to-zinc-900'
}
