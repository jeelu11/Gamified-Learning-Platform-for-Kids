import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User, { IUser } from '@/models/User';
import { emailService } from './emailService';
import { logger } from '@/utils/logger';

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'parent' | 'teacher';
  profile: {
    firstName: string;
    lastName: string;
    age?: number;
    grade?: number;
    school?: string;
  };
  parentCode?: string;
  agreeToTerms: boolean;
  agreeToCoppa?: boolean;
  childBirthdate?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpire: string;
  private readonly jwtRefreshExpire: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET!;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
    this.jwtExpire = process.env.JWT_EXPIRE || '15m';
    this.jwtRefreshExpire = process.env.JWT_REFRESH_EXPIRE || '7d';

    if (!this.jwtSecret || !this.jwtRefreshSecret) {
      throw new Error('JWT secrets are not defined in environment variables');
    }
  }

  async register(data: RegisterData): Promise<{ user: IUser; tokens: AuthTokens }> {
    try {
      // Validate input data
      await this.validateRegistrationData(data);

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: data.email.toLowerCase() },
          { username: data.username }
        ]
      });

      if (existingUser) {
        if (existingUser.email === data.email.toLowerCase()) {
          throw new Error('An account with this email already exists');
        }
        if (existingUser.username === data.username) {
          throw new Error('This username is already taken');
        }
      }

      // Handle parent code for students
      let linkedParents: string[] = [];
      if (data.role === 'student' && data.parentCode) {
        const parent = await User.findOne({ parentCode: data.parentCode.toUpperCase() });
        if (!parent) {
          throw new Error('Invalid parent code');
        }
        linkedParents = [parent._id.toString()];
      }

      // Create user object
      const userData = {
        email: data.email.toLowerCase(),
        username: data.username,
        password: data.password,
        role: data.role,
        profile: {
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          age: data.profile.age,
          grade: data.profile.grade,
          school: data.profile.school,
          avatar: this.getDefaultAvatar(data.role)
        },
        linkedParents,
        isActive: true,
        emailVerified: false // Will require email verification
      };

      const user = new User(userData);
      await user.save();

      // Send verification email
      await this.sendVerificationEmail(user);

      // Generate tokens
      const tokens = this.generateTokens(user);

      logger.info(`New user registered: ${user.email} (${user.role})`);

      // Remove password from user object
      const userObject = user.toObject();
      delete userObject.password;

      return { user: userObject, tokens };

    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<{ user: IUser; tokens: AuthTokens }> {
    try {
      const { email, password } = data;

      // Find user by email or username
      const user = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { username: email }
        ]
      }).select('+password');

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Your account has been deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Check email verification (skip for admin)
      if (!user.emailVerified && user.role !== 'admin') {
        throw new Error('Please verify your email address before logging in');
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const tokens = this.generateTokens(user);

      logger.info(`User logged in: ${user.email} (${user.role})`);

      // Remove password from user object
      const userObject = user.toObject();
      delete userObject.password;

      return { user: userObject, tokens };

    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as any;

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      logger.info(`Token refreshed for user: ${user.email}`);

      return tokens;

    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new Error('Invalid or expired refresh token');
    }
  }

  async verifyEmail(token: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('Invalid verification token');
      }

      if (user.emailVerified) {
        throw new Error('Email is already verified');
      }

      user.emailVerified = true;
      await user.save();

      logger.info(`Email verified for user: ${user.email}`);

    } catch (error) {
      logger.error('Email verification error:', error);
      throw new Error('Invalid or expired verification token');
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await User.findOne({
        $or: [
          { email: email.toLowerCase() },
          { username: email }
        ]
      });

      if (!user) {
        // Don't reveal if user exists or not
        return;
      }

      const resetToken = jwt.sign(
        { userId: user._id, type: 'password-reset' },
        this.jwtSecret,
        { expiresIn: '1h' }
      );

      await emailService.sendPasswordResetEmail(user.email, resetToken);

      logger.info(`Password reset requested for user: ${user.email}`);

    } catch (error) {
      logger.error('Password reset request error:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;

      if (decoded.type !== 'password-reset') {
        throw new Error('Invalid reset token');
      }

      const user = await User.findById(decoded.userId);
      if (!user) {
        throw new Error('Invalid reset token');
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password reset completed for user: ${user.email}`);

    } catch (error) {
      logger.error('Password reset error:', error);
      throw new Error('Invalid or expired reset token');
    }
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new Error('User not found');
      }

      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      user.password = newPassword;
      await user.save();

      logger.info(`Password changed for user: ${user.email}`);

    } catch (error) {
      logger.error('Password change error:', error);
      throw error;
    }
  }

  private generateTokens(user: IUser): AuthTokens {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpire
    });

    const refreshToken = jwt.sign(payload, this.jwtRefreshSecret, {
      expiresIn: this.jwtRefreshExpire
    });

    // Calculate expires in seconds
    const expiresIn = this.parseExpirationTime(this.jwtExpire);

    return {
      accessToken,
      refreshToken,
      expiresIn
    };
  }

  private parseExpirationTime(timeString: string): number {
    const timeValue = parseInt(timeString);
    const timeUnit = timeString.replace(/[0-9]/g, '');

    switch (timeUnit) {
      case 's': return timeValue;
      case 'm': return timeValue * 60;
      case 'h': return timeValue * 3600;
      case 'd': return timeValue * 86400;
      default: return 900; // Default 15 minutes
    }
  }

  private async validateRegistrationData(data: RegisterData): Promise<void> {
    // Basic validation
    if (!data.email || !data.username || !data.password) {
      throw new Error('All required fields must be filled');
    }

    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!data.agreeToTerms) {
      throw new Error('You must agree to the terms and conditions');
    }

    // Age-specific validation
    if (data.role === 'student') {
      if (!data.profile.age) {
        throw new Error('Age is required for student accounts');
      }

      if (data.profile.age < 6 || data.profile.age > 12) {
        throw new Error('Student age must be between 6 and 12');
      }

      // COPPA compliance
      if (data.profile.age < 13 && !data.parentCode) {
        throw new Error('Parental consent is required for children under 13');
      }
    }
  }

  private getDefaultAvatar(role: string): string {
    const avatars = {
      student: '👦',
      parent: '👨‍👩‍👧‍👦',
      teacher: '👩‍🏫',
      admin: '👨‍💼'
    };
    return avatars[role as keyof typeof avatars] || '👤';
  }

  private async sendVerificationEmail(user: IUser): Promise<void> {
    const verificationToken = jwt.sign(
      { userId: user._id, type: 'email-verification' },
      this.jwtSecret,
      { expiresIn: '24h' }
    );

    await emailService.sendVerificationEmail(user.email, verificationToken);
  }
}

export const authService = new AuthService();