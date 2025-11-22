import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { VoiceProvider } from './context/VoiceContext';

// Components
import NavBar from './components/NavBar';
import VoiceControlBar from './components/VoiceControlBar';
import AccessibilityPrompt from './components/AccessibilityPrompt';

// Pages
import Home from './pages/Home';
import ChatAssistant from './pages/ChatAssistant';
import ResumeBuilder from './pages/ResumeBuilder';
import SkillTest from './pages/SkillTest';
import JobRecommendations from './pages/JobRecommendations';
import UserReg from "./pages/UserReg";
import Login from "./pages/Login";

function App() {
  const [showPrompt, setShowPrompt] = useState(true);

  return (
    <VoiceProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
          {/* Accessibility Overlay */}
          {showPrompt && (
            <AccessibilityPrompt onComplete={() => setShowPrompt(false)} />
          )}

          {/* Navigation */}
          <NavBar />

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8 pb-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<UserReg />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<ChatAssistant />} />
              <Route path="/resume" element={<ResumeBuilder />} />
              <Route path="/test" element={<SkillTest />} />
              <Route path="/jobs" element={<JobRecommendations />} />
              
              {/* Fallback route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>

          {/* Floating Voice Controls */}
          <VoiceControlBar />
        </div>
      </Router>
    </VoiceProvider>
  );
}

export default App;