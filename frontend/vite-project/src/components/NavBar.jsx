// frontend/vite-project/src/components/NavBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Briefcase, Menu, X, Home, LayoutDashboard, MessageSquare, 
  FileText, Brain, Briefcase as Jobs, User, LogOut, Code, 
  Map, Info, Sparkles
} from 'lucide-react';
import { useVoice } from '../context/VoiceContext';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { speak, isVoiceEnabled } = useVoice();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileMenuContentRef = useRef(null);
  const profileRef = useRef(null);

  const publicNavItems = [
    { name: 'Home', href: '/', icon: Home, description: 'Go to home page' },
  ];

  const protectedNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, description: 'View your dashboard', color: 'text-blue-400' },
    { name: 'AI Assistant', href: '/chat', icon: MessageSquare, description: 'Open AI chat assistant', color: 'text-purple-400' },
    { name: 'Resume', href: '/resume', icon: FileText, description: 'Build your resume', color: 'text-green-400' },
    { name: 'Skill Test', href: '/test', icon: Brain, description: 'Take skill assessments', color: 'text-yellow-400' },
    { name: 'Jobs', href: '/jobs', icon: Jobs, description: 'Find job matches', color: 'text-orange-400' },
    { name: 'Coding', href: '/coding', icon: Code, description: 'Practice coding problems', color: 'text-cyan-400' },
    { name: 'Roadmap', href: '/roadmap', icon: Map, description: 'Roadmap for success', color: 'text-pink-400' },
    { name: 'Profile', href: '/profile', icon: User, description: 'View your profile', color: 'text-violet-400' },
    { name: 'About', href: '/about', icon: Info, description: 'About us', color: 'text-indigo-400' },
  ];

  const navItems = isAuthenticated() 
    ? [...publicNavItems, ...protectedNavItems]
    : publicNavItems;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check desktop hamburger menu
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      // Check mobile menu backdrop (but not the content)
      if (mobileMenuRef.current && 
          mobileMenuRef.current === event.target && 
          !mobileMenuContentRef.current?.contains(event.target)) {
        setIsMenuOpen(false);
      }
      // Check profile menu - close if clicking outside
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    // Use a small delay to allow click events to process first
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setShowProfileMenu(false);
  }, [location.pathname]);

  const handleNavClick = (name, href, e) => {
    // Prevent event bubbling
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    console.log(`Navigating to: ${name} (${href})`); // Debug log
    
    if (isVoiceEnabled) {
        speak(`Navigating to ${name}`);
    }
    
    // Close menus first
    setIsMenuOpen(false);
    setShowProfileMenu(false);
    
    // Navigate immediately - don't delay
    console.log(`Executing navigation to: ${href}`); // Debug log
    navigate(href);
  };

  const handleLogout = () => {
    if (isVoiceEnabled) {
        speak('Logging out');
    }
    logout();
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-sm border-b border-gray-700/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - Always visible */}
            <div 
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
              onClick={() => handleNavClick('Home', '/')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Briefcase size={22} className="text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                JOBLELO
              </h1>
            </div>

            {/* Desktop - Show only key items + hamburger for rest */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Show only 3-4 most important items on desktop */}
              {isAuthenticated() && (
                <>
                  <button
                    onClick={() => handleNavClick('Dashboard', '/dashboard')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      location.pathname === '/dashboard' 
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <LayoutDashboard size={18} />
                    <span className="text-sm">Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('AI Assistant', '/chat')}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      location.pathname === '/chat' 
                        ? 'bg-purple-600/20 text-purple-400 border border-purple-500/30' 
                        : 'hover:bg-gray-700/50'
                    }`}
                  >
                    <MessageSquare size={18} />
                    <span className="text-sm">AI Chat</span>
                  </button>
                </>
              )}

              {/* Profile/Auth */}
              {isAuthenticated() ? (
                <div className="relative ml-2" ref={profileRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfileMenu(!showProfileMenu);
                      // Close hamburger menu when opening profile menu
                      if (!showProfileMenu) {
                        setIsMenuOpen(false);
                      }
                    }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">{user?.email?.split('@')[0] || 'Profile'}</span>
                  </button>
                  
                  {showProfileMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-56 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[70]"
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Profile button clicked from desktop dropdown');
                          // Close menu and navigate
                          setShowProfileMenu(false);
                          // Small delay to ensure menu closes before navigation
                          setTimeout(() => {
                            console.log('Navigating to /profile');
                            navigate('/profile');
                          }, 150);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-700/50 active:bg-gray-600/50 flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </button>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-900/30 text-red-400 flex items-center gap-3 transition-colors"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 rounded-lg hover:bg-gray-700/50 transition-all text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg text-sm font-medium"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Hamburger Menu for More Items */}
              <div className="relative ml-2" ref={desktopMenuRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMenuOpen(!isMenuOpen);
                    // Close profile menu when opening hamburger menu
                    if (!isMenuOpen) {
                      setShowProfileMenu(false);
                    }
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    isMenuOpen ? 'bg-blue-600/20 rotate-90' : 'hover:bg-gray-700/50'
                  }`}
                  aria-label="Menu"
                >
                  {isMenuOpen ? (
                    <X size={24} className="text-blue-400" />
                  ) : (
                    <Menu size={24} />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 py-2 max-h-[80vh] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 z-[60]"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    {navItems
                      .filter(item => !['Dashboard', 'AI Assistant'].includes(item.name))
                      .map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        
                        return (
                          <button
                            key={item.name}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log(`Desktop hamburger menu: Clicking ${item.name} -> ${item.href}`);
                              handleNavClick(item.name, item.href, e);
                            }}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-700/50 flex items-center gap-3 transition-all ${
                              isActive ? 'bg-blue-600/20 border-l-4 border-blue-500' : ''
                            }`}
                          >
                            <Icon size={20} className={item.color || 'text-gray-400'} />
                            <span className={isActive ? 'text-blue-400 font-medium' : ''}>{item.name}</span>
                            {isActive && <Sparkles size={16} className="text-blue-400 ml-auto" />}
                          </button>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile/Tablet - Always show hamburger */}
            <div className="lg:hidden flex items-center gap-3">
              {/* Profile button on mobile if authenticated */}
              {isAuthenticated() && (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    <User size={20} />
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-700/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-gray-300">{user?.email?.split('@')[0]}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('Profile button clicked from mobile dropdown');
                          setShowProfileMenu(false);
                          setTimeout(() => {
                            navigate('/profile');
                          }, 100);
                        }}
                        className="w-full text-left px-4 py-2.5 hover:bg-gray-700/50 flex items-center gap-3"
                      >
                        <User size={18} />
                        <span>Profile</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 hover:bg-red-900/30 text-red-400 flex items-center gap-3"
                      >
                        <LogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Auth buttons if not authenticated */}
              {!isAuthenticated() && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-3 py-1.5 rounded-lg hover:bg-gray-700/50 transition-all text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/register')}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium"
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 rounded-lg transition-all ${
                  isMenuOpen ? 'bg-blue-600/20 rotate-90' : 'hover:bg-gray-700/50'
                }`}
                aria-label="Menu"
              >
                {isMenuOpen ? (
                  <X size={24} className="text-blue-400" />
                ) : (
                  <Menu size={24} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Slide-out Menu */}
        {isMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              // Only close if clicking the backdrop, not the menu content
              if (e.target === mobileMenuRef.current) {
                setIsMenuOpen(false);
              }
            }}
          >
            <div 
              ref={mobileMenuContentRef}
              className="absolute right-0 top-0 h-full w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-700/50 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    
                    return (
                      <button
                        key={item.name}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNavClick(item.name, item.href, e);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                          isActive 
                            ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 shadow-lg' 
                            : 'hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon size={22} className={item.color || 'text-gray-400'} />
                        <span className="font-medium">{item.name}</span>
                        {isActive && <Sparkles size={18} className="text-blue-400 ml-auto animate-pulse" />}
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Auth Section */}
                {!isAuthenticated() && (
                  <div className="mt-6 pt-6 border-t border-gray-700 space-y-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg hover:bg-gray-700/50 transition-all text-left"
                    >
                      Login
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
                    >
                      Register
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Voice Status Bar */}
        {isVoiceEnabled && isAuthenticated() && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2">
            <Sparkles size={14} className="animate-pulse" />
            <span className="font-medium">🎤 Voice control active</span>
            <Sparkles size={14} className="animate-pulse" />
          </div>
        )}
      </nav>
    </>
  );
};

export default NavBar;