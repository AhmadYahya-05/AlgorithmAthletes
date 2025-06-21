import express from 'express';
const router = express.Router();
import { updateProfile, getProfile } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

// @route   GET api/profile
// @desc    Get user profile
// @access  Private
router.get('/', authenticateToken, getProfile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', authenticateToken, updateProfile);

export default router; 