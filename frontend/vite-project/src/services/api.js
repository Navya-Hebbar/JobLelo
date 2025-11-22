// frontend/vite-project/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('joblelo_token');
};

// Helper for requests with better error handling and auth
const request = async (endpoint, options = {}) => {
  try {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // Add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers,
      ...options,
    });

    const data = await res.json();
    
    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      // Token expired or invalid
      localStorage.removeItem('joblelo_token');
      localStorage.removeItem('joblelo_user_email');
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!res.ok) {
      throw new Error(data.error || data.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    return data;
  } catch (err) {
    console.error(`API Request failed: ${endpoint}`, err);
    throw err;
  }
};

export const api = {
  // Authentication Services
  register: async (email, password) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  login: async (email, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  // AI Chat Service
  chatWithAI: async (messages) => {
    return request('/chat', { 
      method: 'POST', 
      body: JSON.stringify({ messages }) 
    });
  },

  // Resume Services
  saveResume: async (resumeData) => {
    return request('/resume/save', { 
      method: 'POST', 
      body: JSON.stringify(resumeData) 
    });
  },
  
  getResume: async (userId) => {
    return request(`/resume/${userId || 'current'}`);
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

  // User Profile Services
  getUserProfile: async () => {
    return request('/user/profile');
  },

  updateUserProfile: async (profileData) => {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
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