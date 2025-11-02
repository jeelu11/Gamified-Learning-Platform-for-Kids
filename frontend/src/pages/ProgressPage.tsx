import React from 'react';

const ProgressPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold font-kid-header text-primary-blue mb-8 text-center">
          📊 Your Progress
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold font-kid-header text-primary-green mb-4">
              📈 Learning Stats
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-kid-body">Games Played</span>
                <span className="font-bold text-xl">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-kid-body">Average Score</span>
                <span className="font-bold text-xl">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-kid-body">Study Streak</span>
                <span className="font-bold text-xl">7 days 🔥</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold font-kid-header text-primary-orange mb-4">
              🏆 Recent Achievements
            </h2>
            <div className="flex space-x-4">
              <div className="badge-achievement">🌟</div>
              <div className="badge-achievement">🎯</div>
              <div className="badge-achievement">🚀</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;