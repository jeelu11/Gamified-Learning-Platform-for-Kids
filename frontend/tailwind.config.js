/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#4A90E2',
        'primary-orange': '#FF6B35',
        'primary-green': '#2ECC71',
        'primary-purple': '#9B59B6',
        'primary-yellow': '#F1C40F',
        'bg-light': '#F8F9FA',
        'text-dark': '#2C3E50',
        'text-gray': '#6C757D',
        'bg-white': '#FFFFFF',
        'error-red': '#E74C3C',
        'border-light': '#E9ECEF'
      },
      fontFamily: {
        'kid-header': ['Comic Sans MS', 'cursive'],
        'kid-body': ['Nunito', 'sans-serif'],
        'game-text': ['Fredoka One', 'cursive'],
        'display': ['Poppins', 'sans-serif']
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite'
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        }
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}