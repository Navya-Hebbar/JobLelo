const express = require('express');
const dataController = require('../controllers/dataController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// All data routes require authentication
router.post('/resume/save', authMiddleware, dataController.saveResume);
router.get('/resume/:userId', authMiddleware, dataController.getResume);
router.get('/resumes', authMiddleware, dataController.getAllResumes);
router.delete('/resume/:id', authMiddleware, dataController.deleteResume);

router.post('/skills/submit', authMiddleware, dataController.submitTestScore);
router.get('/skills/scores', authMiddleware, dataController.getTestScores);

module.exports = router;