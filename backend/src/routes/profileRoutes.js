import express from 'express';
const router = express.Router();
import { updateProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', authenticateToken, updateProfile);

export default router; 