import React from 'react';
import { Link } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl mb-4">🤖</div>
        <h1 className="text-4xl font-bold font-kid-header text-primary-blue mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-xl text-gray-600 font-kid-body mb-8">
          This page seems to have wandered off into another adventure!
        </p>
        <Link
          to="/"
          className="btn-primary text-xl px-8 py-4"
        >
          🏠 Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;