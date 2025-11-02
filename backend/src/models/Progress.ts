import mongoose, { Document, Schema } from 'mongoose';

export interface IProgress extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  gameId: mongoose.Types.ObjectId;
  sessionData: {
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
  };
  responses: Array<{
    questionId: string;
    userAnswer: string;
    isCorrect: boolean;
    timeSpent: number;
    attemptNumber: number;
  }>;
  achievements: Array<{
    type: string;
    earnedAt: Date;
    points: number;
  }>;
  difficulty: number;
  streak: number;
  completed: boolean;
  createdAt: Date;

  // Methods
  calculatePercentage(): number;
  addResponse(response: any): void;
  completeSession(): void;
}

const progressSchema = new Schema<IProgress>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  gameId: {
    type: Schema.Types.ObjectId,
    ref: 'Game',
    required: [true, 'Game ID is required']
  },
  sessionData: {
    sessionId: {
      type: String,
      required: [true, 'Session ID is required'],
      unique: true
    },
    startTime: {
      type: Date,
      required: [true, 'Start time is required'],
      default: Date.now
    },
    endTime: {
      type: Date
    },
    duration: {
      type: Number,
      default: 0,
      min: [0, 'Duration cannot be negative']
    },
    score: {
      type: Number,
      default: 0,
      min: [0, 'Score cannot be negative']
    },
    maxScore: {
      type: Number,
      required: [true, 'Max score is required'],
      min: [1, 'Max score must be at least 1']
    },
    percentage: {
      type: Number,
      default: 0,
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    },
    questionsAttempted: {
      type: Number,
      default: 0,
      min: [0, 'Questions attempted cannot be negative']
    },
    questionsCorrect: {
      type: Number,
      default: 0,
      min: [0, 'Questions correct cannot be negative']
    },
    hintsUsed: {
      type: Number,
      default: 0,
      min: [0, 'Hints used cannot be negative']
    },
    skipsUsed: {
      type: Number,
      default: 0,
      min: [0, 'Skips used cannot be negative']
    }
  },
  responses: [{
    questionId: {
      type: String,
      required: [true, 'Question ID is required']
    },
    userAnswer: {
      type: String,
      required: [true, 'User answer is required']
    },
    isCorrect: {
      type: Boolean,
      required: [true, 'Correctness is required']
    },
    timeSpent: {
      type: Number,
      required: [true, 'Time spent is required'],
      min: [0, 'Time spent cannot be negative']
    },
    attemptNumber: {
      type: Number,
      required: [true, 'Attempt number is required'],
      min: [1, 'Attempt number must be at least 1']
    }
  }],
  achievements: [{
    type: {
      type: String,
      required: [true, 'Achievement type is required']
    },
    earnedAt: {
      type: Date,
      required: [true, 'Achievement date is required'],
      default: Date.now
    },
    points: {
      type: Number,
      required: [true, 'Achievement points are required'],
      min: [0, 'Achievement points cannot be negative']
    }
  }],
  difficulty: {
    type: Number,
    required: [true, 'Difficulty is required'],
    min: [1, 'Difficulty must be at least 1'],
    max: [10, 'Difficulty cannot exceed 10'],
    default: 5
  },
  streak: {
    type: Number,
    default: 0,
    min: [0, 'Streak cannot be negative']
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
progressSchema.index({ userId: 1, gameId: 1 });
progressSchema.index({ userId: 1, createdAt: -1 });
progressSchema.index({ gameId: 1, completed: 1 });
progressSchema.index({ 'sessionData.percentage': -1 });
progressSchema.index({ completed: 1, 'sessionData.score': -1 });

// Virtual fields
progressSchema.virtual('accuracy').get(function() {
  if (this.sessionData.questionsAttempted === 0) return 0;
  return Math.round((this.sessionData.questionsCorrect / this.sessionData.questionsAttempted) * 100);
});

progressSchema.virtual('averageTimePerQuestion').get(function() {
  if (this.responses.length === 0) return 0;
  const totalTime = this.responses.reduce((sum, response) => sum + response.timeSpent, 0);
  return Math.round(totalTime / this.responses.length);
});

progressSchema.virtual('performanceLevel').get(function() {
  const percentage = this.sessionData.percentage;
  if (percentage >= 90) return 'excellent';
  if (percentage >= 80) return 'good';
  if (percentage >= 70) return 'average';
  if (percentage >= 60) return 'below_average';
  return 'poor';
});

// Instance methods
progressSchema.methods.calculatePercentage = function(): number {
  if (this.sessionData.maxScore === 0) return 0;
  return Math.round((this.sessionData.score / this.sessionData.maxScore) * 100);
};

progressSchema.methods.addResponse = function(response: any): void {
  this.responses.push(response);
  this.sessionData.questionsAttempted += 1;

  if (response.isCorrect) {
    this.sessionData.questionsCorrect += 1;
    this.sessionData.score += response.points || 0;
    this.streak += 1;
  } else {
    this.streak = 0;
  }

  // Update percentage
  this.sessionData.percentage = this.calculatePercentage();
};

progressSchema.methods.completeSession = function(): void {
  this.sessionData.endTime = new Date();
  this.sessionData.duration = Math.round(
    (this.sessionData.endTime.getTime() - this.sessionData.startTime.getTime()) / 1000
  );
  this.completed = true;
  this.sessionData.percentage = this.calculatePercentage();
};

// Pre-save middleware
progressSchema.pre('save', function(next) {
  if (this.isModified('sessionData.score') || this.isModified('sessionData.maxScore')) {
    this.sessionData.percentage = this.calculatePercentage();
  }
  next();
});

// Static methods
progressSchema.statics.findByUser = function(userId: string, limit = 10) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('gameId', 'title subject difficulty');
};

progressSchema.statics.findByGame = function(gameId: string, limit = 50) {
  return this.find({ gameId })
    .sort({ 'sessionData.percentage': -1, 'sessionData.score': -1 })
    .limit(limit)
    .populate('userId', 'username profile.firstName profile.lastName profile.avatar');
};

progressSchema.statics.getUserStats = function(userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$userId',
        totalGames: { $sum: 1 },
        completedGames: {
          $sum: { $cond: ['$completed', 1, 0] }
        },
        averageScore: {
          $avg: '$sessionData.percentage'
        },
        totalTimeSpent: {
          $sum: '$sessionData.duration'
        },
        totalPoints: {
          $sum: '$sessionData.score'
        },
        bestStreak: {
          $max: '$streak'
        }
      }
    }
  ]);
};

progressSchema.statics.getGameStats = function(gameId: string) {
  return this.aggregate([
    { $match: { gameId: new mongoose.Types.ObjectId(gameId) } },
    {
      $group: {
        _id: '$gameId',
        totalPlays: { $sum: 1 },
        completions: {
          $sum: { $cond: ['$completed', 1, 0] }
        },
        averageScore: {
          $avg: '$sessionData.percentage'
        },
        averageTime: {
          $avg: '$sessionData.duration'
        },
        completionRate: {
          $avg: { $cond: ['$completed', 1, 0] }
        }
      }
    }
  ]);
};

const Progress = mongoose.model<IProgress>('Progress', progressSchema);

export default Progress;