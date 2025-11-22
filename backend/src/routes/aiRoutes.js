const express = require('express');
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// All AI routes require authentication
router.post('/chat', authMiddleware, aiController.chatWithAI);
router.post('/resume/analyze', authMiddleware, aiController.analyzeResume);
router.post('/jobs/match', authMiddleware, aiController.matchJobs);
router.post('/skills/generate', authMiddleware, aiController.generateSkillTest);
router.post('/roadmap/generate', authMiddleware, aiController.generateRoadmap);

module.exports = router;