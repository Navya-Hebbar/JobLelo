// frontend/vite-project/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VoiceProvider } from './context/VoiceContext';
import { AuthProvider } from './context/AuthContext';

// Components
import NavBar from './components/NavBar';
import VoiceControlBar from './components/VoiceControlBar';
import AccessibilityPrompt from './components/AccessibilityPrompt';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import ChatAssistant from './pages/ChatAssistant';
import ResumeBuilder from './pages/ResumeBuilder';
import SkillTest from './pages/SkillTest';
import JobRecommendations from './pages/JobRecommendations';
import UserReg from "./pages/UserReg";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const [showPrompt, setShowPrompt] = useState(false);

  // Check if user has seen accessibility prompt before
  useEffect(() => {
    const hasSeenPrompt = localStorage.getItem('joblelo_seen_accessibility_prompt');
    if (!hasSeenPrompt) {
      setShowPrompt(true);
    }
  }, []);

  const handlePromptComplete = (enabled) => {
    localStorage.setItem('joblelo_seen_accessibility_prompt', 'true');
    if (enabled) {
      localStorage.setItem('joblelo_voice_enabled', 'true');
    }
    setShowPrompt(false);
  };

  return (
    <Router>
      <AuthProvider>
        <VoiceProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
            {/* Accessibility Overlay - Only show on first visit */}
            {showPrompt && (
              <AccessibilityPrompt onComplete={handlePromptComplete} />
            )}

            {/* Navigation */}
            <NavBar />

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 pb-24">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<UserReg />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected Routes */}
                <Route 
                  path="/chat" 
                  element={
                    <ProtectedRoute>
                      <ChatAssistant />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/resume" 
                  element={
                    <ProtectedRoute>
                      <ResumeBuilder />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/test" 
                  element={
                    <ProtectedRoute>
                      <SkillTest />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/jobs" 
                  element={
                    <ProtectedRoute>
                      <JobRecommendations />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Home />} />
              </Routes>
            </main>

            {/* Floating Voice Controls */}
            <VoiceControlBar />
          </div>
        </VoiceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;