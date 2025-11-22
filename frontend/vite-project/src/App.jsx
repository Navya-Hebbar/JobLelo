// frontend/vite-project/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VoiceProvider } from './context/VoiceContext';
import { AuthProvider } from './context/AuthContext';

// Components
import NavBar from './components/NavBar';
import VoiceControlBar from './components/VoiceControlBar';
import AccessibilityPrompt from './components/AccessibilityPrompt';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ChatAssistant from './pages/ChatAssistant';
import ResumeBuilder from './pages/ResumeBuilder';
import SkillTest from './pages/SkillTest';
import JobRecommendations from './pages/JobRecommendations';
import UserReg from "./pages/UserReg";
import Login from "./pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserReg/>} />
      <Route path="/login" element={<Login/>} /> 
    </Routes>
  );
}

export default App;