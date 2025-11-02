import React from 'react';

const GamesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-kid-header text-primary-blue mb-8 text-center">
          🎮 Game Library
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="game-card">
            <div className="game-card-header">
              <h3 className="text-xl font-bold font-kid-header">Math Adventure</h3>
            </div>
            <div className="game-card-content">
              <p>Solve math puzzles to save the kingdom!</p>
            </div>
            <div className="game-card-footer">
              <button className="btn-primary w-full">Play Now!</button>
            </div>
          </div>
          <div className="game-card">
            <div className="game-card-header">
              <h3 className="text-xl font-bold font-kid-header">Science Lab</h3>
            </div>
            <div className="game-card-content">
              <p>Conduct virtual experiments!</p>
            </div>
            <div className="game-card-footer">
              <button className="btn-primary w-full">Play Now!</button>
            </div>
          </div>
          <div className="game-card">
            <div className="game-card-header">
              <h3 className="text-xl font-bold font-kid-header">Word Builder</h3>
            </div>
            <div className="game-card-content">
              <p>Master vocabulary and spelling!</p>
            </div>
            <div className="game-card-footer">
              <button className="btn-primary w-full">Play Now!</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamesPage;