// backend/src/routes/aiRoutes.js
import express from 'express';
import aiController from '../controllers/aiController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/chat', authMiddleware, aiController.chatWithAI);
router.get('/languages', authMiddleware, aiController.getSupportedLanguages); // New endpoint for languages
router.post('/resume/analyze', authMiddleware, aiController.analyzeResume);
router.post('/jobs/match', authMiddleware, aiController.matchJobs);
router.post('/skills/generate', authMiddleware, aiController.generateSkillTest);
router.post('/roadmap/generate', authMiddleware, aiController.generateRoadmap);

export default router;