import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Mic, Zap, MessageSquare } from 'lucide-react';
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


const ChatAssistant = () => {
  const { speak, isVoiceEnabled, startListening, isListening } = useVoice();
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Hello! I am **Joblelo AI**, your career assistant. I can help you with **interview preparation**, **resume tips**, career advice, and job search strategies. What would you like help with today?' 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const announcement = `You are now in the AI Chat Assistant.`;
    speak(announcement, true);
    setTimeout(() => {
      // We speak the original unformatted text
      speak(messages[0].text.replace(/\*\*/g, ''));
    }, 3000);
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
    speak('Listening.', true, () => {
      startListening((transcript) => {
        speak(`Sending: ${transcript}`);
        handleSendMessage(transcript);
      });
    });
  };

  const handleSendMessage = async (text) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

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

      const response = await api.chatWithAI(apiMessages);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'bot',
        // Assume API response text might include **markdown**
        text: response.message 
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      setTimeout(() => {
        // Clean the markdown before speaking
        speak(response.message.replace(/\*\*/g, ''));
      }, 500);
      
    } catch (error) {
      console.error("Chat error:", error);
      setError(error.message);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        text: 'Sorry, I encountered an error. Please try again.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      speak('Error: Could not get response.');
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
            {isVoiceEnabled && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Mic className="text-cyan-300 animate-pulse-slow" size={20} />
                <span className="text-xs text-white font-bold">Voice Active (M)</span>
              </div>
            )}
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
              placeholder="Ask me anything about your career (Shift + Enter for new line)"
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