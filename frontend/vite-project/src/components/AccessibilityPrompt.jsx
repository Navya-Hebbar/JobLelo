import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Mic, Loader2 } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const AccessibilityPrompt = ({ onComplete }) => {
  const { speak, startListening, setIsBlindMode, setIsVoiceEnabled } = useVoice();
  const [started, setStarted] = useState(false);
  const [phase, setPhase] = useState('initial'); // initial, listening, processing
  const timeoutRef = useRef(null);

  // Auto-start voice instructions immediately
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start speaking after a brief delay to ensure audio context is ready
    timeoutRef.current = setTimeout(() => {
      startVoiceGreeting();
    }, 500);

    // Global keyboard listener for immediate activation
    const handleKeyPress = (e) => {
      // Any key press activates voice
      if (!started && phase === 'initial') {
        e.preventDefault();
        startVoiceGreeting();
      }
      // Space/Enter = Yes
      else if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleYes();
      }
      // Escape = No
      else if (e.code === 'Escape') {
        e.preventDefault();
        handleNo();
      }
    };

    // Click anywhere also activates
    const handleClick = () => {
      if (!started && phase === 'initial') {
        startVoiceGreeting();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [started, phase]);

  const startVoiceGreeting = () => {
    if (started) return;
    setStarted(true);
    setPhase('listening');

    const greeting = `Welcome to Joblelo, your AI-powered career assistant.
    This platform is fully accessible for blind users with complete voice control.
    
    You can navigate the entire website using voice commands. Say things like:
    Open chat assistant, Build my resume, Take a skill test, or Find jobs.
    
    To enable full voice control, say YES or press the Space bar.
    To skip voice features, say NO or press Escape.
    
    I'm listening now. What would you like to do?`;

    speak(greeting, true, () => {
      // After greeting, start continuous listening
      listenForResponse();
    });
  };

  const listenForResponse = () => {
    startListening((transcript) => {
      const text = transcript.toLowerCase().trim();
      console.log('User said:', text);

      // Check for affirmative responses
      if (
        text.includes('yes') || 
        text.includes('enable') || 
        text.includes('activate') ||
        text.includes('turn on') ||
        text.includes('sure') || 
        text.includes('okay') ||
        text.includes('ok')
      ) {
        handleYes();
      }
      // Check for negative responses
      else if (
        text.includes('no') || 
        text.includes('disable') || 
        text.includes('skip') ||
        text.includes('cancel') ||
        text.includes('not now')
      ) {
        handleNo();
      }
      // If unclear, ask again
      else {
        speak(
          'I did not understand. Please say YES to enable voice control, or NO to skip.',
          true,
          () => listenForResponse()
        );
      }
    });
  };

  const handleYes = () => {
    setPhase('processing');
    setIsBlindMode(true);
    setIsVoiceEnabled(true);

    const confirmationMessage = `Excellent! Voice control is now active.
    
    Here are the main features available:
    
    Number 1: AI Chat Assistant - Get career advice and interview preparation.
    Number 2: Resume Builder - Create an ATS-friendly resume with voice input.
    Number 3: Skill Tests - Take adaptive tests with spoken questions and answers.
    Number 4: Job Matching - Find jobs that match your skills using AI.
    
    You can navigate by saying: Go to chat, Build resume, Take test, or Find jobs.
    
    At any time, say HELP to hear available commands, or say STOP TALKING if you need me to be quiet.
    
    You are now on the home page. Say HELP for navigation commands, or say what you'd like to do.`;

    speak(confirmationMessage, true, () => {
      setTimeout(() => onComplete(true), 1000);
    });
  };

  const handleNo = () => {
    setPhase('processing');
    setIsBlindMode(false);
    setIsVoiceEnabled(false);

    speak(
      'Voice control has been disabled. You can enable it later by clicking the voice button at the bottom of the page. Continuing to the website.',
      true,
      () => {
        setTimeout(() => onComplete(false), 1000);
      }
    );
  };

  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-black flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-live="assertive"
      aria-labelledby="voice-setup-title"
    >
      {/* Screen reader announcement */}
      <div className="sr-only" id="voice-setup-title">
        Voice Control Setup. A welcome message will play automatically. 
        Press Space bar to enable voice control, or Escape to skip.
      </div>

      {/* Visual indicator */}
      <div className="text-center max-w-2xl">
        {/* Animated icon */}
        <div className="mb-8 mx-auto w-32 h-32 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {phase === 'initial' && (
              <Volume2 className="w-16 h-16 text-white animate-bounce" />
            )}
            {phase === 'listening' && (
              <Mic className="w-16 h-16 text-white animate-pulse" />
            )}
            {phase === 'processing' && (
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            )}
          </div>
        </div>

        {/* Text status */}
        <div className="text-white space-y-4">
          <h1 className="text-4xl font-bold mb-4">
            🎤 Voice Control Setup
          </h1>
          
          <div className="text-xl bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            {phase === 'initial' && (
              <p>
                <span className="block text-2xl mb-2">🔊 Audio Starting...</span>
                Press any key or click anywhere to begin
              </p>
            )}
            {phase === 'listening' && (
              <p>
                <span className="block text-2xl mb-2 animate-pulse">🎤 Listening...</span>
                Say "YES" to enable voice control
                <br />
                Say "NO" to skip
              </p>
            )}
            {phase === 'processing' && (
              <p>
                <span className="block text-2xl mb-2">⚙️ Processing...</span>
                Setting up your experience...
              </p>
            )}
          </div>

          {/* Keyboard shortcuts */}
          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 text-sm">
            <p className="font-bold mb-2">⌨️ Keyboard Shortcuts:</p>
            <div className="flex gap-4 justify-center">
              <span className="bg-green-500/20 px-3 py-1 rounded border border-green-400">
                Space = Enable
              </span>
              <span className="bg-red-500/20 px-3 py-1 rounded border border-red-400">
                Escape = Skip
              </span>
            </div>
          </div>

          {/* Browser compatibility note */}
          <p className="text-sm text-white/60 mt-4">
            ℹ️ Voice features work best in Chrome or Edge browsers
          </p>
        </div>
      </div>

      {/* Sound wave visualization */}
      {phase === 'listening' && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-white rounded-full animate-pulse"
              style={{
                height: `${20 + i * 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessibilityPrompt;