import React, { useState } from 'react';
import { Game } from '@/types/game';
import GameContainer from '@/components/games/GameContainer';

// Sample game data
const sampleGames: Game[] = [
  {
    _id: '1',
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
        },
        {
          id: 'q3',
          question: '100 - 45 = ?',
          type: 'multiple-choice',
          options: ['45', '55', '65', '75'],
          correctAnswer: '55',
          explanation: '100 - 45 = 55',
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
    learningObjectives: ['Multiplication', 'Addition', 'Subtraction'],
    estimatedTime: 10,
    isPremium: false,
    isActive: true,
    playCount: 0,
    averageRating: 0,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: '2',
    title: 'Space Math',
    description: 'Blast through asteroids with your math skills!',
    subject: 'math',
    category: 'arithmetic',
    difficulty: 4,
    ageRange: { min: 8, max: 12 },
    gameType: 'puzzle',
    content: {
      instructions: 'Use math to navigate through space!',
      questions: [
        {
          id: 'q1',
          question: '12 × 12 = ?',
          type: 'multiple-choice',
          options: ['124', '134', '144', '154'],
          correctAnswer: '144',
          explanation: '12 × 12 = 144',
          points: 15,
          difficulty: 4
        },
        {
          id: 'q2',
          question: '9 × 9 = ?',
          type: 'multiple-choice',
          options: ['71', '81', '91', '101'],
          correctAnswer: '81',
          explanation: '9 × 9 = 81',
          points: 15,
          difficulty: 4
        }
      ],
      assets: {
        images: [],
        sounds: [],
        animations: []
      }
    },
    learningObjectives: ['Advanced Multiplication'],
    estimatedTime: 15,
    isPremium: false,
    isActive: true,
    playCount: 0,
    averageRating: 0,
    createdBy: 'system',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const GamesPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [filter, setFilter] = useState<'all' | 'math' | 'science' | 'language'>('all');

  const handleGameComplete = (gameId: string, score: number, results: any) => {
    console.log(`Game ${gameId} completed with score: ${score}`, results);
    setSelectedGame(null);
  };

  const filteredGames = filter === 'all'
    ? sampleGames
    : sampleGames.filter(game => game.subject === filter);

  if (selectedGame) {
    return (
      <GameContainer
        game={selectedGame}
        onGameComplete={handleGameComplete}
        onExit={() => setSelectedGame(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-kid-header text-primary-blue mb-8 text-center">
          🎮 Game Library
        </h1>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-lg p-1 inline-flex">
            {(['all', 'math', 'science', 'language'] as const).map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-6 py-2 rounded-full font-medium font-kid-body transition-all duration-200 capitalize ${
                  filter === category
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {category === 'all' ? '🎮 All Games' :
                 category === 'math' ? '🧮 Math' :
                 category === 'science' ? '🔬 Science' : '📚 Language'}
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <div key={game._id} className="game-card">
              <div className="game-card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-kid-header">{game.title}</h3>
                  <div className="text-2xl">
                    {game.subject === 'math' ? '🧮' :
                     game.subject === 'science' ? '🔬' : '📚'}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm font-kid-body">
                    {game.ageRange.min}-{game.ageRange.max} years
                  </span>
                  <span className="text-yellow-400">
                    {'⭐'.repeat(Math.ceil(game.difficulty / 2))}
                  </span>
                </div>
              </div>
              <div className="game-card-content">
                <p className="font-kid-body text-gray-700 mb-4">{game.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">⏱️</span>
                    <span>{game.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="mr-2">🎯</span>
                    <span>{game.learningObjectives.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="game-card-footer">
                <button
                  onClick={() => setSelectedGame(game)}
                  className="btn-game w-full"
                >
                  🚀 Play Now!
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold font-kid-header text-gray-700 mb-2">
              No games found
            </h3>
            <p className="text-gray-600 font-kid-body">
              Try selecting a different category or check back later for new games!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamesPage;