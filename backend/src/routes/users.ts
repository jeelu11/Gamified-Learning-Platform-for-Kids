import express from 'express';
import { authenticate, requireRole } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';

const router = express.Router();

// Get current user profile
router.get('/profile',
  authenticate,
  asyncHandler(async (req: any, res) => {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  })
);

// Update user profile
router.put('/profile',
  authenticate,
  asyncHandler(async (req: any, res) => {
    // Placeholder for profile update logic
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: req.user
      }
    });
  })
);

// Get user settings
router.get('/settings',
  authenticate,
  asyncHandler(async (req: any, res) => {
    res.json({
      success: true,
      data: {
        settings: req.user.settings
      }
    });
  })
);

// Update user settings
router.put('/settings',
  authenticate,
  asyncHandler(async (req: any, res) => {
    // Placeholder for settings update logic
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: {
        settings: req.user.settings
      }
    });
  })
);

// Admin only: Get all users
router.get('/',
  authenticate,
  requireRole('admin'),
  asyncHandler(async (req, res) => {
    // Placeholder for admin user management
    res.json({
      success: true,
      message: 'Admin user management endpoint'
    });
  })
);

export default router;