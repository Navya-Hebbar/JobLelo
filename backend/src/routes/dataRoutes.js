const express = require('express');
const dataController = require('../controllers/dataController');
const router = express.Router();

// Resume routes
router.post('/resume/save', dataController.saveResume);
router.get('/resume/:userId', dataController.getResume);
router.get('/resumes', dataController.getAllResumes);
router.delete('/resume/:id', dataController.deleteResume);

// Test score routes
router.post('/skills/submit', dataController.submitTestScore);
router.get('/skills/scores', dataController.getTestScores);

module.exports = router;