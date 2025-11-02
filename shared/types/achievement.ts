export interface Achievement {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  criteria: AchievementCriteria;
  points: number;
  rarity: AchievementRarity;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
}

export type AchievementCategory = 'general' | 'subject' | 'streak' | 'social' | 'milestone';

export interface AchievementCriteria {
  type: AchievementType;
  value: number;
  condition: string;
  subject?: string;
  timeframe?: string;
}

export type AchievementType =
  | 'score'
  | 'streak'
  | 'games_played'
  | 'time_spent'
  | 'perfect_game'
  | 'first_place'
  | 'help_others'
  | 'learn_skill'
  | 'complete_subject';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface UserAchievement {
  _id: string;
  userId: string;
  achievementId: string;
  earnedAt: Date;
  progress: number;
  isCompleted: boolean;
  metadata: any;
  achievement: Achievement;
}

export interface AchievementProgress {
  achievementId: string;
  achievement: Achievement;
  currentProgress: number;
  targetProgress: number;
  percentageComplete: number;
  isCompleted: boolean;
  estimatedCompletion?: Date;
  nextMilestone?: number;
}

export interface AchievementNotification {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
  shareable: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  subject?: string;
  timeframe: LeaderboardTimeframe;
  classroomId?: string;
  lastUpdated: Date;
  change: number; // Rank change from previous period
}

export type LeaderboardTimeframe = 'daily' | 'weekly' | 'monthly' | 'alltime';

export interface AchievementState {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  progress: AchievementProgress[];
  leaderboard: LeaderboardEntry[];
  notifications: AchievementNotification[];
  isLoading: boolean;
  error: string | null;
  refreshAchievements: () => Promise<void>;
  claimReward: (achievementId: string) => Promise<void>;
  shareAchievement: (achievementId: string) => Promise<void>;
}

export interface Reward {
  type: 'points' | 'badge' | 'avatar' | 'unlock' | 'title';
  value: string | number;
  description: string;
  icon: string;
  rarity: AchievementRarity;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  category: AchievementCategory;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
  isVisible: boolean;
}