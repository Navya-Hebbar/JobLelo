const Resume = require('../models/Resume');
const TestResult = require('../models/TestResult');

// Save or Update Resume
const saveResume = async (req, res) => {
  try {
    const resumeData = req.body;
    const userId = req.user._id; // Assumes authMiddleware adds user to req

    if (!resumeData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Resume data is required' 
      });
    }

    // Check if resume exists for this user
    let resume = await Resume.findOne({ userId });

    if (resume) {
      // Update existing resume
      resume = await Resume.findOneAndUpdate(
        { userId },
        { 
          ...resumeData, 
          version: resume.version + 1 
        },
        { new: true } // Return the updated document
      );
    } else {
      // Create new resume
      resume = await Resume.create({
        ...resumeData,
        userId
      });
    }

    res.json({ 
      success: true, 
      message: 'Resume saved successfully',
      resumeId: resume._id,
      version: resume.version
    });
  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save resume to database' 
    });
  }
};

// Get Resume for a specific user (or logged in user)
const getResume = async (req, res) => {
  try {
    // Allow getting own resume or specific user's resume (if admin/authorized)
    const targetUserId = req.params.userId === 'current' ? req.user._id : req.params.userId;
    
    const resume = await Resume.findOne({ userId: targetUserId }).sort({ updatedAt: -1 });
    
    if (!resume) {
      return res.json({ 
        success: true, 
        resume: null,
        message: 'No resume found for this user'
      });
    }

    res.json({ 
      success: true, 
      resume
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve resume' 
    });
  }
};

// Get all resumes (admin only feature usually)
const getAllResumes = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    
    const resumes = await Resume.find(query).sort({ updatedAt: -1 });

    res.json({ 
      success: true, 
      resumes,
      count: resumes.length
    });
  } catch (error) {
    console.error('Get all resumes error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve resumes' 
    });
  }
};

// Delete Resume
const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    // Ensure user deletes only their own resume
    const result = await Resume.findOneAndDelete({ _id: id, userId });
    
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resume not found or unauthorized' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Resume deleted successfully' 
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete resume' 
    });
  }
};

// Submit Test Score (Real-time Logic)
const submitTestScore = async (req, res) => {
  try {
    const scoreData = req.body;
    const userId = req.user._id;
    
    if (!scoreData || typeof scoreData.score !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid score data is required' 
      });
    }

    // --- Real-time Validation Logic ---
    const totalQuestions = scoreData.totalQuestions || 5;
    const timeTaken = scoreData.timeTakenSeconds || 0;
    
    // Allow 60 seconds per question + 10 seconds buffer
    const allowedTime = (totalQuestions * 60) + 10; 
    const isTimeValid = timeTaken <= allowedTime;

    // Determine speed rating
    let speedRating = 'Normal';
    const avgTimePerQuestion = timeTaken / totalQuestions;
    
    if (avgTimePerQuestion < 10) speedRating = 'Super Fast'; 
    else if (avgTimePerQuestion < 30) speedRating = 'Fast';
    else if (avgTimePerQuestion > 50) speedRating = 'Deliberate';

    const testResult = await TestResult.create({
      ...scoreData,
      userId,
      passed: scoreData.score >= 70,
      speedRating,
      completedInTime: isTimeValid && (scoreData.completedInTime !== false),
      // Mark as suspicious if time is impossibly low (e.g., < 2s per question)
      isSuspicious: avgTimePerQuestion < 2 
    });

    res.json({ 
      success: true,
      message: 'Test score submitted successfully',
      result: testResult
    });
  } catch (error) {
    console.error('Submit test score error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit test score' 
    });
  }
};

// Get Test Scores
const getTestScores = async (req, res) => {
  try {
    const userId = req.query.userId || req.user._id;
    
    const scores = await TestResult.find({ userId })
      .sort({ timestamp: -1 }); // Newest first

    res.json({ 
      success: true, 
      scores,
      count: scores.length
    });
  } catch (error) {
    console.error('Get test scores error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve test scores' 
    });
  }
};

module.exports = { 
  saveResume, 
  getResume, 
  getAllResumes,
  deleteResume,
  submitTestScore,
  getTestScores
};