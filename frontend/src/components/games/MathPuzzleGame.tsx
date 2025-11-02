import React, { useState, useEffect } from 'react';
import { Game } from '@/types/game';

interface MathPuzzleGameProps {
  game: Game;
  onComplete: (score: number, results: any) => void;
  onExit: () => void;
}

const MathPuzzleGame: React.FC<MathPuzzleGameProps> = ({ game, onComplete, onExit }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [questions, setQuestions] = useState(game.content.questions);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (gameOver) {
      onComplete(score, {
        questionsAttempted: currentQuestion + 1,
        correctAnswers: score,
        timeSpent: 60 - timeLeft,
        streak: streak
      });
    }
  }, [gameOver, score, currentQuestion, timeLeft, streak, onComplete]);

  const handleAnswer = (answer: string) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + questions[currentQuestion].points);
      setStreak(streak + 1);
    } else {
      setLives(lives - 1);
      setStreak(0);
      if (lives <= 1) {
        setGameOver(true);
      }
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1 && !gameOver) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  const generateMathProblem = () => {
    const question = questions[currentQuestion];
    return {
      problem: question.question,
      options: question.options || [],
      correctAnswer: question.correctAnswer
    };
  };

  const { problem, options, correctAnswer } = generateMathProblem();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue to-primary-purple p-4">
      <div className="max-w-4xl mx-auto">
        {/* Game Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <button
              onClick={onExit}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ← Exit
            </button>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold font-game-text text-primary-blue">
                  🧮 Math Treasure Hunt
                </div>
                <div className="text-sm text-gray-600">Level {currentQuestion + 1}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl">⏱️ {timeLeft}s</div>
                <div className="text-xs text-gray-600">Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">🏆 {score}</div>
                <div className="text-xs text-gray-600">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">❤️ x{lives}</div>
                <div className="text-xs text-gray-600">Lives</div>
              </div>
              <div className="text-center">
                <div className="text-2xl">🔥 {streak}</div>
                <div className="text-xs text-gray-600">Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Board */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {!gameOver ? (
            <>
              {/* Question */}
              <div className="text-center mb-8">
                <div className="text-4xl font-bold font-game-text text-primary-blue mb-4">
                  {problem}
                </div>
                <div className="text-lg text-gray-600 font-kid-body">
                  What's the answer?
                </div>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    disabled={showResult}
                    className={`py-6 px-8 rounded-xl font-bold text-2xl transition-all duration-300 transform hover:scale-105 font-game-text ${
                      showResult
                        ? option === correctAnswer
                          ? 'bg-primary-green text-white'
                          : option === selectedAnswer
                          ? 'bg-error-red text-white'
                          : 'bg-gray-100 text-gray-400'
                        : 'bg-primary-blue text-white hover:bg-blue-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {/* Feedback */}
              {showResult && (
                <div className="text-center mt-8">
                  <div className={`text-4xl font-bold font-game-text ${
                    isCorrect ? 'text-primary-green' : 'text-error-red'
                  }`}>
                    {isCorrect ? '🎉 Correct!' : '❌ Try Again!'}
                  </div>
                  {isCorrect && (
                    <div className="text-2xl mt-2">
                      +{questions[currentQuestion].points} points!
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            /* Game Over Screen */
            <div className="text-center">
              <div className="text-6xl mb-4">
                {score >= questions.length * 10 ? '🏆' : '💪'}
              </div>
              <h2 className="text-4xl font-bold font-game-text text-primary-blue mb-4">
                {score >= questions.length * 10 ? 'Amazing Work!' : 'Great Effort!'}
              </h2>
              <div className="text-2xl font-kid-body text-gray-700 mb-8">
                Final Score: {score} points
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                <div className="bg-primary-blue text-white rounded-xl p-4">
                  <div className="text-3xl">✅</div>
                  <div className="font-bold">{score / 10} Correct</div>
                </div>
                <div className="bg-primary-green text-white rounded-xl p-4">
                  <div className="text-3xl">🔥</div>
                  <div className="font-bold">Best Streak: {streak}</div>
                </div>
              </div>
              <button
                onClick={onExit}
                className="btn-game text-xl"
              >
                🏠 Back to Games
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MathPuzzleGame;