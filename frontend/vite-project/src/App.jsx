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
import Profile from "./pages/Profile";

function App() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('joblelo_token');
    setIsAuthenticated(!!token);
  }, []);

  // Check if user has seen accessibility prompt before
  useEffect(() => {
    // Only show prompt if user is authenticated
    if (isAuthenticated) {
      const hasSeenPrompt = localStorage.getItem('joblelo_seen_accessibility_prompt');
      if (!hasSeenPrompt) {
        // Delay showing the prompt to avoid interfering with login
        setTimeout(() => {
          setShowPrompt(true);
        }, 1000);
      }
    }
  }, [isAuthenticated]);

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
            {/* Accessibility Overlay - Only show for authenticated users on first visit */}
            {showPrompt && isAuthenticated && (
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
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
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
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Floating Voice Controls - Only show for authenticated users */}
            {isAuthenticated && <VoiceControlBar />}
          </div>
        </VoiceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;