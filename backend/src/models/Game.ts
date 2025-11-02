import mongoose, { Document, Schema } from 'mongoose';

export interface IGame extends Document {
  _id: string;
  title: string;
  description: string;
  subject: 'math' | 'science' | 'language' | 'creativity';
  category: string;
  difficulty: number;
  ageRange: {
    min: number;
    max: number;
  };
  gameType: 'quiz' | 'puzzle' | 'simulation' | 'creative' | 'matching';
  content: {
    instructions: string;
    questions: Array<{
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
    }>;
    assets: {
      images: string[];
      sounds: string[];
      animations: string[];
    };
  };
  learningObjectives: string[];
  estimatedTime: number;
  isPremium: boolean;
  isActive: boolean;
  playCount: number;
  averageRating: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  incrementPlayCount(): Promise<IGame>;
  updateRating(newRating: number): Promise<IGame>;
  getQuestionsByDifficulty(difficulty: number): any[];
}

const gameSchema = new Schema<IGame>({
  title: {
    type: String,
    required: [true, 'Game title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Game description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    enum: {
      values: ['math', 'science', 'language', 'creativity'],
      message: 'Subject must be math, science, language, or creativity'
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: [
        'arithmetic', 'geometry', 'algebra',
        'biology', 'chemistry', 'physics', 'astronomy',
        'vocabulary', 'grammar', 'reading', 'spelling',
        'art', 'music', 'logic', 'pattern', 'memory'
      ],
      message: 'Invalid category'
    }
  },
  difficulty: {
    type: Number,
    required: [true, 'Difficulty level is required'],
    min: [1, 'Difficulty must be at least 1'],
    max: [10, 'Difficulty cannot exceed 10']
  },
  ageRange: {
    min: {
      type: Number,
      required: [true, 'Minimum age is required'],
      min: [6, 'Minimum age must be at least 6'],
      max: [12, 'Minimum age cannot exceed 12']
    },
    max: {
      type: Number,
      required: [true, 'Maximum age is required'],
      min: [6, 'Maximum age must be at least 6'],
      max: [12, 'Maximum age cannot exceed 12']
    }
  },
  gameType: {
    type: String,
    required: [true, 'Game type is required'],
    enum: {
      values: ['quiz', 'puzzle', 'simulation', 'creative', 'matching'],
      message: 'Game type must be quiz, puzzle, simulation, creative, or matching'
    }
  },
  content: {
    instructions: {
      type: String,
      required: [true, 'Instructions are required'],
      maxlength: [1000, 'Instructions cannot exceed 1000 characters']
    },
    questions: [{
      id: {
        type: String,
        required: true
      },
      question: {
        type: String,
        required: [true, 'Question text is required'],
        maxlength: [500, 'Question cannot exceed 500 characters']
      },
      type: {
        type: String,
        required: [true, 'Question type is required'],
        enum: ['multiple-choice', 'true-false', 'fill-blank', 'drag-drop', 'matching']
      },
      options: [{
        type: String,
        maxlength: [200, 'Option cannot exceed 200 characters']
      }],
      correctAnswer: {
        type: Schema.Types.Mixed,
        required: [true, 'Correct answer is required']
      },
      explanation: {
        type: String,
        required: [true, 'Explanation is required'],
        maxlength: [500, 'Explanation cannot exceed 500 characters']
      },
      points: {
        type: Number,
        required: [true, 'Points value is required'],
        min: [1, 'Points must be at least 1'],
        max: [100, 'Points cannot exceed 100']
      },
      hint: {
        type: String,
        maxlength: [200, 'Hint cannot exceed 200 characters']
      },
      timeLimit: {
        type: Number,
        min: [10, 'Time limit must be at least 10 seconds'],
        max: [300, 'Time limit cannot exceed 300 seconds']
      },
      difficulty: {
        type: Number,
        min: [1, 'Question difficulty must be at least 1'],
        max: [10, 'Question difficulty cannot exceed 10'],
        default: 5
      },
      assets: {
        image: String,
        audio: String,
        animation: String
      }
    }],
    assets: {
      images: [String],
      sounds: [String],
      animations: [String]
    }
  },
  learningObjectives: [{
    type: String,
    maxlength: [100, 'Learning objective cannot exceed 100 characters']
  }],
  estimatedTime: {
    type: Number,
    required: [true, 'Estimated time is required'],
    min: [1, 'Estimated time must be at least 1 minute'],
    max: [60, 'Estimated time cannot exceed 60 minutes']
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  playCount: {
    type: Number,
    default: 0,
    min: [0, 'Play count cannot be negative']
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
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

// Indexes
gameSchema.index({ subject: 1, category: 1 });
gameSchema.index({ isActive: 1, difficulty: 1 });
gameSchema.index({ ageRange: 1 });
gameSchema.index({ title: 'text', description: 'text' });
gameSchema.index({ isPremium: 1, averageRating: -1 });
gameSchema.index({ playCount: -1 });

// Virtual fields
gameSchema.virtual('averageScore').get(function() {
  return Math.round(this.averageRating * 20); // Convert 5-star to 100-point scale
});

gameSchema.virtual('ratingCount', {
  ref: 'Progress',
  localField: '_id',
  foreignField: 'gameId',
  count: true,
  match: { completed: true, 'sessionData.score': { $gt: 0 } }
});

// Instance methods
gameSchema.methods.incrementPlayCount = async function(): Promise<IGame> {
  this.playCount += 1;
  return this.save();
};

gameSchema.methods.updateRating = async function(newRating: number): Promise<IGame> {
  // This would typically involve more complex logic with weighted averages
  // For now, simple moving average
  this.averageRating = (this.averageRating + newRating) / 2;
  return this.save();
};

gameSchema.methods.getQuestionsByDifficulty = function(difficulty: number) {
  return this.content.questions.filter(q => q.difficulty === difficulty);
};

// Static methods
gameSchema.statics.findBySubject = function(subject: string, limit = 10) {
  return this.find({ subject, isActive: true })
    .sort({ averageRating: -1, playCount: -1 })
    .limit(limit);
};

gameSchema.statics.findByAgeRange = function(minAge: number, maxAge: number) {
  return this.find({
    'ageRange.min': { $lte: maxAge },
    'ageRange.max': { $gte: minAge },
    isActive: true
  });
};

gameSchema.statics.findPopularGames = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ playCount: -1, averageRating: -1 })
    .limit(limit);
};

gameSchema.statics.searchGames = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    $text: { $search: query },
    isActive: true,
    ...filters
  };

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

const Game = mongoose.model<IGame>('Game', gameSchema);

export default Game;