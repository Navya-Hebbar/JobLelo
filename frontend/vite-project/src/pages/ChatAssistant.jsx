import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Mic } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { api } from '../services/api';
import { useVoice } from '../context/VoiceContext';

const ChatAssistant = () => {
  const { speak, isVoiceEnabled, startListening, isListening } = useVoice();
  
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      text: 'Hello! I am Joblelo AI, your career assistant. I can help you with interview preparation, resume tips, career advice, and job search strategies. What would you like help with today?' 
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
      speak(messages[0].text);
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
        text: response.message
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      setTimeout(() => {
        speak(response.message);
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
    <div className="flex flex-col h-[calc(100vh-120px)] bg-white rounded-lg shadow-xl max-w-5xl mx-auto">
      <div className="p-5 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">AI Career Assistant</h1>
            <p className="text-sm opacity-90 mt-1">
              Ask about interviews, resumes, or career advice
            </p>
          </div>
          {isVoiceEnabled && (
            <div className="flex items-center gap-2">
              <Mic className="animate-pulse" size={20} />
              <span className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full font-bold">Active</span>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 ml-4">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm italic">AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          <button
            onClick={() => handleVoiceMessage()}
            disabled={isLoading || isListening}
            className={`p-3 rounded-lg transition-all flex-shrink-0 ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
            title="Voice Input (Press M)"
          >
            <Mic size={20} />
          </button>
          
          <textarea
            id="chat-input"
            ref={inputRef}
            className="flex-1 border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
            disabled={isLoading}
          />
          
          <button 
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputText.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            <span className="hidden md:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;