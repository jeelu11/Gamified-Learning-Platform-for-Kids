export interface Game {
  _id: string;
  title: string;
  description: string;
  subject: GameSubject;
  category: GameCategory;
  difficulty: number;
  ageRange: {
    min: number;
    max: number;
  };
  gameType: GameType;
  content: GameContent;
  learningObjectives: string[];
  estimatedTime: number;
  isPremium: boolean;
  isActive: boolean;
  playCount: number;
  averageRating: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type GameSubject = 'math' | 'science' | 'language' | 'creativity';

export type GameCategory =
  | 'arithmetic'
  | 'geometry'
  | 'algebra'
  | 'biology'
  | 'chemistry'
  | 'physics'
  | 'astronomy'
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'spelling'
  | 'art'
  | 'music'
  | 'logic'
  | 'pattern'
  | 'memory';

export type GameType = 'quiz' | 'puzzle' | 'simulation' | 'creative' | 'matching';

export interface GameContent {
  instructions: string;
  questions: Question[];
  assets: GameAssets;
}

export interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'drag-drop' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  hint?: string;
  timeLimit?: number;
  difficulty: number;
  assets?: {
    image?: string;
    audio?: string;
    animation?: string;
  };
}

export interface GameAssets {
  images: string[];
  sounds: string[];
  animations: string[];
}

export interface GameSession {
  sessionId: string;
  userId: string;
  gameId: string;
  status: 'active' | 'completed' | 'paused' | 'abandoned';
  currentScore: number;
  maxScore: number;
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: number;
  timeLimit?: number;
  startTime: Date;
  lastActivity: Date;
  endTime?: Date;
  difficulty: number;
  responses: GameResponse[];
  achievements: SessionAchievement[];
}

export interface GameResponse {
  questionId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  timeSpent: number;
  attemptNumber: number;
  points: number;
  usedHint: boolean;
}

export interface SessionAchievement {
  type: string;
  earnedAt: Date;
  points: number;
  metadata?: any;
}

export interface GameState {
  currentGame: Game | null;
  sessionData: GameSession | null;
  score: number;
  lives: number;
  currentQuestion: number;
  answers: GameResponse[];
  isPlaying: boolean;
  isPaused: boolean;
  timeRemaining: number;
  difficulty: number;
  streak: number;
  multiplier: number;
}

export interface GameStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  favoriteSubject: GameSubject;
  strongestCategory: GameCategory;
  improvementArea: GameCategory;
  currentStreak: number;
  bestStreak: number;
}