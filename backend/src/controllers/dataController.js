// backend/src/controllers/dataController.js
import Resume from '../models/Resume.js';
import TestResult from '../models/TestResult.js';

export const saveResume = async (req, res) => {
  try {
    const resumeData = req.body;
    const userId = req.user.userId; 

    if (!resumeData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Resume data is required' 
      });
    }

    let resume = await Resume.findOne({ userId });

    if (resume) {
      resume = await Resume.findOneAndUpdate(
        { userId },
        { 
          ...resumeData, 
          version: resume.version + 1 
        },
        { new: true }
      );
    } else {
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
      error: 'Failed to save resume' 
    });
  }
};

export const getResume = async (req, res) => {
  try {
    let targetUserId = req.params.userId;
    
    if (targetUserId === 'current') {
      targetUserId = req.user.userId;
    }

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

export const getAllResumes = async (req, res) => {
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

export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    
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

export const submitTestScore = async (req, res) => {
  try {
    const scoreData = req.body;
    const userId = req.user.userId;
    
    if (!scoreData || typeof scoreData.score !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid score data is required' 
      });
    }

    const totalQuestions = scoreData.totalQuestions || 5;
    const timeTaken = scoreData.timeTakenSeconds || 0;
    
    const allowedTime = (totalQuestions * 60) + 10; 
    const isTimeValid = timeTaken <= allowedTime;

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

export const getTestScores = async (req, res) => {
  try {
    const userId = req.query.userId || req.user.userId;
    
    const scores = await TestResult.find({ userId })
      .sort({ createdAt: -1 });

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