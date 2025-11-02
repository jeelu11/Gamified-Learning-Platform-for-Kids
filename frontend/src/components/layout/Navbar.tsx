import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Games', path: '/games', icon: '🎮', requireAuth: true },
    { name: 'Dashboard', path: '/dashboard', icon: '📊', requireAuth: true },
    { name: 'Progress', path: '/progress', icon: '📈', requireAuth: true },
    { name: 'Profile', path: '/profile', icon: '👤', requireAuth: true },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl">🎓</span>
              <span className="text-xl font-bold font-kid-header text-primary-blue">
                EduPlay
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              if (link.requireAuth && !isAuthenticated) return null;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg font-medium font-kid-body transition-all duration-200 flex items-center space-x-1 ${
                    isActiveLink(link.path)
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-700 hover:bg-primary-blue hover:text-white'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{user.profile.avatar}</span>
                  <span className="font-medium font-kid-body text-gray-700">
                    {user.profile.firstName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium font-kid-body"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors font-medium font-kid-body"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-primary-orange text-white rounded-lg hover:bg-orange-600 transition-colors font-medium font-kid-body"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              <span className="text-2xl">{isMobileMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            {navLinks.map((link) => {
              if (link.requireAuth && !isAuthenticated) return null;

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium font-kid-body transition-all duration-200 flex items-center space-x-2 ${
                    isActiveLink(link.path)
                      ? 'bg-primary-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {isAuthenticated && user ? (
              <div className="pt-4 border-t">
                <div className="px-3 py-2 flex items-center space-x-2">
                  <span className="text-xl">{user.profile.avatar}</span>
                  <span className="font-medium font-kid-body text-gray-700">
                    {user.profile.firstName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium font-kid-body"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-primary-blue text-white rounded-lg text-center font-medium font-kid-body"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 bg-primary-orange text-white rounded-lg text-center font-medium font-kid-body"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;