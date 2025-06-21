import express from 'express';
import { analyzeExerciseForm } from '../controllers/exerciseController.js';
import { authenticateToken } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Route for analyzing exercise form using video
router.post('/analyze', authenticateToken, upload.single('video'), analyzeExerciseForm);

export default router; 