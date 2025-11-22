const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper for requests with better error handling
const request = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options,
    });

    const data = await res.json();
    
    if (!res.ok) {
      throw new Error(data.error || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return data;
  } catch (err) {
    console.error(`API Request failed: ${endpoint}`, err);
    throw err;
  }
};

export const api = {
  // AI Chat Service
  chatWithAI: async (messages) => {
    return request('/chat', { 
      method: 'POST', 
      body: JSON.stringify({ 
        messages: messages // Send the full array
      }) 
    });
  },

  // Resume Services
  saveResume: async (resumeData) => {
    return request('/resume/save', { 
      method: 'POST', 
      body: JSON.stringify(resumeData) 
    });
  },
  
  getResume: async (userId = 'guest') => {
    return request(`/resume/${userId}`);
  },

  analyzeResume: async (resumeText) => {
    return request('/resume/analyze', {
      method: 'POST',
      body: JSON.stringify({ resumeText })
    });
  },

  // Skill Test Services
  generateTest: async (topic = 'JavaScript', difficulty = 'Medium', count = 5) => {
    return request('/skills/generate', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty, count })
    });
  },
  
  submitTest: async (testResults) => {
    return request('/skills/submit', { 
      method: 'POST', 
      body: JSON.stringify(testResults) 
    });
  },

  getTestScores: async (userId = null) => {
    const query = userId ? `?userId=${userId}` : '';
    return request(`/skills/scores${query}`);
  },

  // Job Matching Services
  getJobMatches: async (profile) => {
    const { skills = [], experience = '0 years', preferences = {} } = profile;
    
    return request('/jobs/match', {
      method: 'POST',
      body: JSON.stringify({ skills, experience, preferences })
    });
  },
  
  // Roadmap Services
  generateRoadmap: async (targetRole, currentSkills = [], timeframe = 6) => {
    return request('/roadmap/generate', {
      method: 'POST',
      body: JSON.stringify({ targetRole, currentSkills, timeframe })
    });
  },

  // Health Check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'offline', error: error.message };
    }
  }
};

export default api;