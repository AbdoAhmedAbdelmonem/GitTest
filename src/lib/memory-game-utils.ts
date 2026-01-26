// Memory Game Utility Functions

export interface QuizQuestion {
  numb: number;
  type: string;
  question: string;
  answer: string;
  options: string[];
  image: string | null;
  explanation: string;
}

export interface MemoryCard {
  id: string;
  pairId: number;
  content: string;
  type: 'question' | 'answer';
  isFlipped: boolean;
  isMatched: boolean;
}

export interface GameState {
  cards: MemoryCard[];
  moves: number;
  matches: number;
  totalPairs: number;
  startTime: number | null;
  isComplete: boolean;
}

/**
 * Truncate text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Extract the answer letter and text (e.g., "B) Answer text" -> "Answer text")
 */
export function cleanAnswerText(answer: string): string {
  // Remove the letter prefix like "A) ", "B) ", etc.
  return answer.replace(/^[A-D]\)\s*/, '');
}

/**
 * Fisher-Yates shuffle algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Transform quiz questions into memory card pairs
 */
export function createMemoryCards(
  questions: QuizQuestion[],
  pairCount: number
): MemoryCard[] {
  // Select random questions (up to pairCount)
  const selectedQuestions = shuffleArray(questions).slice(0, pairCount);
  
  const cards: MemoryCard[] = [];
  
  selectedQuestions.forEach((q, index) => {
    // Question card
    cards.push({
      id: `q-${index}`,
      pairId: index,
      content: truncateText(q.question, 100),
      type: 'question',
      isFlipped: false,
      isMatched: false,
    });
    
    // Answer card
    cards.push({
      id: `a-${index}`,
      pairId: index,
      content: truncateText(cleanAnswerText(q.answer), 100),
      type: 'answer',
      isFlipped: false,
      isMatched: false,
    });
  });
  
  return shuffleArray(cards);
}

/**
 * Calculate score based on moves and time
 */
export function calculateScore(
  moves: number,
  timeSeconds: number,
  totalPairs: number
): { score: number; stars: number; message: string } {
  // Perfect score would be totalPairs moves (one flip per pair - impossible)
  // Good score is around 2x the pairs (flip each pair once with some misses)
  const perfectMoves = totalPairs * 2;
  const goodMoves = totalPairs * 3;
  
  // Base score from moves
  let moveScore = Math.max(0, 100 - ((moves - perfectMoves) * 5));
  
  // Time bonus (subtract points for slow play)
  const avgTimePerPair = timeSeconds / totalPairs;
  let timeScore = Math.max(0, 50 - Math.floor(avgTimePerPair / 2));
  
  const totalScore = Math.min(100, Math.round((moveScore + timeScore) / 1.5));
  
  // Stars based on score
  let stars = 1;
  let message = "Keep practicing! 🎯";
  
  if (totalScore >= 90) {
    stars = 3;
    message = "Perfect memory! 🧠✨";
  } else if (totalScore >= 70) {
    stars = 2;
    message = "Great job! 🌟";
  } else if (totalScore >= 50) {
    stars = 2;
    message = "Good effort! 💪";
  }
  
  return { score: totalScore, stars, message };
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Difficulty settings
 */
export const DIFFICULTY_LEVELS = {
  easy: { pairs: 6, gridCols: 3, label: 'Easy', emoji: '😊' },
  medium: { pairs: 10, gridCols: 4, label: 'Medium', emoji: '🤔' },
  hard: { pairs: 15, gridCols: 5, label: 'Hard', emoji: '🔥' },
} as const;

export type DifficultyLevel = keyof typeof DIFFICULTY_LEVELS;

