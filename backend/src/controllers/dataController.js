const db = require('../data/mockDb');

const saveResume = (req, res) => {
  try {
    const resume = req.body;
    
    if (!resume || Object.keys(resume).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Resume data is required' 
      });
    }

    // Add metadata
    const resumeData = {
      ...resume,
      id: resume.id || Date.now(),
      userId: resume.userId || 'guest',
      lastUpdated: new Date().toISOString(),
      version: (resume.version || 0) + 1
    };

    // Check if resume exists and update, otherwise create new
    const existingIndex = db.resumes.findIndex(
      r => r.userId === resumeData.userId && r.id === resumeData.id
    );

    if (existingIndex !== -1) {
      db.resumes[existingIndex] = resumeData;
    } else {
      db.resumes.push(resumeData);
    }

    res.json({ 
      success: true, 
      message: 'Resume saved successfully',
      resumeId: resumeData.id,
      version: resumeData.version
    });
  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save resume' 
    });
  }
};

const getResume = (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }

    // Get the most recent resume for this user
    const userResumes = db.resumes.filter(r => r.userId === userId);
    
    if (userResumes.length === 0) {
      return res.json({ 
        success: true, 
        resume: null,
        message: 'No resume found for this user'
      });
    }

    // Sort by version and get the latest
    userResumes.sort((a, b) => (b.version || 0) - (a.version || 0));
    const latestResume = userResumes[0];

    res.json({ 
      success: true, 
      resume: latestResume,
      totalVersions: userResumes.length
    });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to retrieve resume' 
    });
  }
};

const getAllResumes = (req, res) => {
  try {
    const { userId } = req.query;
    
    let resumes = db.resumes;
    
    if (userId) {
      resumes = resumes.filter(r => r.userId === userId);
    }

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

const deleteResume = (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Resume ID is required' 
      });
    }

    const initialLength = db.resumes.length;
    db.resumes = db.resumes.filter(r => r.id !== parseInt(id));
    
    if (db.resumes.length === initialLength) {
      return res.status(404).json({ 
        success: false, 
        error: 'Resume not found' 
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

const submitTestScore = (req, res) => {
  try {
    const scoreData = req.body;
    
    if (!scoreData || typeof scoreData.score !== 'number') {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid score data is required' 
      });
    }

    const testResult = {
      ...scoreData,
      id: Date.now(),
      userId: scoreData.userId || 'guest',
      timestamp: new Date().toISOString(),
      passed: scoreData.score >= 70
    };

    db.testScores.push(testResult);

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

const getTestScores = (req, res) => {
  try {
    const { userId } = req.query;
    
    let scores = db.testScores;
    
    if (userId) {
      scores = scores.filter(s => s.userId === userId);
    }

    // Sort by timestamp (newest first)
    scores.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

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