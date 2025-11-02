import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireEmailVerification?: boolean;
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  requireEmailVerification = true,
  fallbackPath = '/login',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-light">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600 font-kid-body">Loading your learning adventure...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate
        to={fallbackPath}
        state={{ from: location }}
        replace
      />
    );
  }

  // Check email verification if required
  if (requireEmailVerification && !user.emailVerified && user.role !== 'admin') {
    return (
      <Navigate
        to="/verify-email"
        state={{ from: location }}
        replace
      />
    );
  }

  // Check role permissions
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ from: location }}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;