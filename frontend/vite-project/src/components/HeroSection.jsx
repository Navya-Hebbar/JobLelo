import React, { useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const HeroSection = () => {
  const { speak } = useVoice();

  useEffect(() => {
    // Optional: Speak welcome message on mount if voice is enabled
    // speak('Welcome to Joblelo, the new standard in career assistance');
  }, [speak]);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute w-96 h-96 bg-blue-500 rounded-full blur-3xl top-0 left-0 animate-pulse"></div>
        <div className="absolute w-96 h-96 bg-purple-500 rounded-full blur-3xl bottom-0 right-0 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative container mx-auto px-6 py-32 text-center">
        <div className="inline-block px-4 py-2 bg-blue-500 bg-opacity-30 border border-blue-400 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm">
          🚀 AI-Powered Career Platform
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          The New Standard in
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            Career Success
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Use AI to Get a 360-Degree View of Your Career Journey
        </p>

        <button
          onClick={() => speak('Learn more about our platform')}
          onMouseEnter={() => speak('Learn more button')}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-xl text-lg font-bold transition transform hover:scale-105 shadow-2xl flex items-center gap-3 mx-auto"
        >
          Learn More
          <ChevronRight className="group-hover:translate-x-1 transition" size={24} />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;