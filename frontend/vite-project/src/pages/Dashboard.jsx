// frontend/vite-project/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import { MessageSquare, FileText, Brain, Briefcase, User, TrendingUp, Code, Map, Sparkles, Zap, Target, Award } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { speak } = useVoice();
  const navigate = useNavigate();

  useEffect(() => {
    speak(`Welcome to your dashboard, ${user?.email?.split('@')[0] || 'user'}`);
  }, []);

  const quickActions = [
    {
      icon: MessageSquare,
      title: 'AI Career Assistant',
      description: 'Get personalized career advice and interview preparation',
      color: 'from-blue-500 to-blue-600',
      path: '/chat',
      stats: 'Start chatting now',
      badge: 'AI Powered'
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create an ATS-friendly resume with AI assistance',
      color: 'from-green-500 to-emerald-600',
      path: '/resume',
      stats: 'Build your resume',
      badge: 'Smart Builder'
    },
    {
      icon: Brain,
      title: 'Skill Tests',
      description: 'Take adaptive tests to assess your knowledge',
      color: 'from-purple-500 to-purple-600',
      path: '/test',
      stats: 'Test your skills',
      badge: 'Adaptive'
    },
    {
      icon: Briefcase,
      title: 'Job Matching',
      description: 'Find jobs that match your skills and experience',
      color: 'from-orange-500 to-orange-600',
      path: '/jobs',
      stats: 'Find opportunities',
      badge: 'Personalized'
    },
    {
      icon: Code,
      title: 'Coding Platform',
      description: 'Practice coding problems and improve your skills',
      color: 'from-cyan-500 to-blue-600',
      path: '/coding',
      stats: 'Start coding',
      badge: 'LeetCode Style'
    },
    {
      icon: Map,
      title: 'Career Roadmap',
      description: 'Get a personalized roadmap to achieve your career goals',
      color: 'from-pink-500 to-rose-600',
      path: '/roadmap',
      stats: 'Plan your path',
      badge: 'Customized'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Welcome Header */}
      <div className="relative bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-xl text-white py-16 px-6 mb-8 shadow-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border-2 border-white/30 shadow-lg transform hover:scale-110 transition-transform">
                <User size={40} className="text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
                  Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
                </h1>
                <p className="text-blue-100 text-lg font-medium">
                  Ready to take your career to the next level?
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Sparkles className="text-yellow-300 animate-pulse" size={32} />
            </div>
          </div>

          {/* Enhanced Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Progress</p>
                    <p className="text-3xl font-bold text-white">Active</p>
                  </div>
                </div>
                <Zap className="text-yellow-300" size={24} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Skills</p>
                    <p className="text-3xl font-bold text-white">Growing</p>
                  </div>
                </div>
                <Target className="text-yellow-300" size={24} />
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:bg-white/15 transition-all transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="text-white" size={28} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-100 font-medium">Opportunities</p>
                    <p className="text-3xl font-bold text-white">Waiting</p>
                  </div>
                </div>
                <Award className="text-yellow-300" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 pb-12">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            What would you like to do today?
          </h2>
          <p className="text-gray-300 text-lg">
            Choose from our AI-powered career tools to accelerate your growth
          </p>
        </div>

        {/* Enhanced Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                onMouseEnter={() => speak(action.title)}
                className="group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 text-left border border-white/20 overflow-hidden"
              >
                {/* Animated gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold text-white border border-white/30">
                    {action.badge}
                  </span>
                </div>
                
                <div className="relative z-10">
                  <div className={`w-20 h-20 bg-gradient-to-br ${action.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all shadow-xl`}>
                    <Icon className="text-white" size={36} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition">
                    {action.title}
                  </h3>
                  
                  <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center text-blue-300 font-semibold group-hover:text-blue-200 transition-all">
                    <span>{action.stats}</span>
                    <svg className="w-5 h-5 group-hover:translate-x-2 transition ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Enhanced Tips Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl mb-8">
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={28} />
            Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Target className="text-blue-400" size={20} />
                Complete Your Profile
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Add your skills and experience to get better job matches and personalized recommendations.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Zap className="text-yellow-400" size={20} />
                Voice Commands
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Say <span className="text-blue-300 font-semibold">"stop"</span> to stop speaking, <span className="text-blue-300 font-semibold">"start"</span> to resume. Navigate hands-free with voice!
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <FileText className="text-green-400" size={20} />
                Build Your Resume First
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                A complete resume helps our AI provide better job recommendations and career advice.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all">
              <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                <Brain className="text-purple-400" size={20} />
                Take Skill Tests Regularly
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Track your progress and identify areas for improvement with our adaptive assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Journey Section */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/20">
          <h3 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <Award className="text-yellow-400" size={32} />
            Your Journey
          </h3>
          <div className="text-center py-10">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/20 shadow-xl">
              <TrendingUp className="text-blue-400" size={50} />
            </div>
            <p className="text-gray-300 mb-6 text-lg">
              Start using our tools to see your progress and achievements here
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Add blob animation styles */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;