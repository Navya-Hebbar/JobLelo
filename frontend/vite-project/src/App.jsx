// navya-hebbar/joblelo/JobLelo-asdfghjk/frontend/vite-project/src/App.jsx

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

function App() {
  const [showPrompt, setShowPrompt] = useState(true);
import React from "react";
import { Routes, Route } from "react-router-dom";
import UserReg from "./pages/UserReg";
import Login from "./pages/Login";

const App = () => {
  return (
<<<<<<< HEAD
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
=======
    <Routes>
      <Route path="/" element={<UserReg/>} />
      <Route path="/login" element={<Login/>} /> 
    </Routes>
  );
};

export default App;
>>>>>>> 311b5309d34888a9548ec09d1030970f0263225a
