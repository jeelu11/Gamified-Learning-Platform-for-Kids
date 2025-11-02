import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types/auth';

interface LoginFormProps {
  onToggleMode?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onToggleMode }) => {
  const navigate = useNavigate();
  const { login, signInWithGoogle, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginCredentials>();

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  const onSubmit = async (data: LoginCredentials) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-primary-yellow">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold font-kid-header text-primary-blue mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 font-kid-body">
            Ready to continue your learning adventure?
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email/Username Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 font-kid-body">
              Email or Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">📧</span>
              </div>
              <input
                {...register('email', {
                  required: 'Email or username is required',
                })}
                type="text"
                id="email"
                className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body text-lg ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email or username"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-kid-body">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2 font-kid-body">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔒</span>
              </div>
              <input
                {...register('password', {
                  required: 'Password is required',
                })}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body text-lg ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                <span className="text-gray-400 hover:text-gray-600 text-xl">
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-kid-body">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                {...register('rememberMe')}
                type="checkbox"
                className="h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-600 font-kid-body">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary-blue hover:text-primary-orange font-medium font-kid-body transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 font-kid-header ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-blue to-primary-purple text-white hover:from-primary-orange hover:to-primary-yellow shadow-lg'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="loading-spinner mr-2"></span>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                🚀 Login to Play!
              </span>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-kid-body">OR</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105 active:scale-95 font-kid-header flex items-center justify-center space-x-3 ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl">🌐</span>
            <span>Sign in with Google</span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 font-kid-body">
            Don't have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary-blue hover:text-primary-orange font-bold transition-colors"
            >
              Sign up here!
            </button>
          </p>
        </div>

        {/* Fun Animation */}
        <div className="mt-6 text-center">
          <div className="inline-flex space-x-2 text-2xl animate-bounce">
            <span>🎮</span>
            <span>🎯</span>
            <span>🏆</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;