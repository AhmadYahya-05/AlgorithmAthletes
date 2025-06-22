import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getAllUsers, addFriend, getFriends } from '../controllers/userController.js';

const router = express.Router();

// All routes in this file require authentication
router.use(authenticateToken);

// Routes for friends and user searching
router.route('/')
  .get(getAllUsers);

router.route('/friends')
  .get(getFriends);

router.route('/friends/:friendId')
  .post(addFriend);

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