import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const VoiceContext = createContext();

export const VoiceProvider = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [focusedElement, setFocusedElement] = useState(null);
  
  const recognitionRef = useRef(null);
  const utteranceQueueRef = useRef([]);
  const isProcessingRef = useRef(false);

  // Initialize continuous voice recognition
  useEffect(() => {
    if (isVoiceEnabled && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Voice recognition started');
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
        console.log('Voice command:', transcript);
        handleVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.error('Speech recognition error:', event.error);
        }
        // Auto-restart on error
        setTimeout(() => {
          if (isVoiceEnabled) {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }
        }, 1000);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Auto-restart continuous listening
        if (isVoiceEnabled) {
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 500);
        }
      };

      recognitionRef.current = recognition;

      // Start recognition
      try {
        recognition.start();
      } catch (e) {
        console.log('Recognition already started');
      }

      return () => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
      };
    }
  }, [isVoiceEnabled]);

  // Handle voice commands
  const handleVoiceCommand = (transcript) => {
    const command = transcript.toLowerCase();

    // Navigation commands
    if (command.includes('go to home') || command.includes('home page')) {
      window.location.href = '/';
      speak('Navigating to home page');
    } else if (command.includes('chat') || command.includes('assistant') || command.includes('talk to ai')) {
      window.location.href = '/chat';
      speak('Opening AI chat assistant');
    } else if (command.includes('resume') || command.includes('build resume')) {
      window.location.href = '/resume';
      speak('Opening resume builder');
    } else if (command.includes('test') || command.includes('skill test') || command.includes('take test')) {
      window.location.href = '/test';
      speak('Opening skill test');
    } else if (command.includes('jobs') || command.includes('find jobs') || command.includes('job recommendations')) {
      window.location.href = '/jobs';
      speak('Opening job recommendations');
    }
    
    // Help commands
    else if (command.includes('help') || command.includes('what can i do') || command.includes('commands')) {
      speakHelp();
    }
    
    // Page-specific commands
    else if (command.includes('read page') || command.includes('what is on the screen')) {
      readCurrentPage();
    }
    
    // Form interaction commands
    else if (command.includes('next field') || command.includes('next')) {
      focusNextElement();
    } else if (command.includes('previous field') || command.includes('previous') || command.includes('back')) {
      focusPreviousElement();
    } else if (command.includes('click button') || command.includes('press button') || command.includes('submit')) {
      clickButton();
    }
    
    // Reading commands
    else if (command.includes('repeat') || command.includes('say again')) {
      repeatLastMessage();
    } else if (command.includes('stop talking') || command.includes('be quiet') || command.includes('silence')) {
      stopSpeaking();
    }
    
    // Unknown command
    else {
      speak('Command not recognized. Say help for available commands.');
    }
  };

  // Text-to-Speech with queue management
  const speak = (text, priority = false, onEnd = null) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      isProcessingRef.current = true;
      // Pause recognition while speaking
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log('Recognition already stopped');
        }
      }
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      isProcessingRef.current = false;
      
      // Process next in queue
      utteranceQueueRef.current.shift();
      if (utteranceQueueRef.current.length > 0) {
        window.speechSynthesis.speak(utteranceQueueRef.current[0]);
      } else {
        // Resume recognition after speaking
        if (isVoiceEnabled && recognitionRef.current) {
          setTimeout(() => {
            try {
              recognitionRef.current.start();
            } catch (e) {
              console.log('Recognition already started');
            }
          }, 500);
        }
      }
      
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.error('Speech error:', e);
      setIsSpeaking(false);
      isProcessingRef.current = false;
    };

    if (priority) {
      window.speechSynthesis.cancel();
      utteranceQueueRef.current = [];
      window.speechSynthesis.speak(utterance);
    } else {
      utteranceQueueRef.current.push(utterance);
      if (utteranceQueueRef.current.length === 1) {
        window.speechSynthesis.speak(utterance);
      }
    }

    // Store last message for repeat
    localStorage.setItem('lastSpokenMessage', text);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];
    setIsSpeaking(false);
    isProcessingRef.current = false;
    
    // Resume recognition
    if (isVoiceEnabled && recognitionRef.current) {
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log('Recognition already started');
        }
      }, 500);
    }
  };

  const repeatLastMessage = () => {
    const lastMessage = localStorage.getItem('lastSpokenMessage');
    if (lastMessage) {
      speak(lastMessage, true);
    } else {
      speak('No previous message to repeat');
    }
  };

  const speakHelp = () => {
    const helpText = `Available voice commands:
    Navigation: Say "go to home", "open chat", "build resume", "take test", or "find jobs".
    Page actions: Say "read page", "next field", "previous field", or "click button".
    Help: Say "help" for this message, "repeat" to hear the last message, or "stop talking" to silence me.
    At any time, just say what you want to do, and I will help you.`;
    speak(helpText, true);
  };

  const readCurrentPage = () => {
    const pageContent = document.querySelector('main') || document.body;
    const headings = pageContent.querySelectorAll('h1, h2, h3');
    const paragraphs = pageContent.querySelectorAll('p');
    
    let content = 'Current page content: ';
    headings.forEach(h => {
      content += h.textContent + '. ';
    });
    
    if (paragraphs.length > 0) {
      content += paragraphs[0].textContent;
    }
    
    speak(content, true);
  };

  const focusNextElement = () => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    
    if (focusableElements[nextIndex]) {
      focusableElements[nextIndex].focus();
      const label = focusableElements[nextIndex].getAttribute('aria-label') || 
                    focusableElements[nextIndex].textContent ||
                    focusableElements[nextIndex].placeholder ||
                    'Interactive element';
      speak(`Focused on: ${label}`);
    }
  };

  const focusPreviousElement = () => {
    const focusableElements = document.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
    );
    
    const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
    const prevIndex = currentIndex - 1 < 0 ? focusableElements.length - 1 : currentIndex - 1;
    
    if (focusableElements[prevIndex]) {
      focusableElements[prevIndex].focus();
      const label = focusableElements[prevIndex].getAttribute('aria-label') || 
                    focusableElements[prevIndex].textContent ||
                    focusableElements[prevIndex].placeholder ||
                    'Interactive element';
      speak(`Focused on: ${label}`);
    }
  };

  const clickButton = () => {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === 'BUTTON' || activeElement.tagName === 'A')) {
      activeElement.click();
      speak('Button clicked');
    } else {
      speak('No button is currently focused. Say next field to navigate to a button.');
    }
  };

  // Listen for specific callback
  const startListening = (callback) => {
    if (!('webkitSpeechRecognition' in window)) {
      speak('Speech recognition not supported. Please use Chrome or Edge browser.', true);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        console.error('Speech recognition error:', event.error);
        speak('Could not understand. Please try again.', true);
      }
      setIsListening(false);
    };

    // Stop continuous recognition temporarily
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Recognition already stopped');
      }
    }

    try {
      recognition.start();
    } catch (err) {
      console.error('Could not start recognition:', err);
    }
  };

  return (
    <VoiceContext.Provider value={{
      isVoiceEnabled,
      setIsVoiceEnabled,
      isListening,
      isSpeaking,
      isBlindMode,
      setIsBlindMode,
      speak,
      startListening,
      stopSpeaking,
      speakHelp,
      readCurrentPage,
      currentPage,
      setCurrentPage
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);