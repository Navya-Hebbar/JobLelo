// backend/src/config/gemini.js
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is missing in .env");
  console.error("⚠️  Please create a .env file in backend/src/ with your GEMINI_API_KEY");
  console.error("⚠️  Get your API key from: https://makersuite.google.com/app/apikey");
}

let model = null;

if (GEMINI_API_KEY) {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    console.log("✅ Gemini AI initialized successfully");
  } catch (error) {
    console.error("❌ Error initializing Gemini AI:", error.message);
    model = null;
  }
} else {
  console.warn("⚠️  Gemini AI not available - API key missing");
}

// Export a function to check if Gemini is available
export const isGeminiAvailable = () => {
  return model !== null && GEMINI_API_KEY !== undefined;
};

export default model;