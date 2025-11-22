// src/services/api.js

const API_BASE_URL = 'http://127.0.0.1:5000/api'; 

export const api = {
  /**
   * The function called by the React component to get job matches.
   * @param {Object} profile - User's profile data
   * @returns {Promise<Object>} - API response with job matches
   */
  getJobMatches: async ({ skills, experience, preferences }) => {
    // 1. Build the query string
    const params = new URLSearchParams();
    skills.forEach(skill => {
        params.append('skills', skill);
    });
    // Add other filters as needed (e.g., location, salary)
    if (preferences.location) {
        params.append('location', preferences.location);
    }
    
    const url = `${API_BASE_URL}/job-matches?${params.toString()}`;

    // 2. Fetch data from the Python backend
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error fetching job matches:', error);
      // Ensure the return object matches the expected structure to prevent crashes
      return { success: false, matches: [], error: error.message };
    }
  },
};