import mongoose, { Document, Schema } from 'mongoose';

export interface IAchievement extends Document {
  _id: string;
  name: string;
  description: string;
  icon: string;
  category: 'general' | 'subject' | 'streak' | 'social' | 'milestone';
  criteria: {
    type: 'score' | 'streak' | 'games_played' | 'time_spent' | 'perfect_game' | 'first_place' | 'help_others' | 'learn_skill' | 'complete_subject';
    value: number;
    condition: string;
    subject?: string;
    timeframe?: string;
  };
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;

  // Methods
  checkProgress(userStats: any): { completed: boolean; progress: number };
  calculateReward(): number;
}

export interface IUserAchievement extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  achievementId: mongoose.Types.ObjectId;
  earnedAt: Date;
  progress: number;
  isCompleted: boolean;
  metadata: any;
  achievement: IAchievement;

  // Methods
  updateProgress(newProgress: number): Promise<IUserAchievement>;
  markCompleted(): Promise<IUserAchievement>;
}

const achievementSchema = new Schema<IAchievement>({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  icon: {
    type: String,
    required: [true, 'Achievement icon is required'],
    maxlength: [10, 'Icon cannot exceed 10 characters']
  },
  category: {
    type: String,
    required: [true, 'Achievement category is required'],
    enum: {
      values: ['general', 'subject', 'streak', 'social', 'milestone'],
      message: 'Category must be general, subject, streak, social, or milestone'
    }
  },
  criteria: {
    type: {
      type: String,
      required: [true, 'Criteria type is required'],
      enum: {
        values: ['score', 'streak', 'games_played', 'time_spent', 'perfect_game', 'first_place', 'help_others', 'learn_skill', 'complete_subject'],
        message: 'Invalid criteria type'
      }
    },
    value: {
      type: Number,
      required: [true, 'Criteria value is required'],
      min: [1, 'Criteria value must be at least 1']
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      maxlength: [100, 'Condition cannot exceed 100 characters']
    },
    subject: {
      type: String,
      enum: ['math', 'science', 'language', 'creativity']
    },
    timeframe: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'alltime']
    }
  },
  points: {
    type: Number,
    required: [true, 'Points value is required'],
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000']
  },
  rarity: {
    type: String,
    required: [true, 'Rarity is required'],
    enum: {
      values: ['common', 'rare', 'epic', 'legendary'],
      message: 'Rarity must be common, rare, epic, or legendary'
    },
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// User Achievement Schema
const userAchievementSchema = new Schema<IUserAchievement>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  achievementId: {
    type: Schema.Types.ObjectId,
    ref: 'Achievement',
    required: [true, 'Achievement ID is required']
  },
  earnedAt: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be negative']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for Achievement
achievementSchema.index({ category: 1, isActive: 1 });
achievementSchema.index({ rarity: 1, points: -1 });
achievementSchema.index({ 'criteria.type': 1, 'criteria.subject': 1 });

// Indexes for UserAchievement
userAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
userAchievementSchema.index({ userId: 1, isCompleted: 1 });
userAchievementSchema.index({ userId: 1, earnedAt: -1 });

// Virtual fields for Achievement
achievementSchema.virtual('difficulty').get(function() {
  const rarityMap = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4
  };
  return rarityMap[this.rarity];
});

achievementSchema.virtual('color').get(function() {
  const colorMap = {
    common: '#808080',    // Gray
    rare: '#0066cc',      // Blue
    epic: '#9933cc',      // Purple
    legendary: '#ff9900'  // Orange
  };
  return colorMap[this.rarity];
});

// Virtual fields for UserAchievement
userAchievementSchema.virtual('progressPercentage').get(function() {
  // This would need to be calculated based on the achievement criteria
  return Math.min(100, this.progress);
});

userAchievementSchema.virtual('isInProgress').get(function() {
  return !this.isCompleted && this.progress > 0;
});

