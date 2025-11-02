import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'); // 15 minutes
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100');

export const rateLimiter = rateLimit({
  windowMs,
  max: maxRequests,
  message: {
    success: false,
    error: 'Too many requests',
    message: `Rate limit exceeded. Please try again in ${Math.ceil(windowMs / 60000)} minutes.`,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      message: `Rate limit exceeded. Please try again in ${Math.ceil(windowMs / 60000)} minutes.`,
    });
  },
});

// Stricter rate limiting for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many authentication attempts',
    message: 'Please try again in 15 minutes.',
  },
  skipSuccessfulRequests: true,
});

// Password reset rate limiting
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    success: false,
    error: 'Too many password reset attempts',
    message: 'Please try again in 1 hour.',
  },
});

// Email verification rate limiting
export const emailVerificationRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    error: 'Too many verification attempts',
    message: 'Please try again in 10 minutes.',
  },
});