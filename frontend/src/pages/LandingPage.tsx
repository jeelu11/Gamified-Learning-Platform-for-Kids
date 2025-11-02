import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-blue via-primary-purple to-primary-orange text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold font-kid-header mb-6">
              Learning is Fun with EduPlay! 🎮
            </h1>
            <p className="text-xl md:text-2xl font-kid-body mb-8 max-w-3xl mx-auto">
              Transform screen time into learning time! Join thousands of kids aged 6-12 who are discovering the joy of education through engaging games and adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="btn-game text-xl px-8 py-4"
              >
                🚀 Start Playing!
              </Link>
              <Link
                to="/about"
                className="bg-white text-primary-blue px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                📖 Learn More
              </Link>
            </div>
          </div>

          {/* Animated Characters */}
          <div className="mt-12 flex justify-center space-x-8 text-6xl animate-bounce">
            <span>🦸‍♂️</span>
            <span>👩‍🚀</span>
            <span>🧑‍🔬</span>
            <span>👨‍🎓</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center font-kid-header text-primary-blue mb-12">
            🎯 Choose Your Learning Adventure!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                🧮
              </div>
              <h3 className="text-xl font-bold font-kid-header text-primary-blue mb-2">
                Math Games
              </h3>
              <p className="text-gray-600 font-kid-body">
                Master numbers, shapes, and problem-solving through exciting challenges!
              </p>
            </div>
            <div className="text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                🔬
              </div>
              <h3 className="text-xl font-bold font-kid-header text-primary-green mb-2">
                Science Fun
              </h3>
              <p className="text-gray-600 font-kid-body">
                Explore the wonders of nature and conduct virtual experiments!
              </p>
            </div>
            <div className="text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                📚
              </div>
              <h3 className="text-xl font-bold font-kid-header text-primary-purple mb-2">
                Language Arts
              </h3>
              <p className="text-gray-600 font-kid-body">
                Build vocabulary, practice grammar, and become a reading champion!
              </p>
            </div>
            <div className="text-center group">
              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                🎨
              </div>
              <h3 className="text-xl font-bold font-kid-header text-primary-orange mb-2">
                Creativity
              </h3>
              <p className="text-gray-600 font-kid-body">
                Express yourself through art, music, and creative challenges!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center font-kid-header text-primary-blue mb-12">
            🌟 How EduPlay Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-blue text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold font-kid-header text-primary-blue mb-2">
                Sign Up
              </h3>
              <p className="text-gray-600 font-kid-body">
                Create your free account and choose your favorite avatar!
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-green text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold font-kid-header text-primary-green mb-2">
                Play Games
              </h3>
              <p className="text-gray-600 font-kid-body">
                Explore our library of fun, educational games at your own pace!
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-orange text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold font-kid-header text-primary-orange mb-2">
                Learn & Grow
              </h3>
              <p className="text-gray-600 font-kid-body">
                Earn badges, track progress, and become a learning superstar!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center font-kid-header text-primary-blue mb-12">
            💬 What Parents & Kids Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg-light rounded-2xl p-6 border-4 border-primary-yellow">
              <div className="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 font-kid-body mb-4 italic">
                "My daughter actually asks to play EduPlay every day! Her math grades have improved so much."
              </p>
              <p className="font-bold font-kid-header text-primary-blue">
                - Sarah M., Parent
              </p>
            </div>
            <div className="bg-bg-light rounded-2xl p-6 border-4 border-primary-green">
              <div className="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 font-kid-body mb-4 italic">
                "The science games are so cool! I learned about planets and now I want to be an astronaut!"
              </p>
              <p className="font-bold font-kid-header text-primary-green">
                - Alex, Age 8
              </p>
            </div>
            <div className="bg-bg-light rounded-2xl p-6 border-4 border-primary-purple">
              <div className="text-4xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-700 font-kid-body mb-4 italic">
                "As a teacher, I love using EduPlay in my classroom. The kids are engaged and learning!"
              </p>
              <p className="font-bold font-kid-header text-primary-purple">
                - Mr. Johnson, 3rd Grade Teacher
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-orange to-primary-yellow py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-kid-header text-white mb-6">
            🚀 Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-white font-kid-body mb-8">
            Join thousands of kids who are learning through play every day!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="bg-white text-primary-orange px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
            >
              🎮 Play for Free!
            </Link>
            <Link
              to="/parents"
              className="bg-primary-blue text-white px-8 py-4 rounded-full font-bold text-xl hover:bg-blue-600 transition-all duration-200 transform hover:scale-105"
            >
              👨‍👩‍👧‍👦 For Parents
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;