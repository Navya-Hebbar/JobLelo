// frontend/vite-project/src/services/api.js
const getBaseUrl = () => {
  let base = import.meta.env.VITE_API_URL || "http://localhost:5000";
  // Remove trailing slash if present
  if (base.endsWith('/')) {
    base = base.slice(0, -1);
  }
  // Append /api if not present
  if (!base.endsWith('/api')) {
    base += '/api';
  }
  return base;
};

const API_BASE_URL = getBaseUrl();

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

    // Ensure endpoint starts with /
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers,
      ...options,
    });

    const data = await res.json();
    
    // Handle authentication errors
    if (res.status === 401 || res.status === 403) {
      // Only clear and redirect if we have a token that is now invalid
      if (localStorage.getItem('joblelo_token')) {
        localStorage.removeItem('joblelo_token');
        localStorage.removeItem('joblelo_user'); // Updated key
        window.location.href = '/login';
      }
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

  // Coding Platform Services [NEW]
  getAllProblems: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    return request(`/coding/problems?${query}`);
  },

  getProblemDetails: async (slug) => {
    return request(`/coding/problems/${slug}`);
  },

  runCode: async (data) => {
    return request('/coding/run', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  submitSolution: async (data) => {
    return request('/coding/submit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  refreshProblems: async () => {
    return request('/coding/refresh', { method: 'POST' });
  },

  getLeaderboard: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/coding/leaderboard?${query}`);
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