import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Mic, Zap, MessageSquare, Globe, ChevronDown, Square } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { api } from '../services/api';
import { useVoice } from '../context/VoiceContext';

// Utility function to handle basic formatting including bolding and line breaks.
const formatTextWithMarkdown = (text) => {
    if (!text) return text;

    // 1. Handle bolding: **text** -> <strong>text</strong>
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
        // If the part is bolded text (starts and ends with **), render it as <strong>
        if (part.startsWith('**') && part.endsWith('**')) {
            // Remove the ** characters and render as bold
            return <strong key={index} className="font-extrabold">{part.slice(2, -2)}</strong>;
        }

        // 2. Handle line breaks for all other text
        // Split by double newline (paragraph) first, then by single newline (line break)
        return part.split('\n\n').map((paragraph, pIndex) => (
            <React.Fragment key={`${index}-${pIndex}`}>
                {paragraph.split('\n').map((line, lIndex) => (
                    <React.Fragment key={`${index}-${pIndex}-${lIndex}`}>
                        {line}
                        {lIndex < paragraph.split('\n').length - 1 && <br />}
                    </React.Fragment>
                ))}
                {/* Add a vertical space for paragraph separation */}
                {pIndex < part.split('\n\n').length - 1 && <p key={`p-spacer-${index}-${pIndex}`} className="h-4" />}
            </React.Fragment>
        ));
    });
};


// Custom Style Classes for Glassmorphism
const GLASS_BG = 'bg-white/5 backdrop-blur-3xl border border-blue-400/20 shadow-xl';
const DARK_GRADIENT_BG = 'bg-gradient-to-br from-gray-900 to-indigo-900';
const PRIMARY_GRADIENT = 'from-blue-500 to-purple-600';


