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
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'; 
// Load environment variables from .env file
dotenv.config();

// Configuration
const app = express();
// Use process.env.PORT or default to 5000 as specified in your example
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI; 

// 1. Middleware
app.use(express.json()); // Allows JSON data to be parsed in the request body
app.use(cors());         // Allows cross-origin requests

// 2. Routes
app.use('/api/auth', authRoutes);


// 3. Database Connection and Server Start
if (!MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in the environment variables.");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("MongoDB connection successful.");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Test Registration: POST http://localhost:${PORT}/api/auth/register`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });
