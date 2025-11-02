import { GameSubject, GameCategory } from './game';

export interface ProgressRecord {
  _id: string;
  userId: string;
  gameId: string;
  sessionData: SessionData;
  responses: ProgressResponse[];
  achievements: ProgressAchievement[];
  difficulty: number;
  streak: number;
  completed: boolean;
  createdAt: Date;
}

export interface SessionData {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  score: number;
  maxScore: number;
  percentage: number;
  questionsAttempted: number;
  questionsCorrect: number;
  hintsUsed: number;
  skipsUsed: number;
}

export interface ProgressResponse {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  attemptNumber: number;
}

export interface ProgressAchievement {
  type: string;
  earnedAt: Date;
  points: number;
}

export interface UserProgress {
  userId: string;
  overallStats: OverallStats;
  subjectStats: SubjectStats[];
  recentSessions: ProgressRecord[];
  learningPaths: LearningPath[];
  recommendations: GameRecommendation[];
  weeklyStats: WeeklyStats;
  monthlyStats: MonthlyStats;
}

export interface OverallStats {
  totalGamesPlayed: number;
  totalScore: number;
  averageScore: number;
  totalTimeSpent: number;
  currentLevel: number;
  totalPoints: number;
  currentStreak: number;
  bestStreak: number;
  achievementsEarned: number;
  favoriteSubject: GameSubject;
  lastActiveDate: Date;
}

export interface SubjectStats {
  subject: GameSubject;
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
  masteryLevel: number;
  recentPerformance: number[];
  strengths: string[];
  weaknesses: string[];
  nextMilestone: Milestone;
}

export interface Milestone {
  type: 'score' | 'games' | 'time' | 'streak';
  target: number;
  current: number;
  reward: number;
  description: string;
}

export interface LearningPath {
  pathId: string;
  title: string;
  description: string;
  subject: GameSubject;
  difficulty: number;
  estimatedTime: number;
  progress: number;
  completedGames: string[];
  totalGames: number;
  isLocked: boolean;
  prerequisites: string[];
  rewards: PathReward[];
}

export interface PathReward {
  type: 'points' | 'badge' | 'avatar' | 'unlock';
  value: string | number;
  description: string;
}

export interface GameRecommendation {
  gameId: string;
  reason: RecommendationReason;
  priority: number;
  estimatedBenefit: number;
  subject: GameSubject;
  difficulty: number;
}

export type RecommendationReason =
  | 'weak_area'
  | 'next_level'
  | 'similar_to_liked'
  | 'age_appropriate'
  | 'trending'
  | 'curriculum_aligned';

export interface WeeklyStats {
  weekStart: Date;
  gamesPlayed: number;
  timeSpent: number;
  averageScore: number;
  pointsEarned: number;
  achievementsEarned: number;
  dailyBreakdown: DailyStats[];
}

export interface MonthlyStats {
  month: number;
  year: number;
  gamesPlayed: number;
  timeSpent: number;
  averageScore: number;
  pointsEarned: number;
  achievementsEarned: number;
  weeklyBreakdown: WeeklyStats[];
  improvementAreas: GameCategory[];
  strengths: GameCategory[];
}

export interface DailyStats {
  date: Date;
  gamesPlayed: number;
  timeSpent: number;
  score: number;
  pointsEarned: number;
  achievements: string[];
}

export interface ProgressState {
  userProgress: UserProgress | null;
  isLoading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  updateGoal: (goal: LearningGoal) => Promise<void>;
}