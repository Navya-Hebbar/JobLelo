import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';

const Home = () => {
  return (
    <div className="animate-fadeIn">
      <HeroSection />
      <FeaturesSection />
      
      {/* Footer (Local to Home or moved to App global footer) */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            © 2025 Joblelo. Empowering careers with AI and accessibility.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;