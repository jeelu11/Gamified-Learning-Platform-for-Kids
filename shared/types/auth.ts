export interface User {
  _id: string;
  email: string;
  username: string;
  role: UserRole;
  profile: UserProfile;
  settings: UserSettings;
  subscription: UserSubscription;
  parentCode?: string;
  linkedParents: string[];
  linkedChildren: string[];
  classroom?: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar: string;
  age?: number;
  grade?: number;
  school?: string;
  bio?: string;
}

export interface UserSettings {
  notifications: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark';
  language: string;
}

export interface UserSubscription {
  type: 'free' | 'premium' | 'family' | 'school';
  status: 'active' | 'cancelled' | 'expired';
  expiresAt?: Date;
  stripeCustomerId?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
  profile: UserProfile;
  parentCode?: string;
  agreeToTerms: boolean;
  agreeToCoppa?: boolean; // For parents
  childBirthdate?: string; // For COPPA compliance
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}