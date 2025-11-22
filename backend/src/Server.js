const express = require('express');
const cors = require('cors');
require('dotenv').config();

const aiRoutes = require('./routes/aiRoutes');
const dataRoutes = require('./routes/dataRoutes');
// const voiceRoutes = require('./routes/voiceRoutes'); // Imported voice routes

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Mount Routes
app.use('/api', aiRoutes);
app.use('/api', dataRoutes);
// app.use('/api', voiceRoutes); // Mounted voice routes

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'Joblelo AI Backend (Gemini-Powered)',
    endpoints: {
      chat: '/api/chat',
      resume: '/api/resume/*',
      jobs: '/api/jobs/match',
      skills: '/api/skills/*',
      roadmap: '/api/roadmap/generate',
      voice: '/api/transcribe'
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Docs available at http://localhost:${PORT}`);
});