// Get initial greeting based on language (defined outside component)
const getInitialGreeting = (lang) => {
  const greetings = {
    'en': 'Hello! I am **Joblelo AI**, your career assistant. I can help you with **interview preparation**, **resume tips**, career advice, and job search strategies. What would you like help with today?',
    'hi': 'नमस्ते! मैं **Joblelo AI** हूं, आपका करियर सहायक। मैं आपकी **इंटरव्यू तैयारी**, **रिज्यूमे टिप्स**, करियर सलाह और नौकरी खोज रणनीतियों में मदद कर सकता हूं। आज आपको किस चीज में मदद चाहिए?',
    'ta': 'வணக்கம்! நான் **Joblelo AI**, உங்கள் தொழில் உதவியாளர். **நேர்காணல் தயாரிப்பு**, **ரெசுமே குறிப்புகள்**, தொழில் ஆலோசனை மற்றும் வேலை தேடல் உத்திகளில் உங்களுக்கு உதவ முடியும். இன்று உங்களுக்கு என்ன உதவி தேவை?',
    'te': 'నమస్కారం! నేను **Joblelo AI**, మీ కెరీర్ అసిస్టెంట్. **ఇంటర్వ్యూ తయారీ**, **రెజ్యూమ్ చిట్కాలు**, కెరీర్ సలహా మరియు ఉద్యోగ శోధన వ్యూహాలలో నేను మీకు సహాయం చేయగలను. ఈరోజు మీకు ఏమి సహాయం కావాలి?',
    'kn': 'ನಮಸ್ಕಾರ! ನಾನು **Joblelo AI**, ನಿಮ್ಮ ವೃತ್ತಿ ಸಹಾಯಕ. **ಸಂದರ್ಶನ ತಯಾರಿ**, **ರೆಸ್ಯೂಮ್ ಸಲಹೆಗಳು**, ವೃತ್ತಿ ಸಲಹೆ ಮತ್ತು ಉದ್ಯೋಗ ಹುಡುಕಾಟ ತಂತ್ರಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ಇಂದು ನಿಮಗೆ ಏನು ಸಹಾಯ ಬೇಕು?',
    'ml': 'ഹലോ! ഞാൻ **Joblelo AI**, നിങ്ങളുടെ കരിയർ അസിസ്റ്റന്റ്. **ഇന്റർവ്യൂ തയ്യാറെടുപ്പ്**, **റെസ്യൂം ടിപ്പുകൾ**, കരിയർ ഉപദേശം, ജോലി തിരയൽ തന്ത്രങ്ങൾ എന്നിവയിൽ ഞാൻ നിങ്ങളെ സഹായിക്കാം. ഇന്ന് നിങ്ങൾക്ക് എന്ത് സഹായം വേണം?',
    'mr': 'नमस्कार! मी **Joblelo AI** आहे, तुमचा करिअर सहाय्यक. **मुलाखत तयारी**, **रिज्यूम टिप्स**, करिअर सल्ला आणि नोकरी शोधण्याच्या रणनीतींमध्ये मी तुम्हाला मदत करू शकतो. आज तुम्हाला कशाची मदत हवी आहे?',
    'bn': 'হ্যালো! আমি **Joblelo AI**, আপনার ক্যারিয়ার সহায়ক। **ইন্টারভিউ প্রস্তুতি**, **রিজিউম টিপস**, ক্যারিয়ার পরামর্শ এবং চাকরি খোঁজার কৌশলে আমি আপনাকে সাহায্য করতে পারি। আজ আপনি কী সাহায্য চান?',
    'gu': 'નમસ્તે! હું **Joblelo AI** છું, તમારો કારકિર્દી સહાયક. **ઇન્ટરવ્યૂ તૈયારી**, **રેઝ્યુમ ટિપ્સ**, કારકિર્દી સલાહ અને નોકરી શોધ વ્યૂહરચનામાં હું તમને મદદ કરી શકું છું. આજે તમને શું મદદ જોઈએ છે?',
    'pa': 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ **Joblelo AI** ਹਾਂ, ਤੁਹਾਡਾ ਕੈਰੀਅਰ ਸਹਾਇਕ। **ਇੰਟਰਵਿਊ ਤਿਆਰੀ**, **ਰਿਜ਼ਿਊਮ ਸੁਝਾਅ**, ਕੈਰੀਅਰ ਸਲਾਹ ਅਤੇ ਨੌਕਰੀ ਖੋਜ ਰਣਨੀਤੀਆਂ ਵਿੱਚ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਤੁਹਾਨੂੰ ਕੀ ਮਦਦ ਚਾਹੀਦੀ ਹੈ?'
  };
  return greetings[lang] || greetings['en'];
};

