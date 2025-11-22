// frontend/vite-project/src/components/NavBar.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Menu, X, Home, MessageSquare, FileText, Brain, Briefcase as Jobs, User, LogOut } from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { speak, isVoiceEnabled } = useVoice();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const publicNavItems = [
    { name: 'Home', href: '/', icon: Home, description: 'Go to home page' },
  ];

  const protectedNavItems = [
    { name: 'AI Assistant', href: '/chat', icon: MessageSquare, description: 'Open AI chat assistant' },
    { name: 'Resume', href: '/resume', icon: FileText, description: 'Build your resume' },
    { name: 'Skill Test', href: '/test', icon: Brain, description: 'Take skill assessments' },
    { name: 'Jobs', href: '/jobs', icon: Jobs, description: 'Find job matches' },
  ];

  const navItems = isAuthenticated() 
    ? [...publicNavItems, ...protectedNavItems]
    : publicNavItems;

  const handleNavClick = (name, href) => {
    speak(`Navigating to ${name}`);
    navigate(href);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    speak('Logging out');
    logout();
    setShowProfileMenu(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-xl sticky top-0 z-30">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNavClick('Home', '/')}
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase size={24} />
            </div>
            <h1 className="text-2xl font-bold">JOBLELO</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name, item.href)}
                  onMouseEnter={() => isVoiceEnabled && speak(item.name)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                    isActive ? 'text-blue-400 bg-blue-900/30' : 'hover:text-blue-400'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                  <kbd className="ml-1 text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                    {index + 1}
                  </kbd>
                </button>
              );
            })}

            {/* Auth Buttons */}
            {isAuthenticated() ? (
              <div className="relative ml-4">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                >
                  <User size={18} />
                  <span className="text-sm">{user?.email?.split('@')[0] || 'Profile'}</span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2">
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <User size={16} />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.name, item.href)}
                  className={`flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg ${
                    isActive ? 'text-blue-400 bg-blue-900/30' : 'hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </button>
              );
            })}

            {/* Mobile Auth Buttons */}
            {isAuthenticated() ? (
              <>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg hover:bg-gray-700"
                >
                  <User size={20} />
                  <span>Profile ({user?.email?.split('@')[0]})</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left py-3 px-4 rounded-lg hover:bg-gray-700 text-red-400"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate('/login');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-700"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate('/register');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700"
                >
                  Register
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Voice Status */}
      {isVoiceEnabled && (
        <div className="bg-green-600 text-white text-xs py-1 px-4 text-center">
          🎤 Voice control active • Press 1-{navItems.length} for navigation
        </div>
      )}
    </nav>
  );
};

export default NavBar;