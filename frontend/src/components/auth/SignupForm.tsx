import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData } from '@/types/auth';

interface SignupFormProps {
  onToggleMode?: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onToggleMode }) => {
  const { register: registerUser, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent' | 'teacher'>('student');
  const [selectedAvatar, setSelectedAvatar] = useState('👦');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus,
    setValue,
  } = useForm<RegisterData>();

  const password = watch('password');
  const role = watch('role', 'student');

  useEffect(() => {
    setFocus('email');
  }, [setFocus]);

  useEffect(() => {
    setSelectedRole(role);
    // Set default avatar based on role
    const avatars = {
      student: '👦',
      parent: '👨‍👩‍👧‍👦',
      teacher: '👩‍🏫',
    };
    setSelectedAvatar(avatars[role]);
  }, [role, setValue]);

  const avatars = {
    student: ['👦', '👧', '🧒', '👶', '🦸', '🦸‍♀️', '🧙', '🧙‍♀️'],
    parent: ['👨‍👩‍👧‍👦', '👨‍👩‍👦', '👩‍👧', '👨‍👧'],
    teacher: ['👩‍🏫', '👨‍🏫', '🧑‍🏫', '👩‍🏫‍🦲', '👨‍🏫‍🦱'],
  };

  const onSubmit = async (data: RegisterData) => {
    try {
      const userData = {
        ...data,
        profile: {
          ...data.profile,
          avatar: selectedAvatar,
        },
      };
      await registerUser(userData);
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-primary-yellow">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎓</div>
          <h2 className="text-3xl font-bold font-kid-header text-primary-blue mb-2">
            Start Your Learning Adventure!
          </h2>
          <p className="text-gray-600 font-kid-body">
            Join thousands of kids learning through play!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-kid-body">
              I am a:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['student', 'parent', 'teacher'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setValue('role', r)}
                  className={`py-2 px-3 rounded-lg font-medium transition-all duration-200 font-kid-body capitalize ${
                    role === r
                      ? 'bg-primary-blue text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  disabled={isLoading}
                >
                  {r === 'student' && '👦 '}
                  {r === 'parent' && '👨‍👩‍👧‍👦 '}
                  {r === 'teacher' && '👩‍🏫 '}
                  {r}
                </button>
              ))}
            </div>
            <input
              {...register('role', { required: 'Please select a role' })}
              type="hidden"
            />
            {errors.role && (
              <p className="mt-1 text-sm text-red-600 font-kid-body">
                {errors.role.message}
              </p>
            )}
          </div>

          {/* Avatar Selection (for students) */}
          {selectedRole === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-kid-body">
                Choose Your Avatar:
              </label>
              <div className="flex flex-wrap gap-2">
                {avatars.student.map((avatar) => (
                  <button
                    key={avatar}
                    type="button"
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`text-3xl p-2 rounded-lg border-2 transition-all duration-200 ${
                      selectedAvatar === avatar
                        ? 'border-primary-blue bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={isLoading}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
                First Name
              </label>
              <input
                {...register('profile.firstName', {
                  required: 'First name is required',
                })}
                type="text"
                id="firstName"
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body ${
                  errors.profile?.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="First name"
                disabled={isLoading}
              />
              {errors.profile?.firstName && (
                <p className="mt-1 text-sm text-red-600 font-kid-body">
                  {errors.profile.firstName.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
                Last Name
              </label>
              <input
                {...register('profile.lastName', {
                  required: 'Last name is required',
                })}
                type="text"
                id="lastName"
                className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body ${
                  errors.profile?.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Last name"
                disabled={isLoading}
              />
              {errors.profile?.lastName && (
                <p className="mt-1 text-sm text-red-600 font-kid-body">
                  {errors.profile.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Student-specific fields */}
          {selectedRole === 'student' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
                    Age
                  </label>
                  <input
                    {...register('profile.age', {
                      required: 'Age is required',
                      min: { value: 6, message: 'Must be at least 6 years old' },
                      max: { value: 12, message: 'Must be 12 or younger' },
                    })}
                    type="number"
                    id="age"
                    className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body ${
                      errors.profile?.age ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Age"
                    disabled={isLoading}
                  />
                  {errors.profile?.age && (
                    <p className="mt-1 text-sm text-red-600 font-kid-body">
                      {errors.profile.age.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
                    Grade (Optional)
                  </label>
                  <select
                    {...register('profile.grade')}
                    id="grade"
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body"
                    disabled={isLoading}
                  >
                    <option value="">Select grade</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <option key={grade} value={grade}>
                        Grade {grade}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Parent Code */}
              <div>
                <label htmlFor="parentCode" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
                  Parent Code (if you have one)
                </label>
                <input
                  {...register('parentCode')}
                  type="text"
                  id="parentCode"
                  className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body uppercase"
                  placeholder="Enter parent code"
                  maxLength={8}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500 font-kid-body">
                  Ask your parent for their special code to link accounts!
                </p>
              </div>
            </>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
              Email Address
            </label>
            <input
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Please enter a valid email',
                },
              })}
              type="email"
              id="email"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-kid-body">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
              Username
            </label>
            <input
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: 'Username can only contain letters, numbers, and underscores',
                },
              })}
              type="text"
              id="username"
              className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body ${
                errors.username ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="cool_kid_123"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600 font-kid-body">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
              Password
            </label>
            <div className="relative">
              <input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Password must contain uppercase, lowercase, and numbers',
                  },
                })}
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={`w-full px-3 py-2 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                <span className="text-gray-400 hover:text-gray-600">
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1 font-kid-body">
              Confirm Password
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={`w-full px-3 py-2 pr-10 border-2 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 font-kid-body ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Re-enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                disabled={isLoading}
              >
                <span className="text-gray-400 hover:text-gray-600">
                  {showConfirmPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 font-kid-body">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start">
              <input
                {...register('agreeToTerms', {
                  required: 'You must agree to the terms and conditions',
                })}
                type="checkbox"
                className="mt-1 h-4 w-4 text-primary-blue focus:ring-primary-blue border-gray-300 rounded"
                disabled={isLoading}
              />
              <span className="ml-2 text-sm text-gray-600 font-kid-body">
                I agree to the{' '}
                <a href="/terms" className="text-primary-blue hover:text-primary-orange font-medium">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-primary-blue hover:text-primary-orange font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600 font-kid-body">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 font-kid-header ${
              isLoading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-green to-primary-blue text-white hover:from-primary-orange hover:to-primary-yellow shadow-lg'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <span className="loading-spinner mr-2"></span>
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                🚀 Create My Account!
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 font-kid-body">
            Already have an account?{' '}
            <button
              onClick={onToggleMode}
              className="text-primary-blue hover:text-primary-orange font-bold transition-colors"
            >
              Login here!
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;