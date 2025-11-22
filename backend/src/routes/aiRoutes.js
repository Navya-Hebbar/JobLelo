const express = require('express');
const aiController = require('../controllers/aiController');
const router = express.Router();

router.post('/chat', aiController.chatWithAI);
router.post('/resume/analyze', aiController.analyzeResume);
router.post('/jobs/match', aiController.matchJobs);
router.post('/skills/generate', aiController.generateSkillTest);
router.post('/roadmap/generate', aiController.generateRoadmap);

module.exports = router;