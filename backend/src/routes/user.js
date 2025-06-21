import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateToken);

// Get user profile
router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  });
});

// Update user profile (placeholder for future implementation)
router.put('/profile', (req, res) => {
  res.json({
    success: true,
    message: 'Profile update endpoint - to be implemented'
  });
});

export default router; 