import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, AuthContextType } from '@/types/auth';
import { authService } from '@/services/authService';
import { firebaseAuthService } from '@/services/firebaseAuthService';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: 'student' | 'parent' | 'teacher' | 'admin' | null;
}

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: { user: Partial<User> } };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  role: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        role: action.payload.user.role,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload.user } : null,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is already authenticated on app start (Firebase + JWT fallback)
  useEffect(() => {
    const initAuth = async () => {
      // First check Firebase auth state
      const unsubscribe = firebaseAuthService.onAuthStateChanged(async (firebaseUser) => {
        if (firebaseUser) {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user: firebaseUser } });
        } else {
          // Fallback to JWT tokens
          const token = localStorage.getItem('accessToken');
          const refreshToken = localStorage.getItem('refreshToken');

          if (token && refreshToken) {
            try {
              const user = await authService.getCurrentUser();
              dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
            } catch (error) {
              try {
                const newTokens = await authService.refreshToken(refreshToken);
                localStorage.setItem('accessToken', newTokens.accessToken);
                localStorage.setItem('refreshToken', newTokens.refreshToken);

                const user = await authService.getCurrentUser();
                dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
              } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                dispatch({ type: 'AUTH_FAILURE' });
              }
            }
          } else {
            dispatch({ type: 'AUTH_FAILURE' });
          }
        }
      });

      return () => unsubscribe();
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      // Try Firebase auth first, fallback to JWT
      let user: User;
      try {
        user = await firebaseAuthService.signInWithEmail(credentials.email, credentials.password);
      } catch (firebaseError) {
        const response = await authService.login(credentials);
        user = response.user;

        // Store JWT tokens as fallback
        localStorage.setItem('accessToken', response.tokens.accessToken);
        localStorage.setItem('refreshToken', response.tokens.refreshToken);
      }

      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
      toast.success(`Welcome back, ${user.profile.firstName}! 🎉`);

    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Firebase logout
      await firebaseAuthService.signOut();

      // Backend logout if JWT tokens exist
      const token = localStorage.getItem('accessToken');
      if (token) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userProfile');

      dispatch({ type: 'LOGOUT' });
      toast.success('Logged out successfully! 👋');
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const response = await authService.register(userData);

      // Store tokens
      localStorage.setItem('accessToken', response.tokens.accessToken);
      localStorage.setItem('refreshToken', response.tokens.refreshToken);

      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user } });

      toast.success('Registration successful! Welcome to EduPlay! 🎮');

    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const newTokens = await authService.refreshToken(storedRefreshToken);

      localStorage.setItem('accessToken', newTokens.accessToken);
      localStorage.setItem('refreshToken', newTokens.refreshToken);

    } catch (error) {
      // Refresh token failed, logout user
      await logout();
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateProfile(profile);
      dispatch({ type: 'UPDATE_USER', payload: { user: updatedUser } });
      toast.success('Profile updated successfully! ✨');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const user = await firebaseAuthService.signInWithGoogle();
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });

      toast.success(`Welcome, ${user.profile.firstName}! 🎉`);

    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      const errorMessage = error.message || 'Google sign-in failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    role: state.role,
    login,
    logout,
    register,
    refreshToken,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Custom hook for role-based access
export const useRequireAuth = (allowedRoles?: string[]) => {
  const { user, isAuthenticated, isLoading, role } = useAuth();

  if (isLoading) {
    return { isLoading: true, canAccess: false };
  }

  if (!isAuthenticated || !user) {
    return { isLoading: false, canAccess: false, user: null, isAuthenticated: false, role: null };
  }

  if (allowedRoles && !allowedRoles.includes(role || '')) {
    return { isLoading: false, canAccess: false, user, isAuthenticated, role };
  }

  return { isLoading: false, canAccess: true, user, isAuthenticated, role };
};