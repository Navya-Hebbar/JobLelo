import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const VoiceContext = createContext();

// Language code mapping for browser Speech Recognition and TTS
const LANGUAGE_CODES = {
  'en': 'en-US',
  'hi': 'hi-IN',
  'ta': 'ta-IN',
  'te': 'te-IN',
  'kn': 'kn-IN',
  'ml': 'ml-IN',
  'mr': 'mr-IN',
  'bn': 'bn-IN',
  'gu': 'gu-IN',
  'pa': 'pa-IN'
};

// Get browser-compatible language code
const getBrowserLangCode = (langCode) => {
  return LANGUAGE_CODES[langCode] || 'en-US';
};

export const VoiceProvider = ({ children }) => {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isBlindMode, setIsBlindMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [focusedElement, setFocusedElement] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en'); // Default to English
  const [isVoicePaused, setIsVoicePaused] = useState(false); // Track if voice recognition is paused
  
  const recognitionRef = useRef(null);
  const utteranceQueueRef = useRef([]);
  const isProcessingRef = useRef(false);
  
  // Log available voices on mount (for debugging) - but only once
  useEffect(() => {
    let hasLogged = false;
    const logVoices = () => {
      if (hasLogged) return;
      hasLogged = true;
      
      const voices = window.speechSynthesis.getVoices();
      console.log(`🔊 Available TTS voices: ${voices.length}`);
      
      // Group voices by language
      const voiceGroups = {};
      voices.forEach(v => {
        const lang = v.lang.split('-')[0];
        if (!voiceGroups[lang]) voiceGroups[lang] = [];
        voiceGroups[lang].push(v);
      });
      
      // Show supported languages
      const supportedLangs = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa'];
      const availableLangs = supportedLangs.filter(lang => voiceGroups[lang] && voiceGroups[lang].length > 0);
      
      if (availableLangs.length > 0) {
        console.log(`✅ Voices available for: ${availableLangs.join(', ')}`);
        availableLangs.forEach(lang => {
          console.log(`   ${lang}: ${voiceGroups[lang].map(v => v.name).join(', ')}`);
        });
      }
      
      const missingLangs = supportedLangs.filter(lang => !availableLangs.includes(lang));
      if (missingLangs.length > 0) {
        console.warn(`⚠️ No voices found for: ${missingLangs.join(', ')}`);
        console.log('💡 Tip: Install language packs in your OS for better TTS support.');
      }
    };
    
    // Log voices when they're loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = logVoices;
    }
    // Also log immediately if voices are already loaded
    setTimeout(logVoices, 100);
  }, []);

  // Initialize continuous voice recognition
  useEffect(() => {
    if (isVoiceEnabled && 'webkitSpeechRecognition' in window) {
      // If paused, set up a minimal listener that only responds to "start"
      if (isVoicePaused) {
        const minimalRecognition = new window.webkitSpeechRecognition();
        minimalRecognition.continuous = true;
        minimalRecognition.interimResults = false;
        minimalRecognition.lang = getBrowserLangCode(currentLanguage);

        minimalRecognition.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
          console.log('Paused mode - Voice command:', transcript);
          // Only respond to "start" command when paused
          if (transcript.includes('start') || transcript.includes('start speaking') || transcript.includes('start voice') || transcript.includes('start talking')) {
            setIsVoicePaused(false);
            minimalRecognition.stop();
            // Will restart full recognition in next effect cycle
          }
        };

        minimalRecognition.onend = () => {
          if (isVoicePaused && isVoiceEnabled) {
            // Keep minimal listener running when paused
            setTimeout(() => {
              try {
                minimalRecognition.start();
              } catch (e) {
                console.log('Minimal recognition already started');
              }
            }, 500);
          }
        };

        minimalRecognition.onerror = (event) => {
          if (event.error !== 'no-speech' && isVoicePaused && isVoiceEnabled) {
            setTimeout(() => {
              try {
                minimalRecognition.start();
              } catch (e) {
                console.log('Minimal recognition error restart');
              }
            }, 1000);
          }
        };

        recognitionRef.current = minimalRecognition;
        try {
          minimalRecognition.start();
        } catch (e) {
          console.log('Minimal recognition already started');
        }

        return () => {
          if (minimalRecognition) {
            minimalRecognition.stop();
          }
        };
      } else {
        // Full recognition when not paused
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = getBrowserLangCode(currentLanguage);

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
          // Auto-restart on error only if not paused
          setTimeout(() => {
            if (isVoiceEnabled && !isVoicePaused) {
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
          // Auto-restart continuous listening only if not paused
          if (isVoiceEnabled && !isVoicePaused) {
            setTimeout(() => {
              try {
                recognition.start();
              } catch (e) {
                console.log('Recognition already started');
              }
            }, 200);
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
    }
  }, [isVoiceEnabled, currentLanguage, isVoicePaused]); // Re-initialize when language changes or pause state changes

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
    
    // Speech control commands
    else if (command.includes('stop') || command.includes('stop speaking') || command.includes('stop voice') || command.includes('stop talking') || command.includes('be quiet') || command.includes('silence')) {
      // Stop speaking and pause voice recognition
      stopSpeaking();
      if (recognitionRef.current && isVoiceEnabled) {
        try {
          recognitionRef.current.stop();
          setIsVoicePaused(true);
          setIsListening(false);
          console.log('Voice recognition paused - will only listen for "start" command');
        } catch (e) {
          console.log('Error stopping recognition:', e);
        }
      }
    } else if (command.includes('start') || command.includes('start speaking') || command.includes('start voice') || command.includes('start talking')) {
      // Resume voice recognition
      if (isVoiceEnabled) {
        setIsVoicePaused(false);
        console.log('Voice recognition resuming - full recognition will restart');
        // The useEffect will handle restarting full recognition
        // Small delay before speaking to ensure recognition is active
        setTimeout(() => {
          speak('Voice recognition started. How can I help you?');
        }, 500);
      }
    }
    
    // Reading commands
    else if (command.includes('repeat') || command.includes('say again')) {
      repeatLastMessage();
    }
    
    // Unknown command
    else {
      speak('Command not recognized. Say help for available commands.');
    }
  };

  // Helper function to find and set appropriate voice for language
  const setVoiceForLanguage = (utterance, langCode) => {
    const browserLangCode = getBrowserLangCode(langCode);
    utterance.lang = browserLangCode;
    
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    
    if (voices.length === 0) {
      // Voices might not be loaded yet, wait for them
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        selectVoice(utterance, browserLangCode, updatedVoices);
      };
      return;
    }
    
    selectVoice(utterance, browserLangCode, voices);
  };
  
  // Select the best voice for the language
  const selectVoice = (utterance, browserLangCode, voices) => {
    const langPrefix = browserLangCode.split('-')[0];
    const langName = browserLangCode.split('-')[0];
    
    // Language-specific voice search patterns
    const languagePatterns = {
      'en': ['en', 'english', 'us', 'uk', 'australia'],
      'hi': ['hi', 'hindi', 'hin', 'india'],
      'ta': ['ta', 'tamil', 'tam'],
      'te': ['te', 'telugu', 'tel'],
      'kn': ['kn', 'kannada', 'kan'],
      'ml': ['ml', 'malayalam', 'mal'],
      'mr': ['mr', 'marathi', 'mar'],
      'bn': ['bn', 'bengali', 'ben', 'bangla'],
      'gu': ['gu', 'gujarati', 'guj'],
      'pa': ['pa', 'punjabi', 'pan']
    };
    
    const patterns = languagePatterns[langPrefix] || [langPrefix];
    
    // Strategy 1: Exact language code match
    let voice = voices.find(v => v.lang === browserLangCode);
    
    // Strategy 2: Language code starts with prefix
    if (!voice) {
      voice = voices.find(v => v.lang.startsWith(langPrefix + '-'));
    }
    
    // Strategy 3: Language code contains the prefix
    if (!voice) {
      voice = voices.find(v => v.lang.includes(langPrefix));
    }
    
    // Strategy 4: Voice name contains language keywords
    if (!voice) {
      voice = voices.find(v => {
        const vName = v.name.toLowerCase();
        const vLang = v.lang.toLowerCase();
        return patterns.some(pattern => 
          vName.includes(pattern) || vLang.includes(pattern)
        );
      });
    }
    
    // Strategy 5: For Indian languages, try any Indian voice as fallback
    if (!voice && browserLangCode.includes('-IN')) {
      // Try other Indian languages
      const indianLangs = ['hi', 'ta', 'te', 'kn', 'ml', 'mr', 'bn', 'gu', 'pa'];
      for (const indianLang of indianLangs) {
        voice = voices.find(v => 
          v.lang.includes('-IN') && 
          (v.lang.includes(indianLang) || v.name.toLowerCase().includes(indianLang))
        );
        if (voice) break;
      }
    }
    
    // Strategy 6: Any voice with -IN locale for Indian languages
    if (!voice && browserLangCode.includes('-IN')) {
      voice = voices.find(v => v.lang.includes('-IN'));
    }
    
    // Set the voice if found
    if (voice) {
      utterance.voice = voice;
      console.log(`🔊 Voice selected: ${voice.name} (${voice.lang}) for ${browserLangCode}`);
      return true;
    } else {
      console.warn(`⚠️ No voice found for ${browserLangCode}, using browser default`);
      return false;
    }
  };

  // Text-to-Speech with queue management
  const speak = (text, priority = false, onEnd = null, language = null) => {
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Set language and voice
    const langCode = language || currentLanguage;
    setVoiceForLanguage(utterance, langCode);

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
      // Resume recognition after speaking (faster resume)
      if (isVoiceEnabled && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.log('Recognition already started');
          }
        }, 200); // Reduced from 500ms to 200ms for faster resume
      }
      }
      
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      // Handle different error types
      const errorType = e.error;
      
      // "interrupted" and "canceled" are not real errors - they happen when speech is stopped
      if (errorType === 'interrupted' || errorType === 'canceled') {
        // These are expected when speech is cancelled, don't log as error
        setIsSpeaking(false);
        isProcessingRef.current = false;
        // Remove from queue if it was interrupted
        const index = utteranceQueueRef.current.indexOf(utterance);
        if (index > -1) {
          utteranceQueueRef.current.splice(index, 1);
        }
        return;
      }
      
      // Log other errors but don't spam console
      if (errorType !== 'network' && errorType !== 'synthesis-failed') {
        console.warn('Speech synthesis warning:', errorType);
      } else {
        console.error('Speech error:', errorType);
      }
      
      setIsSpeaking(false);
      isProcessingRef.current = false;
      
      // Try to continue with next in queue
      utteranceQueueRef.current.shift();
      if (utteranceQueueRef.current.length > 0) {
        window.speechSynthesis.speak(utteranceQueueRef.current[0]);
      }
    };

    // Ensure voices are loaded before speaking
    const speakUtterance = () => {
      // Re-select voice in case voices loaded after utterance creation
      if (utterance.voice === null) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          selectVoice(utterance, getBrowserLangCode(langCode), voices);
        }
      }
      
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
    };
    
    // Check if voices are loaded
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      speakUtterance();
    } else {
      // Wait for voices to load
      const onVoicesChanged = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        speakUtterance();
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      // Fallback: speak anyway after short delay
      setTimeout(() => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
        speakUtterance();
      }, 100);
    }

    // Store last message for repeat
    localStorage.setItem('lastSpokenMessage', text);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    utteranceQueueRef.current = [];
    setIsSpeaking(false);
    isProcessingRef.current = false;
    
    // Resume recognition (faster resume)
    if (isVoiceEnabled && recognitionRef.current) {
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log('Recognition already started');
        }
      }, 200); // Reduced from 500ms to 200ms for faster resume
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

  // Listen for specific callback - OPTIMIZED for fast response
  const startListening = (callback, language = null) => {
    if (!('webkitSpeechRecognition' in window)) {
      speak('Speech recognition not supported. Please use Chrome or Edge browser.', true, null, language || currentLanguage);
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true; // Enable interim results for faster feedback
    recognition.maxAlternatives = 1; // Only get best result
    // Use provided language or current language
    recognition.lang = getBrowserLangCode(language || currentLanguage);

    let finalTranscript = '';
    let interimTranscript = '';

    recognition.onstart = () => {
      setIsListening(true);
      console.log('🎤 Listening...');
    };

    recognition.onresult = (event) => {
      // Process interim and final results
      interimTranscript = '';
      finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      // If we have a final result, process it immediately
      if (finalTranscript.trim()) {
        console.log('✅ Voice input received:', finalTranscript);
        setIsListening(false);
        recognition.stop(); // Stop immediately after getting result
        callback(finalTranscript.trim());
      } else if (interimTranscript.trim()) {
        // Show interim results for faster feedback (optional - can be used for UI feedback)
        console.log('🎤 Listening...', interimTranscript);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      // If we didn't get a final result but have interim, use it
      if (!finalTranscript && interimTranscript.trim()) {
        console.log('✅ Using interim result:', interimTranscript);
        callback(interimTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.error('Speech recognition error:', event.error);
        const errorMessages = {
          'en': 'Could not understand. Please try again.',
          'hi': 'समझ नहीं आया। कृपया पुनः प्रयास करें।',
          'ta': 'புரியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.',
          'te': 'అర్థం కాలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
          'kn': 'ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
          'ml': 'മനസ്സിലായില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
          'mr': 'समजले नाही. कृपया पुन्हा प्रयत्न करा.',
          'bn': 'বুঝতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।',
          'gu': 'સમજાયું નહીં. કૃપા કરીને ફરી પ્રયાસ કરો.',
          'pa': 'ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
        };
        const lang = language || currentLanguage;
        speak(errorMessages[lang] || errorMessages['en'], true, null, lang);
      }
      setIsListening(false);
    };

    // Stop continuous recognition temporarily
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors
      }
    }

    // Start immediately without delay
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
      setCurrentPage,
      currentLanguage,
      setCurrentLanguage // Expose language setter
    }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => useContext(VoiceContext);