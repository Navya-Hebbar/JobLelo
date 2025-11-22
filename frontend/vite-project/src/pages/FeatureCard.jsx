import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from './VoiceContext';

const FeatureCard = ({ icon: Icon, title, description, color, href }) => {
  const { speak } = useVoice();
  const navigate = useNavigate();

  const handleClick = () => {
      navigate(href);
  }

  return (
    <div
      className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
      onClick={handleClick}
      onMouseEnter={() => speak(title)}
      role="button"
      tabIndex={0}
    >
      <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
        <Icon className="text-white" size={32} />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed mb-4">
        {description}
      </p>
      
      <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
        Explore <ChevronRight className="group-hover:translate-x-1 transition" size={20} />
      </div>
    </div>
  );
};

export default FeatureCard;