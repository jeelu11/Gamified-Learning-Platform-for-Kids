// MongoDB initialization script for EduPlay
// This script runs when the MongoDB container starts

// Switch to eduplay database
db = db.getSiblingDB('eduplay');

// Create collections and indexes
db.createCollection('users');
db.createCollection('games');
db.createCollection('progress');
db.createCollection('achievements');
db.createCollection('userachievements');
db.createCollection('classrooms');
db.createCollection('analytics');

// Create indexes for users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ username: 1 }, { unique: true });
db.users.createIndex({ parentCode: 1 }, { unique: true, sparse: true });
db.users.createIndex({ role: 1 });
db.users.createIndex({ isActive: 1, emailVerified: 1 });

// Create indexes for games collection
db.games.createIndex({ subject: 1, category: 1 });
db.games.createIndex({ isActive: 1, difficulty: 1 });
db.games.createIndex({ title: 'text', description: 'text' });
db.games.createIndex({ isPremium: 1, averageRating: -1 });

// Create indexes for progress collection
db.progress.createIndex({ userId: 1, gameId: 1 });
db.progress.createIndex({ userId: 1, createdAt: -1 });
db.progress.createIndex({ gameId: 1, completed: 1 });
db.progress.createIndex({ 'sessionData.percentage': -1 });

// Create indexes for achievements collection
db.achievements.createIndex({ category: 1, isActive: 1 });
db.achievements.createIndex({ rarity: 1, points: -1 });

// Create indexes for user achievements
db.userachievements.createIndex({ userId: 1, achievementId: 1 }, { unique: true });
db.userachievements.createIndex({ userId: 1, isCompleted: 1 });
db.userachievements.createIndex({ userId: 1, earnedAt: -1 });

// Create indexes for analytics collection
db.analytics.createIndex({ userId: 1, timestamp: -1 });
db.analytics.createIndex({ eventType: 1, timestamp: -1 });

// Insert default achievements
db.achievements.insertMany([
  {
    name: 'First Game',
    description: 'Complete your first game',
    icon: '🎮',
    category: 'general',
    criteria: {
      type: 'games_played',
      value: 1,
      condition: 'Complete 1 game'
    },
    points: 10,
    rarity: 'common',
    isActive: true,
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    name: 'Math Wizard',
    description: 'Score 100% in 5 math games',
    icon: '🧮',
    category: 'subject',
    criteria: {
      type: 'score',
      value: 100,
      condition: 'Score 100% in math games',
      subject: 'math'
    },
    points: 50,
    rarity: 'rare',
    isActive: true,
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    name: '7 Day Streak',
    description: 'Play games for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    criteria: {
      type: 'streak',
      value: 7,
      condition: '7 day consecutive streak'
    },
    points: 100,
    rarity: 'epic',
    isActive: true,
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    name: 'Perfect Score',
    description: 'Get a perfect score in any game',
    icon: '⭐',
    category: 'general',
    criteria: {
      type: 'perfect_game',
      value: 1,
      condition: 'Get 100% score'
    },
    points: 25,
    rarity: 'common',
    isActive: true,
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    name: 'Learning Champion',
    description: 'Play 50 games total',
    icon: '🏆',
    category: 'milestone',
    criteria: {
      type: 'games_played',
      value: 50,
      condition: 'Play 50 games'
    },
    points: 200,
    rarity: 'legendary',
    isActive: true,
    createdBy: 'system',
    createdAt: new Date()
  }
]);

// Insert sample games
db.games.insertMany([
  {
    title: 'Math Treasure Hunt',
    description: 'Solve math puzzles to find the hidden treasure!',
    subject: 'math',
    category: 'arithmetic',
    difficulty: 3,
    ageRange: { min: 6, max: 10 },
    gameType: 'puzzle',
    content: {
      instructions: 'Solve the math problems to collect treasure!',
      questions: [
        {
          id: 'q1',
          question: '7 × 8 = ?',
          type: 'multiple-choice',
          options: ['42', '56', '64', '49'],
          correctAnswer: '56',
          explanation: '7 × 8 = 56',
          points: 10,
          difficulty: 3
        },
        {
          id: 'q2',
          question: '15 + 27 = ?',
          type: 'multiple-choice',
          options: ['32', '42', '52', '62'],
          correctAnswer: '42',
          explanation: '15 + 27 = 42',
          points: 10,
          difficulty: 2
        }
      ],
      assets: {
        images: [],
        sounds: [],
        animations: []
      }
    },
    learningObjectives: ['Multiplication', 'Addition'],
    estimatedTime: 10,
    isPremium: false,
    isActive: true,
    playCount: 0,
    averageRating: 0,
    createdBy: 'system',
    createdAt: new Date()
  },
  {
    title: 'Science Explorer',
    description: 'Explore scientific concepts through fun experiments!',
    subject: 'science',
    category: 'biology',
    difficulty: 2,
    ageRange: { min: 7, max: 11 },
    gameType: 'simulation',
    content: {
      instructions: 'Learn about animals and their habitats!',
      questions: [
        {
          id: 'q1',
          question: 'What do lions eat?',
          type: 'multiple-choice',
          options: ['Plants', 'Meat', 'Fish', 'Insects'],
          correctAnswer: 'Meat',
          explanation: 'Lions are carnivores that eat meat',
          points: 10,
          difficulty: 2
        }
      ],
      assets: {
        images: [],
        sounds: [],
        animations: []
      }
    },
    learningObjectives: ['Animal Classification', 'Food Chains'],
    estimatedTime: 8,
    isPremium: false,
    isActive: true,
    playCount: 0,
    averageRating: 0,
    createdBy: 'system',
    createdAt: new Date()
  }
]);

print('MongoDB initialization completed successfully!');
print('Collections created: users, games, progress, achievements, userachievements, classrooms, analytics');
print('Indexes created for performance');
print('Default achievements inserted: 5');
print('Sample games inserted: 2');