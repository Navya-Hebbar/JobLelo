// frontend/vite-project/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { VoiceProvider } from './context/VoiceContext';
import { AuthProvider, useAuth } from './context/AuthContext';

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
import CodingPlatform from './pages/CodingPlatform';
import UserReg from "./pages/UserReg";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RoadmapPage from './pages/roadmap';
import AboutUsContact from './pages/AboutUsContact';

const AppContent = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isAuthenticated, loading } = useAuth();
  const isUserAuthenticated = isAuthenticated();

  useEffect(() => {
    if (isUserAuthenticated) {
      const hasSeenPrompt = localStorage.getItem('joblelo_seen_accessibility_prompt');
      if (!hasSeenPrompt) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 1000);
      }
    }
  }, [isUserAuthenticated]);

  const handlePromptComplete = (enabled) => {
    localStorage.setItem('joblelo_seen_accessibility_prompt', 'true');
    if (enabled) {
      localStorage.setItem('joblelo_voice_enabled', 'true');
    }
    setShowPrompt(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
  }

  return (
    <VoiceProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
        {showPrompt && isUserAuthenticated && (
          <AccessibilityPrompt onComplete={handlePromptComplete} />
        )}

        <NavBar />

        <main className="container mx-auto px-4 py-8 pb-24">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <Home />} 
            />
            
            <Route 
              path="/register" 
              element={isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <UserReg />} 
            />
            
            <Route 
              path="/login" 
              element={isUserAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} 
            />
            
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
              path="/coding" 
              element={
                <ProtectedRoute>
                  <CodingPlatform />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/roadmap" 
              element={
                <ProtectedRoute>
                 <RoadmapPage />
                </ProtectedRoute>
              } 
            />
             <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                 <AboutUsContact />
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
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {isUserAuthenticated && <VoiceControlBar />}
      </div>
    </VoiceProvider>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;