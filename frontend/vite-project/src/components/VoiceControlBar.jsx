import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const VoiceControlBar = () => {
  const { isVoiceEnabled, setIsVoiceEnabled, isListening, isSpeaking, stopSpeaking, speak, startListening } = useVoice();
  const navigate = useNavigate();

  const handleToggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    speak(isVoiceEnabled ? 'Voice assistance disabled' : 'Voice assistance enabled', true);
  };

  const handleVoiceCommand = () => {
    startListening((transcript) => {
      speak(`You said: ${transcript}`, true);
      
      // Handle voice commands
      const text = transcript.toLowerCase();
      if (text.includes('menu')) {
        speak('Opening menu', true);
      } else if (text.includes('home')) {
        navigate('/');
      } else if (text.includes('chat') || text.includes('assistant')) {
        navigate('/chat');
      } else if (text.includes('resume')) {
        navigate('/resume');
      } else if (text.includes('test') || text.includes('skill')) {
        navigate('/test');
      } else if (text.includes('job')) {
        navigate('/jobs');
      }
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3">
      {isVoiceEnabled && (
        <>
          <button
            onClick={handleVoiceCommand}
            disabled={isListening}
            className={`p-4 rounded-full shadow-lg transition ${
              isListening 
                ? 'bg-red-500 animate-pulse' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
            title="Voice Command"
          >
            {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          </button>
          
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg transition"
              title="Stop Speaking"
            >
              <VolumeX size={24} />
            </button>
          )}
        </>
      )}
      
      <button
        onClick={handleToggleVoice}
        className={`p-4 rounded-full shadow-lg transition ${
          isVoiceEnabled 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-600 hover:bg-gray-700'
        } text-white`}
        title={isVoiceEnabled ? 'Disable Voice' : 'Enable Voice'}
      >
        {isVoiceEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>
    </div>
  );
};

export default VoiceControlBar;