const ChatAssistant = () => {
  const { speak, isVoiceEnabled, startListening, isListening, isSpeaking, setCurrentLanguage, stopSpeaking } = useVoice();
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: getInitialGreeting('en')
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [languages, setLanguages] = useState([]);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Load supported languages on mount
  useEffect(() => {
    const loadLanguages = async () => {
      try {
        const response = await api.getSupportedLanguages();
        if (response.success && response.languages) {
          setLanguages(response.languages);
        }
      } catch (error) {
        console.error('Failed to load languages:', error);
        // Fallback languages
        setLanguages([
          { code: 'en', name: 'English' },
          { code: 'hi', name: 'हिंदी (Hindi)' },
          { code: 'ta', name: 'தமிழ் (Tamil)' },
          { code: 'te', name: 'తెలుగు (Telugu)' },
          { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
          { code: 'ml', name: 'മലയാളം (Malayalam)' },
          { code: 'mr', name: 'मराठी (Marathi)' },
          { code: 'bn', name: 'বাংলা (Bengali)' },
          { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
          { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
        ]);
      }
    };
    loadLanguages();
  }, []);

  // Update initial message and voice language when language changes
  useEffect(() => {
    // Update VoiceContext language
    if (setCurrentLanguage) {
      setCurrentLanguage(selectedLanguage);
    }
    
    // Update initial greeting if it's the first message
    if (messages.length === 1 && messages[0].type === 'bot') {
      const newGreeting = getInitialGreeting(selectedLanguage);
      setMessages([{
        id: 1,
        type: 'bot',
        text: newGreeting
      }]);
    }
  }, [selectedLanguage, setCurrentLanguage]);

  // Initial introduction when component mounts (only once)
  useEffect(() => {
    const announcements = {
      'en': 'Welcome to Joblelo AI Career Assistant. I can help you with interview preparation, resume tips, career advice, and job search strategies. How can I assist you today?',
      'hi': 'Joblelo AI करियर असिस्टेंट में आपका स्वागत है। मैं आपकी इंटरव्यू तैयारी, रिज्यूमे टिप्स, करियर सलाह और नौकरी खोज रणनीतियों में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?',
      'ta': 'Joblelo AI தொழில் உதவியாளருக்கு வரவேற்கிறோம். நேர்காணல் தயாரிப்பு, ரெசுமே குறிப்புகள், தொழில் ஆலோசனை மற்றும் வேலை தேடல் உத்திகளில் நான் உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?',
      'te': 'Joblelo AI కెరీర్ అసిస్టెంట్‌కు స్వాగతం. ఇంటర్వ్యూ తయారీ, రెజ్యూమ్ చిట్కాలు, కెరీర్ సలహా మరియు ఉద్యోగ శోధన వ్యూహాలలో నేను మీకు సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?',
      'kn': 'Joblelo AI ಕೆರೀರ್ ಅಸಿಸ್ಟೆಂಟ್‌ಗೆ ಸ್ವಾಗತ. ಸಂದರ್ಶನ ತಯಾರಿ, ರೆಸ್ಯೂಮ್ ಸಲಹೆಗಳು, ವೃತ್ತಿ ಸಲಹೆ ಮತ್ತು ಉದ್ಯೋಗ ಹುಡುಕಾಟ ತಂತ್ರಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?',
      'ml': 'Joblelo AI കരിയർ അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം. ഇന്റർവ്യൂ തയ്യാറെടുപ്പ്, റെസ്യൂം ടിപ്പുകൾ, കരിയർ ഉപദേശം, ജോലി തിരയൽ തന്ത്രങ്ങൾ എന്നിവയിൽ ഞാൻ നിങ്ങളെ സഹായിക്കാം. ഇന്ന് ഞാൻ നിങ്ങൾക്ക് എങ്ങനെ സഹായിക്കാം?',
      'mr': 'Joblelo AI करिअर असिस्टंटमध्ये आपले स्वागत आहे. मुलाखत तयारी, रिज्यूम टिप्स, करिअर सल्ला आणि नोकरी शोधण्याच्या रणनीतींमध्ये मी तुम्हाला मदत करू शकतो. आज मी तुम्हाला कशी मदत करू शकतो?',
      'bn': 'Joblelo AI ক্যারিয়ার অ্যাসিস্ট্যান্টে স্বাগতম। ইন্টারভিউ প্রস্তুতি, রিজিউম টিপস, ক্যারিয়ার পরামর্শ এবং চাকরি খোঁজার কৌশলে আমি আপনাকে সাহায্য করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?',
      'gu': 'Joblelo AI કારકિર્દી અસિસ્ટન્ટમાં આપનું સ્વાગત છે. ઇન્ટરવ્યૂ તૈયારી, રેઝ્યૂમ ટિપ્સ, કારકિર્દી સલાહ અને નોકરી શોધ વ્યૂહરચનામાં હું તમને મદદ કરી શકું છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?',
      'pa': 'Joblelo AI ਕੈਰੀਅਰ ਅਸਿਸਟੈਂਟ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਇੰਟਰਵਿਊ ਤਿਆਰੀ, ਰਿਜ਼ਿਊਮ ਸੁਝਾਅ, ਕੈਰੀਅਰ ਸਲਾਹ ਅਤੇ ਨੌਕਰੀ ਖੋਜ ਰਣਨੀਤੀਆਂ ਵਿੱਚ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?'
    };
    const announcement = announcements[selectedLanguage] || announcements['en'];
    speak(announcement, true, null, selectedLanguage);
  }, []); // Only run on mount

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handlePageCommands = (e) => {
      if (!isVoiceEnabled) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleVoiceMessage();
      }
    };
    window.addEventListener('keydown', handlePageCommands);
    return () => window.removeEventListener('keydown', handlePageCommands);
  }, [isVoiceEnabled, messages]);

  const handleVoiceMessage = () => {
    // Start listening immediately without waiting for speech
    startListening((transcript) => {
      // Process the transcript immediately
      console.log('📝 Processing voice input:', transcript);
      
      // Send message immediately without confirmation speech
      handleSendMessage(transcript);
    }, selectedLanguage);
    
    // Optional: Quick visual/audio feedback (non-blocking)
    const listeningMessages = {
      'en': 'Listening',
      'hi': 'सुन रहा हूं',
      'ta': 'கேட்டுக்கொண்டிருக்கிறேன்',
      'te': 'వినుతున్నాను',
      'kn': 'ಕೇಳುತ್ತಿದ್ದೇನೆ',
      'ml': 'കേൾക്കുന്നു',
      'mr': 'ऐकत आहे',
      'bn': 'শুনছি',
      'gu': 'સાંભળી રહ્યો છું',
      'pa': 'ਸੁਣ ਰਿਹਾ ਹਾਂ'
    };
    const listeningMsg = listeningMessages[selectedLanguage] || listeningMessages['en'];
    
    // Quick non-blocking feedback
    speak(listeningMsg, false, null, selectedLanguage);
  };

  const handleSendMessage = async (text) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // IMMEDIATELY stop any ongoing speech when user sends a new message
    stopSpeaking(); // Stop current speech and clear queue
    
    const newMessage = { 
      id: Date.now(), 
      type: 'user', 
      text: messageText 
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      // Format messages for backend: [{role: 'user', content: '...'}, ...]
      const apiMessages = [...messages, newMessage].map(msg => ({
        role: msg.type === 'bot' ? 'assistant' : 'user',
        content: msg.text
      }));

      const response = await api.chatWithAI(apiMessages, selectedLanguage);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'bot',
        // Assume API response text might include **markdown**
        text: response.message 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak response immediately (ensure speech queue is clear first)
      // Use priority to cancel any remaining old speech
      setTimeout(() => {
        // Clean the markdown before speaking - use selected language for TTS
        // Use priority=true to ensure this new response is spoken immediately
        speak(response.message.replace(/\*\*/g, ''), true, null, selectedLanguage);
      }, 50); // Very short delay to ensure message is processed
      
    } catch (error) {
      console.error("Chat error:", error);
      
      // Don't set error state if it's an auth redirect (that's handled by api.js)
      if (error.message && error.message.includes('Session expired')) {
        // Auth error - will redirect, don't show error message
        return;
      }
      
      // Show user-friendly error message
      const errorText = error.message || 'Sorry, I encountered an error. Please try again.';
      setError(errorText);
      
      // Create more helpful error message
      let errorMessageText = 'Sorry, I encountered an error. Please try again.';
      
      if (errorText.includes('API key') || errorText.includes('GEMINI_API_KEY')) {
        errorMessageText = '⚠️ **Gemini API Key Issue**\n\nPlease check your backend `.env` file:\n1. Create `.env` in `backend/src/` directory\n2. Add: `GEMINI_API_KEY=your_api_key_here`\n3. Get your key from: https://makersuite.google.com/app/apikey\n4. Restart your backend server';
      } else if (errorText.includes('configured') || errorText.includes('not configured')) {
        errorMessageText = '⚠️ AI service is not configured. Please check server configuration.';
      }
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: errorMessageText
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      const errorMessages = {
        'en': 'Error: Could not get response.',
        'hi': 'त्रुटि: प्रतिक्रिया प्राप्त नहीं हो सकी।',
        'ta': 'பிழை: பதிலைப் பெற முடியவில்லை.',
        'te': 'దోషం: స్పందన పొందలేకపోయాము.',
        'kn': 'ದೋಷ: ಪ್ರತಿಕ್ರಿಯೆಯನ್ನು ಪಡೆಯಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ.',
        'ml': 'പിശക്: പ്രതികരണം ലഭിക്കാനായില്ല.',
        'mr': 'त्रुटी: प्रतिसाद मिळू शकला नाही.',
        'bn': 'ত্রুটি: প্রতিক্রিয়া পাওয়া যায়নি।',
        'gu': 'ભૂલ: પ્રતિસાદ મેળવી શકાયો નહીં.',
        'pa': 'ਗਲਤੀ: ਜਵਾਬ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੋ ਸਕਿਆ।'
      };
      speak(errorMessages[selectedLanguage] || errorMessages['en'], false, null, selectedLanguage);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    // Full-screen dark container for the chat interface
    <div className={`h-screen flex flex-col justify-center items-center p-4 ${DARK_GRADIENT_BG}`}>
      
      {/* Chat Container - Glassmorphic */}
      <div className={`flex flex-col h-full max-h-[850px] w-full max-w-5xl ${GLASS_BG} rounded-3xl overflow-hidden`}>
        
        {/* Header - Vibrant Gradient */}
        <div className={`p-6 border-b border-white/20 bg-gradient-to-r ${PRIMARY_GRADIENT} text-white rounded-t-3xl shadow-lg`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-extrabold flex items-center gap-3">
                <MessageSquare size={28} className="text-yellow-300 animate-pulse" /> AI Career Assistant
              </h1>
              <p className="text-sm opacity-90 mt-1 italic">
                Your personalized guide to career success.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Language Selector */}
              <div className="relative" ref={languageDropdownRef}>
                <button
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 hover:bg-white/30 transition-all"
                >
                  <Globe size={18} />
                  <span className="text-xs font-bold">
                    {languages.find(l => l.code === selectedLanguage)?.name || 'English'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto min-w-[200px]">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          // Clear console when language changes
                          console.clear();
                          console.log(`🌐 Language changed to: ${lang.name} (${lang.code})`);
                          
                          // Update language
                          setSelectedLanguage(lang.code);
                          setShowLanguageDropdown(false);
                          
                          // Provide proper introduction in the selected language
                          const introductions = {
                            'en': `Language changed to ${lang.name}. Welcome to Joblelo AI Career Assistant. I can help you with interview preparation, resume tips, career advice, and job search strategies. How can I assist you today?`,
                            'hi': `भाषा बदली गई: ${lang.name}. Joblelo AI करियर असिस्टेंट में आपका स्वागत है। मैं आपकी इंटरव्यू तैयारी, रिज्यूमे टिप्स, करियर सलाह और नौकरी खोज रणनीतियों में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?`,
                            'ta': `மொழி மாற்றப்பட்டது: ${lang.name}. Joblelo AI தொழில் உதவியாளருக்கு வரவேற்கிறோம். நேர்காணல் தயாரிப்பு, ரெசுமே குறிப்புகள், தொழில் ஆலோசனை மற்றும் வேலை தேடல் உத்திகளில் நான் உங்களுக்கு உதவ முடியும். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?`,
                            'te': `భాష మార్చబడింది: ${lang.name}. Joblelo AI కెరీర్ అసిస్టెంట్‌కు స్వాగతం. ఇంటర్వ్యూ తయారీ, రెజ్యూమ్ చిట్కాలు, కెరీర్ సలహా మరియు ఉద్యోగ శోధన వ్యూహాలలో నేను మీకు సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?`,
                            'kn': `ಭಾಷೆ ಬದಲಾಯಿತು: ${lang.name}. Joblelo AI ಕೆರೀರ್ ಅಸಿಸ್ಟೆಂಟ್‌ಗೆ ಸ್ವಾಗತ. ಸಂದರ್ಶನ ತಯಾರಿ, ರೆಸ್ಯೂಮ್ ಸಲಹೆಗಳು, ವೃತ್ತಿ ಸಲಹೆ ಮತ್ತು ಉದ್ಯೋಗ ಹುಡುಕಾಟ ತಂತ್ರಗಳಲ್ಲಿ ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಹುದು. ಇಂದು ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?`,
                            'ml': `ഭാഷ മാറ്റി: ${lang.name}. Joblelo AI കരിയർ അസിസ്റ്റന്റിലേക്ക് സ്വാഗതം. ഇന്റർവ്യൂ തയ്യാറെടുപ്പ്, റെസ്യൂം ടിപ്പുകൾ, കരിയർ ഉപദേശം, ജോലി തിരയൽ തന്ത്രങ്ങൾ എന്നിവയിൽ ഞാൻ നിങ്ങളെ സഹായിക്കാം. ഇന്ന് ഞാൻ നിങ്ങൾക്ക് എങ്ങനെ സഹായിക്കാം?`,
                            'mr': `भाषा बदलली: ${lang.name}. Joblelo AI करिअर असिस्टंटमध्ये आपले स्वागत आहे. मुलाखत तयारी, रिज्यूम टिप्स, करिअर सल्ला आणि नोकरी शोधण्याच्या रणनीतींमध्ये मी तुम्हाला मदत करू शकतो. आज मी तुम्हाला कशी मदत करू शकतो?`,
                            'bn': `ভাষা পরিবর্তন করা হয়েছে: ${lang.name}. Joblelo AI ক্যারিয়ার অ্যাসিস্ট্যান্টে স্বাগতম। ইন্টারভিউ প্রস্তুতি, রিজিউম টিপস, ক্যারিয়ার পরামর্শ এবং চাকরি খোঁজার কৌশলে আমি আপনাকে সাহায্য করতে পারি। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?`,
                            'gu': `ભાષા બદલાઈ: ${lang.name}. Joblelo AI કારકિર્દી અસિસ્ટન્ટમાં આપનું સ્વાગત છે. ઇન્ટરવ્યૂ તૈયારી, રેઝ્યૂમ ટિપ્સ, કારકિર્દી સલાહ અને નોકરી શોધ વ્યૂહરચનામાં હું તમને મદદ કરી શકું છું. આજે હું તમને કેવી રીતે મદદ કરી શકું?`,
                            'pa': `ਭਾਸ਼ਾ ਬਦਲੀ: ${lang.name}. Joblelo AI ਕੈਰੀਅਰ ਅਸਿਸਟੈਂਟ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ। ਇੰਟਰਵਿਊ ਤਿਆਰੀ, ਰਿਜ਼ਿਊਮ ਸੁਝਾਅ, ਕੈਰੀਅਰ ਸਲਾਹ ਅਤੇ ਨੌਕਰੀ ਖੋਜ ਰਣਨੀਤੀਆਂ ਵਿੱਚ ਮੈਂ ਤੁਹਾਡੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`
                          };
                          
                          // Speak introduction in the new language
                          const introduction = introductions[lang.code] || introductions['en'];
                          speak(introduction, true, null, lang.code);
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors ${
                          selectedLanguage === lang.code ? 'bg-blue-600/30 border-l-4 border-blue-400' : ''
                        }`}
                      >
                        <span className="text-sm text-white">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Stop Speaking Button - Shows when AI is speaking */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-2 bg-red-600/90 backdrop-blur-sm px-4 py-2 rounded-full border border-red-400/50 hover:bg-red-700 transition-all shadow-lg animate-pulse"
                  title="Stop AI Speaking"
                >
                  <Square size={18} className="text-white fill-white" />
                  <span className="text-xs text-white font-bold">Stop</span>
                </button>
              )}

              {isVoiceEnabled && (
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                  <Mic className="text-cyan-300 animate-pulse-slow" size={20} />
                  <span className="text-xs text-white font-bold">Voice Active (M)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border-l-4 border-red-500 p-3 text-red-300 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Chat Messages Area - Dark and scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black/10">
          {messages.map((msg) => (
            // Crucial change: Pass the formatted text using the new function
            <ChatBubble 
              key={msg.id} 
              message={{ ...msg, text: formatTextWithMarkdown(msg.text) }} 
            />
          ))}
          {isLoading && (
            <div className="flex items-center gap-3 text-white/70 ml-4">
              <Loader2 className="animate-spin text-cyan-400" size={24} />
              <span className="text-lg italic font-light">AI is calculating the perfect response...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Glassmorphic Bottom */}
        <div className={`p-5 border-t border-white/20 bg-black/20 backdrop-blur-sm rounded-b-3xl`}>
          <div className="flex items-end gap-4 w-full">
            
            {/* Voice Button */}
            <button
              onClick={() => handleVoiceMessage()}
              disabled={isLoading || isListening}
              className={`p-4 rounded-full transition-all flex-shrink-0 shadow-lg ${
                isListening ? 'bg-red-600 text-white shadow-red-500/50 animate-ping-once' : 'bg-blue-600 text-white hover:bg-blue-700'
              } disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105`}
              title="Voice Input (Press M)"
            >
              <Mic size={24} />
            </button>
            
            {/* Textarea */}
            <textarea
              id="chat-input"
              ref={inputRef}
              className={`flex-1 border-2 border-blue-400/50 p-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/50 resize-none ${DARK_GRADIENT_BG} text-white placeholder-gray-400 transition-all duration-300`}
              placeholder={
                {
                  'en': "Ask me anything about your career (Shift + Enter for new line)",
                  'hi': "अपने करियर के बारे में कुछ भी पूछें (नई लाइन के लिए Shift + Enter)",
                  'ta': "உங்கள் தொழில் பற்றி எதையும் கேளுங்கள் (புதிய வரிக்கு Shift + Enter)",
                  'te': "మీ కెరీర్ గురించి ఏదైనా అడగండి (కొత్త పంక్తికి Shift + Enter)",
                  'kn': "ನಿಮ್ಮ ವೃತ್ತಿಯ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ (ಹೊಸ ಸಾಲಿಗೆ Shift + Enter)",
                  'ml': "നിങ്ങളുടെ കരിയറിനെക്കുറിച്ച് എന്തും ചോദിക്കുക (പുതിയ വരിക്ക് Shift + Enter)",
                  'mr': "तुमच्या कारकिर्दीबद्दल काहीही विचारा (नवीन ओळीसाठी Shift + Enter)",
                  'bn': "আপনার ক্যারিয়ার সম্পর্কে কিছু জিজ্ঞাসা করুন (নতুন লাইনের জন্য Shift + Enter)",
                  'gu': "તમારી કારકિર્દી વિશે કંઈપણ પૂછો (નવી લાઇન માટે Shift + Enter)",
                  'pa': "ਆਪਣੇ ਕੈਰੀਅਰ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ (ਨਵੀਂ ਲਾਈਨ ਲਈ Shift + Enter)"
                }[selectedLanguage] || "Ask me anything about your career (Shift + Enter for new line)"
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={inputText.split('\n').length < 6 ? Math.min(6, Math.max(1, inputText.split('\n').length)) : 6}
              disabled={isLoading}
            />
            
            {/* Send Button */}
            <button 
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-cyan-500 hover:to-blue-700 transition-all shadow-xl disabled:opacity-30 flex items-center gap-2 transform hover:scale-105"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              <span className="hidden sm:inline">Send</span>
            </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;