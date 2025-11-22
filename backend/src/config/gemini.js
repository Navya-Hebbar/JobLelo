const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is missing in .env");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use Gemini 1.5 Flash for speed and free tier usage
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

module.exports = model;