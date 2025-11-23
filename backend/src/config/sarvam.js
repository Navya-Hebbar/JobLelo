// backend/src/config/sarvam.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Sarvam AI Configuration
const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
const SARVAM_API_URL = process.env.SARVAM_API_URL || 'https://api.sarvam.ai/v1/chat/completions';

if (!SARVAM_API_KEY) {
  console.warn("⚠️ Warning: SARVAM_API_KEY is missing in .env. Multilingual features will not work.");
}

// Supported languages mapping
export const SUPPORTED_LANGUAGES = {
  'en': { name: 'English', code: 'en', sarvamCode: 'en' },
  'hi': { name: 'हिंदी (Hindi)', code: 'hi', sarvamCode: 'hi' },
  'ta': { name: 'தமிழ் (Tamil)', code: 'ta', sarvamCode: 'ta' },
  'te': { name: 'తెలుగు (Telugu)', code: 'te', sarvamCode: 'te' },
  'kn': { name: 'ಕನ್ನಡ (Kannada)', code: 'kn', sarvamCode: 'kn' },
  'ml': { name: 'മലയാളം (Malayalam)', code: 'ml', sarvamCode: 'ml' },
  'mr': { name: 'मराठी (Marathi)', code: 'mr', sarvamCode: 'mr' },
  'bn': { name: 'বাংলা (Bengali)', code: 'bn', sarvamCode: 'bn' },
  'gu': { name: 'ગુજરાતી (Gujarati)', code: 'gu', sarvamCode: 'gu' },
  'pa': { name: 'ਪੰਜਾਬੀ (Punjabi)', code: 'pa', sarvamCode: 'pa' },
};

// Get language info
export const getLanguageInfo = (langCode) => {
  return SUPPORTED_LANGUAGES[langCode] || SUPPORTED_LANGUAGES['en'];
};

// Sarvam AI Chat Function
export const chatWithSarvam = async (messages, language = 'en') => {
  if (!SARVAM_API_KEY) {
    console.error('❌ Sarvam API key is not configured');
    throw new Error('Sarvam API key is not configured');
  }

  console.log(`🌐 Attempting Sarvam AI chat in language: ${language}`);
  console.log(`📝 Messages count: ${messages.length}`);

  try {
    // Format messages for Sarvam API
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // Add system message for context
    const systemMessage = {
      role: 'system',
      content: `You are Joblelo AI, an expert career assistant specializing in:
- Interview preparation and mock interviews
- Resume optimization and ATS compatibility
- Career roadmap planning
- Job search strategies
- Skill development guidance

Respond in ${getLanguageInfo(language).name}. Provide helpful, concise, and actionable advice. Be encouraging and professional.`
    };

    const requestBody = {
      model: 'sarvam-ai/OpenHathi-Hi-v0.5', // Default model, adjust based on Sarvam's available models
      messages: [systemMessage, ...formattedMessages],
      temperature: 0.7,
      max_tokens: 1000,
      language: language // Pass language preference
    };

    console.log(`🔗 Calling Sarvam API: ${SARVAM_API_URL}`);
    console.log(`📦 Request body keys:`, Object.keys(requestBody));

    const response = await axios.post(
      SARVAM_API_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${SARVAM_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    console.log(`✅ Sarvam API response status: ${response.status}`);
    console.log(`📥 Response data keys:`, response.data ? Object.keys(response.data) : 'No data');

    if (response.data && response.data.choices && response.data.choices.length > 0) {
      const content = response.data.choices[0].message.content;
      console.log(`💬 Sarvam response received (length: ${content.length})`);
      return content;
    }

    throw new Error('Invalid response from Sarvam AI - no choices in response');
  } catch (error) {
    console.error('❌ Sarvam AI error details:');
    console.error('   Error message:', error.message);
    console.error('   Response status:', error.response?.status);
    console.error('   Response data:', JSON.stringify(error.response?.data, null, 2));
    console.error('   Request URL:', error.config?.url);
    
    // Provide more helpful error messages
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 401 || status === 403) {
        throw new Error('Sarvam API authentication failed. Please check your SARVAM_API_KEY.');
      } else if (status === 404) {
        throw new Error('Sarvam API endpoint not found. Please check SARVAM_API_URL.');
      } else if (status === 400) {
        throw new Error(`Sarvam API bad request: ${data?.error?.message || data?.message || 'Invalid request format'}`);
      } else {
        throw new Error(`Sarvam API error (${status}): ${data?.error?.message || data?.message || error.message}`);
      }
    }
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to Sarvam API. Please check SARVAM_API_URL.');
    }
    
    throw new Error(`Sarvam AI request failed: ${error.message}`);
  }
};

export default {
  chatWithSarvam,
  SUPPORTED_LANGUAGES,
  getLanguageInfo
};

