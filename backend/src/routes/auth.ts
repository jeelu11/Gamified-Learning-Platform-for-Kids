import express from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '@/services/authService';
import { authenticate } from '@/middleware/auth';
import { rateLimiter } from '@/middleware/rateLimiter';
import { logger } from '@/utils/logger';

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Register new user
router.post('/register',
  rateLimiter.auth,
  [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('username')
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username must be 3-20 characters and contain only letters, numbers, and underscores'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, and numbers'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      }),
    body('role')
      .isIn(['student', 'parent', 'teacher'])
      .withMessage('Role must be student, parent, or teacher'),
    body('profile.firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('profile.lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('agreeToTerms')
      .isBoolean()
      .custom(value => {
        if (!value) {
          throw new Error('You must agree to the terms and conditions');
        }
        return true;
      }),
    // Student-specific validations
    body('profile.age')
      .if(body('role').equals('student'))
      .isInt({ min: 6, max: 12 })
      .withMessage('Student age must be between 6 and 12'),
    body('parentCode')
      .if(body('role').equals('student'))
      .optional()
      .isLength({ min: 8, max: 8 })
      .isAlphanumeric()
      .withMessage('Parent code must be 8 alphanumeric characters'),
    // COPPA compliance for students
    body('agreeToCoppa')
      .if(body('role').equals('parent'))
      .isBoolean()
      .custom(value => {
        if (!value) {
          throw new Error('Parental consent is required for children under 13');
        }
        return true;
      })
  ],
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      const { user, tokens } = await authService.register(req.body);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        data: {
          user,
          tokens
        }
      });

    } catch (error: any) {
      logger.error('Registration error:', error);

      res.status(400).json({
        success: false,
        error: error.message || 'Registration failed',
        message: error.message || 'Failed to create account'
      });
    }
  }
);

// Login user
router.post('/login',
  rateLimiter.auth,
  [
    body('email')
      .notEmpty()
      .withMessage('Email or username is required'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      const { user, tokens } = await authService.login(req.body);

      res.json({
        success: true,
        message: 'Login successful!',
        data: {
          user,
          tokens
        }
      });

    } catch (error: any) {
      logger.error('Login error:', error);

      res.status(401).json({
        success: false,
        error: error.message || 'Login failed',
        message: error.message || 'Invalid email or password'
      });
    }
  }
);

// Refresh access token
router.post('/refresh',
  [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required')
  ],
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: tokens
      });

    } catch (error: any) {
      logger.error('Token refresh error:', error);

      res.status(401).json({
        success: false,
        error: error.message || 'Token refresh failed',
        message: error.message || 'Invalid or expired refresh token'
      });
    }
  }
);

// Verify email
router.post('/verify-email',
  [
    body('token')
      .notEmpty()
      .withMessage('Verification token is required')
  ],
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      await authService.verifyEmail(req.body.token);

      res.json({
        success: true,
        message: 'Email verified successfully! You can now log in.'
      });

    } catch (error: any) {
      logger.error('Email verification error:', error);

      res.status(400).json({
        success: false,
        error: error.message || 'Email verification failed',
        message: error.message || 'Invalid or expired verification token'
      });
    }
  }
);

// Request password reset
router.post('/forgot-password',
  rateLimiter.auth,
  [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
  ],
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      await authService.requestPasswordReset(req.body.email);

      res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent.'
      });

    } catch (error: any) {
      logger.error('Forgot password error:', error);

      res.status(500).json({
        success: false,
        error: 'Failed to send password reset email',
        message: 'Please try again later'
      });
    }
  }
);

// Reset password
router.post('/reset-password',
  [
    body('token')
      .notEmpty()
      .withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, and numbers'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ],
  handleValidationErrors,
  async (req: express.Request, res: express.Response) => {
    try {
      await authService.resetPassword(req.body.token, req.body.newPassword);

      res.json({
        success: true,
        message: 'Password reset successful! You can now log in with your new password.'
      });

    } catch (error: any) {
      logger.error('Password reset error:', error);

      res.status(400).json({
        success: false,
        error: error.message || 'Password reset failed',
        message: error.message || 'Invalid or expired reset token'
      });
    }
  }
);

// Change password (authenticated)
router.post('/change-password',
  authenticate,
  [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must be at least 8 characters and contain uppercase, lowercase, and numbers'),
    body('confirmNewPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
  ],
  handleValidationErrors,
  async (req: any, res: express.Response) => {
    try {
      await authService.changePassword(
        req.user._id,
        req.body.currentPassword,
        req.body.newPassword
      );

      res.json({
        success: true,
        message: 'Password changed successfully!'
      });

    } catch (error: any) {
      logger.error('Change password error:', error);

      res.status(400).json({
        success: false,
        error: error.message || 'Password change failed',
        message: error.message || 'Failed to change password'
      });
    }
  }
);

// Logout (client-side token invalidation)
router.post('/logout',
  authenticate,
  async (req: express.Request, res: express.Response) => {
    // In a real implementation, you might want to:
    // 1. Add the token to a blacklist
    // 2. Clear refresh tokens from database
    // 3. Log the logout event

    res.json({
      success: true,
      message: 'Logout successful'
    });
  }
);

// Get current user info
router.get('/me',
  authenticate,
  async (req: any, res: express.Response) => {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  }
);

export default router;