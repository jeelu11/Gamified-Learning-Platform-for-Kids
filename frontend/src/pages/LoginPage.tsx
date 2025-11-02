import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const LoginPage: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-blue via-primary-purple to-primary-orange flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-3 text-white hover:text-yellow-200 transition-colors">
            <span className="text-4xl">🎓</span>
            <span className="text-3xl font-bold font-kid-header">EduPlay</span>
          </Link>
          <p className="text-white text-lg mt-2 font-kid-body">
            Where Learning is an Adventure! 🎮
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Left Side - Form */}
          <div className="w-full lg:w-1/2">
            {isLoginMode ? (
              <LoginForm onToggleMode={toggleMode} />
            ) : (
              <SignupForm onToggleMode={toggleMode} />
            )}
          </div>

          {/* Right Side - Features */}
          <div className="w-full lg:w-1/2 hidden lg:block">
            <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold font-kid-header mb-6">
                Why Kids Love EduPlay! 🌟
              </h3>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🎮</div>
                  <div>
                    <h4 className="font-bold font-kid-header">Fun Games</h4>
                    <p className="font-kid-body opacity-90">
                      Learn math, science, and more through exciting games!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <h4 className="font-bold font-kid-header">Earn Rewards</h4>
                    <p className="font-kid-body opacity-90">
                      Collect badges, points, and unlock new avatars!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-3xl">📈</div>
                  <div>
                    <h4 className="font-bold font-kid-header">Track Progress</h4>
                    <p className="font-kid-body opacity-90">
                      See your learning journey with cool charts and graphs!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-3xl">👥</div>
                  <div>
                    <h4 className="font-bold font-kid-header">Safe & Fun</h4>
                    <p className="font-kid-body opacity-90">
                      Parent-approved, kid-safe environment for learning!
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🎨</div>
                  <div>
                    <h4 className="font-bold font-kid-header">Customize</h4>
                    <p className="font-kid-body opacity-90">
                      Create your own avatar and learning space!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-white bg-opacity-20 rounded-xl">
                <p className="text-center font-kid-body">
                  <span className="text-2xl">👨‍👩‍👧‍👦</span>
                  <br />
                  <strong>For Parents:</strong> Monitor your child's progress and set learning goals!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-white hover:text-yellow-200 font-medium font-kid-body transition-colors inline-flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed top-10 left-10 text-6xl opacity-20 animate-pulse">🌟</div>
      <div className="fixed top-20 right-20 text-4xl opacity-20 animate-bounce">🎯</div>
      <div className="fixed bottom-20 left-20 text-5xl opacity-20 animate-pulse">🏆</div>
      <div className="fixed bottom-10 right-10 text-4xl opacity-20 animate-bounce">🎮</div>
    </div>
  );
};

export default LoginPage;