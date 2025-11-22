const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Routes
const aiRoutes = require('./routes/aiRoutes');
const dataRoutes = require('./routes/dataRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/joblelo";

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Database Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB connection successful."))
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Mount Routes
app.use('/api', aiRoutes);
app.use('/api', dataRoutes);
app.use('/api/auth', authRoutes); // Prefix auth routes specifically

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'Joblelo AI Backend (Gemini-Powered)',
    endpoints: {
      chat: '/api/chat',
      resume: '/api/resume/save',
      jobs: '/api/jobs/match',
      skills: '/api/skills/generate',
      auth: '/api/auth/login'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false, 
    error: err.message || 'Internal Server Error' 
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});