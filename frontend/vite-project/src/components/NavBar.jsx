import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, Home, MessageSquare, FileText, Brain, Briefcase as Jobs } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';

const NavBar = () => {
  const { speak, isVoiceEnabled } = useVoice();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const navItems = [
    { name: 'Home', href: '/', icon: Home, description: 'Go to home page' },
    { name: 'AI Assistant', href: '/chat', icon: MessageSquare, description: 'Open AI chat assistant for career advice' },
    { name: 'Resume Builder', href: '/resume', icon: FileText, description: 'Build your resume with voice input' },
    { name: 'Skill Test', href: '/test', icon: Brain, description: 'Take skill assessments' },
    { name: 'Jobs', href: '/jobs', icon: Jobs, description: 'Find job recommendations' },
  ];

  // Announce current page on mount
  useEffect(() => {
    const currentItem = navItems.find(item => item.href === location.pathname);
    if (currentItem && isVoiceEnabled) {
      setTimeout(() => {
        speak(`You are on ${currentItem.name} page. Press H for navigation help.`);
      }, 1000);
    }
  }, [location.pathname]);

  // Keyboard navigation for navbar
  useEffect(() => {
    const handleNavKeys = (e) => {
      if (!isVoiceEnabled) return;

      // Numbers 1-5 for quick navigation
      const numKey = parseInt(e.key);
      if (numKey >= 1 && numKey <= navItems.length) {
        e.preventDefault();
        const item = navItems[numKey - 1];
        handleNavClick(item.name, item.href);
      }

      // Arrow keys for navigation
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const nextIndex = (focusedIndex + 1) % navItems.length;
        setFocusedIndex(nextIndex);
        speak(navItems[nextIndex].name);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const prevIndex = focusedIndex - 1 < 0 ? navItems.length - 1 : focusedIndex - 1;
        setFocusedIndex(prevIndex);
        speak(navItems[prevIndex].name);
      }
      
      // Enter to navigate
      if (e.key === 'Enter' && document.activeElement.tagName === 'NAV') {
        e.preventDefault();
        const item = navItems[focusedIndex];
        handleNavClick(item.name, item.href);
      }

      // M for menu
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMenu();
      }
    };

    window.addEventListener('keydown', handleNavKeys);
    return () => window.removeEventListener('keydown', handleNavKeys);
  }, [isVoiceEnabled, focusedIndex]);

  const handleNavClick = (name, href) => {
    speak(`Navigating to ${name}`);
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    speak(isMobileMenuOpen ? 'Menu closed' : 'Menu opened. Use arrow keys to navigate.');
  };

  const announceNavigation = () => {
    const announcement = `Navigation menu. ${navItems.length} options available.
    Press numbers 1 through ${navItems.length} to navigate directly.
    Press Left and Right arrow keys to browse options.
    Current page: ${navItems.find(item => item.href === location.pathname)?.name || 'Home'}`;
    speak(announcement, true);
  };

  return (
    <nav 
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl sticky top-0 z-30"
      role="navigation"
      aria-label="Main navigation"
      onFocus={announceNavigation}
      tabIndex={0}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg p-2"
            onClick={() => handleNavClick('Home', '/')}
            onMouseEnter={() => isVoiceEnabled && speak('Joblelo Home')}
            role="button"
            tabIndex={0}
            aria-label="Joblelo Home - Press Enter to go to home page"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <h1 className="text-2xl font-bold">JOBLELO</h1>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-8" role="menubar">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name} role="none">
                  <button
                    onClick={() => handleNavClick(item.name, item.href)}
                    onMouseEnter={() => isVoiceEnabled && speak(item.name)}
                    onFocus={() => {
                      setFocusedIndex(index);
                      isVoiceEnabled && speak(item.description);
                    }}
                    className={`flex items-center gap-2 hover:text-blue-400 transition font-medium px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isActive ? 'text-blue-400 bg-blue-900/30' : ''
                    }`}
                    role="menuitem"
                    aria-label={`${item.name}. Press ${index + 1} as shortcut. ${item.description}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                    <kbd className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                      {index + 1}
                    </kbd>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400 rounded p-2"
            onClick={toggleMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu. Press M as shortcut'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <ul 
            className="md:hidden mt-4 space-y-3 pb-4"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <li key={item.name} role="none">
                  <button
                    onClick={() => handleNavClick(item.name, item.href)}
                    onFocus={() => isVoiceEnabled && speak(item.description)}
                    className={`flex items-center gap-3 w-full text-left hover:text-blue-400 transition py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isActive ? 'text-blue-400 bg-blue-900/30' : ''
                    }`}
                    role="menuitem"
                    aria-label={item.description}
                  >
                    <Icon size={20} />
                    <span className="flex-1">{item.name}</span>
                    <kbd className="text-xs bg-gray-700 px-2 py-1 rounded">
                      {index + 1}
                    </kbd>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Voice Status Indicator */}
      {isVoiceEnabled && (
        <div 
          className="bg-green-600 text-white text-xs py-1 px-4 text-center"
          role="status"
          aria-live="polite"
        >
          🎤 Voice control active • Press numbers 1-{navItems.length} for quick navigation • Press H for help
        </div>
      )}
    </nav>
  );
};

export default NavBar;