// Instance methods for Achievement
achievementSchema.methods.checkProgress = function(userStats: any): { completed: boolean; progress: number } {
  const { type, value, subject, timeframe } = this.criteria;
  let currentValue = 0;
  let progress = 0;
  let completed = false;

  switch (type) {
    case 'score':
      currentValue = userStats.totalScore || 0;
      break;
    case 'streak':
      currentValue = userStats.currentStreak || 0;
      break;
    case 'games_played':
      currentValue = userStats.totalGamesPlayed || 0;
      break;
    case 'time_spent':
      currentValue = userStats.totalTimeSpent || 0;
      break;
    case 'perfect_game':
      currentValue = userStats.perfectGames || 0;
      break;
    case 'first_place':
      currentValue = userStats.firstPlaceWins || 0;
      break;
    default:
      currentValue = 0;
  }

  progress = Math.min(100, Math.round((currentValue / value) * 100));
  completed = currentValue >= value;

  return { completed, progress };
};

achievementSchema.methods.calculateReward = function(): number {
  const rarityMultiplier = {
    common: 1,
    rare: 1.5,
    epic: 2,
    legendary: 3
  };
  return Math.round(this.points * rarityMultiplier[this.rarity]);
};

// Instance methods for UserAchievement
userAchievementSchema.methods.updateProgress = async function(newProgress: number): Promise<IUserAchievement> {
  this.progress = newProgress;
  if (newProgress >= 100 && !this.isCompleted) {
    this.isCompleted = true;
    this.earnedAt = new Date();
  }
  return this.save();
};

userAchievementSchema.methods.markCompleted = async function(): Promise<IUserAchievement> {
  this.isCompleted = true;
  this.progress = 100;
  this.earnedAt = new Date();
  return this.save();
};

// Pre-save middleware for UserAchievement
userAchievementSchema.pre('save', async function(next) {
  if (this.isNew) {
    // Populate achievement reference
    await this.populate('achievementId');
  }
  next();
});

// Static methods for Achievement
achievementSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, isActive: true })
    .sort({ rarity: 1, points: -1 });
};

achievementSchema.statics.findByRarity = function(rarity: string) {
  return this.find({ rarity, isActive: true })
    .sort({ points: -1 });
};

achievementSchema.statics.searchAchievements = function(query: string) {
  return this.find({
    $text: { $search: query },
    isActive: true
  }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// Static methods for UserAchievement
userAchievementSchema.statics.findByUser = function(userId: string, completedOnly = false) {
  const query: any = { userId };
  if (completedOnly) {
    query.isCompleted = true;
  }
  return this.find(query)
    .populate('achievementId')
    .sort({ earnedAt: -1 });
};

userAchievementSchema.statics.getInProgressAchievements = function(userId: string) {
  return this.find({
    userId,
    isCompleted: false,
    progress: { $gt: 0 }
  })
    .populate('achievementId')
    .sort({ progress: -1 });
};

userAchievementSchema.statics.getUserStats = function(userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$userId',
        totalAchievements: { $sum: 1 },
        completedAchievements: {
          $sum: { $cond: ['$isCompleted', 1, 0] }
        },
        totalPoints: {
          $sum: {
            $cond: ['$isCompleted', '$achievement.points', 0]
          }
        },
        rareAchievements: {
          $sum: {
            $cond: [
              { $and: ['$isCompleted', { $eq: ['$achievement.rarity', 'rare'] }] },
              1,
              0
            ]
          }
        },
        epicAchievements: {
          $sum: {
            $cond: [
              { $and: ['$isCompleted', { $eq: ['$achievement.rarity', 'epic'] }] },
              1,
              0
            ]
          }
        },
        legendaryAchievements: {
          $sum: {
            $cond: [
              { $and: ['$isCompleted', { $eq: ['$achievement.rarity', 'legendary'] }] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

const Achievement = mongoose.model<IAchievement>('Achievement', achievementSchema);
const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', userAchievementSchema);

export { Achievement, UserAchievement };