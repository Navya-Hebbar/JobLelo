// backend/src/routes/dataRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
  saveResume, 
  getResume, 
  getAllResumes,
  deleteResume,
  submitTestScore,
  getTestScores
} from '../controllers/dataController.js';

const router = express.Router();

// Resume routes
router.post('/resume/save', authMiddleware, saveResume);
router.get('/resume/:userId', authMiddleware, getResume);
router.get('/resumes', authMiddleware, getAllResumes);
router.delete('/resume/:id', authMiddleware, deleteResume);

// Test score routes
router.post('/skills/submit', authMiddleware, submitTestScore);
router.get('/skills/scores', authMiddleware, getTestScores);

export default router;