import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '@/models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Access token is required',
        message: 'Please provide a valid authorization token'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token is required',
        message: 'Please provide a valid authorization token'
      });
      return;
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;

    // Find user in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'User not found'
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: 'Account deactivated',
        message: 'Your account has been deactivated'
      });
      return;
    }

    // Check if email is verified (except for admin)
    if (!user.emailVerified && user.role !== 'admin') {
      res.status(401).json({
        success: false,
        error: 'Email not verified',
        message: 'Please verify your email address'
      });
      return;
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
        message: 'The provided token has expired'
      });
      return;
    }

    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
};

export const requireRole = (roles: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
      });
      return;
    }

    next();
  };
};

export const requireAnyRole = (roles: string[]) => {
  return requireRole(roles);
};

export const requireAllRoles = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
      return;
    }

    const hasAllRoles = roles.every(role => req.user!.role === role);

    if (!hasAllRoles) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `Access denied. Required all roles: ${roles.join(', ')}`
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    if (!token) {
      next();
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const decoded = jwt.verify(token, jwtSecret) as JWTPayload;
    const user = await User.findById(decoded.userId);

    if (user && user.isActive && user.emailVerified) {
      req.user = user;
    }

    next();

  } catch (error) {
    // For optional auth, we don't return errors, just continue without user
    next();
  }
};

export const requireEmailVerification = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
    return;
  }

  if (!req.user.emailVerified) {
    res.status(403).json({
      success: false,
      error: 'Email verification required',
      message: 'Please verify your email address to access this feature'
    });
    return;
  }

  next();
};

export const requireSubscription = (subscriptionTypes: string | string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
      return;
    }

    const allowedTypes = Array.isArray(subscriptionTypes) ? subscriptionTypes : [subscriptionTypes];

    if (!allowedTypes.includes(req.user.subscription.type)) {
      res.status(403).json({
        success: false,
        error: 'Premium subscription required',
        message: `This feature requires a ${allowedTypes.join(' or ')} subscription`
      });
      return;
    }

    // Check if subscription is active
    if (req.user.subscription.status !== 'active') {
      res.status(403).json({
        success: false,
        error: 'Subscription inactive',
        message: 'Your subscription is not active. Please update your payment method.'
      });
      return;
    }

    // Check if subscription has expired
    if (req.user.subscription.expiresAt && req.user.subscription.expiresAt < new Date()) {
      res.status(403).json({
        success: false,
        error: 'Subscription expired',
        message: 'Your subscription has expired. Please renew to continue.'
      });
      return;
    }

    next();
  };
};

export const requireParentalConsent = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
    return;
  }

  // Check if user is under 13 and needs parental consent
  if (req.user.role === 'student' && req.user.isUnder13 && req.user.needsParentalConsent) {
    res.status(403).json({
      success: false,
      error: 'Parental consent required',
      message: 'This feature requires parental consent. Please ask your parent to link their account.'
    });
    return;
  }

  next();
};