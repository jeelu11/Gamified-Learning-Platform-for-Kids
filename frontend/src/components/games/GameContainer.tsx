import React, { useState } from 'react';
import { Game } from '@/types/game';
import MathPuzzleGame from './MathPuzzleGame';

interface GameContainerProps {
  game: Game;
  onGameComplete: (gameId: string, score: number, results: any) => void;
  onExit: () => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ game, onGameComplete, onExit }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleGameComplete = (score: number, results: any) => {
    // Save progress to Firebase
    saveProgressToFirebase(score, results);
    onGameComplete(game._id, score, results);
  };

  const saveProgressToFirebase = async (score: number, results: any) => {
    try {
      // This would integrate with the Firebase service
      console.log('Saving game progress:', { gameId: game._id, score, results });
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const renderGameComponent = () => {
    // Add more game types as needed
    switch (game.gameType) {
      case 'puzzle':
        return <MathPuzzleGame game={game} onComplete={handleGameComplete} onExit={onExit} />;
      default:
        return <MathPuzzleGame game={game} onComplete={handleGameComplete} onExit={onExit} />;
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Game Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onExit}
            className="btn-primary"
          >
            Back to Games
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isLoading && (
        <div className="min-h-screen bg-bg-light flex items-center justify-center">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-gray-600 font-kid-body">Loading game...</p>
          </div>
        </div>
      )}
      {!isLoading && renderGameComponent()}
    </div>
  );
};

export default GameContainer;