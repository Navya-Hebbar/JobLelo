// frontend/vite-project/src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVoice } from '../context/VoiceContext';
import { MessageSquare, FileText, Brain, Briefcase, User, TrendingUp } from 'lucide-react';

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
      stats: 'Start chatting now'
    },
    {
      icon: FileText,
      title: 'Resume Builder',
      description: 'Create an ATS-friendly resume with AI assistance',
      color: 'from-green-500 to-emerald-600',
      path: '/resume',
      stats: 'Build your resume'
    },
    {
      icon: Brain,
      title: 'Skill Tests',
      description: 'Take adaptive tests to assess your knowledge',
      color: 'from-purple-500 to-purple-600',
      path: '/test',
      stats: 'Test your skills'
    },
    {
      icon: Briefcase,
      title: 'Job Matching',
      description: 'Find jobs that match your skills and experience',
      color: 'from-orange-500 to-orange-600',
      path: '/jobs',
      stats: 'Find opportunities'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-6 mb-8 rounded-2xl shadow-xl">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                Welcome back, {user?.email?.split('@')[0] || 'User'}! 👋
              </h1>
              <p className="text-blue-100 mt-2">
                Ready to take your career to the next level?
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-green-300" size={24} />
                <div>
                  <p className="text-sm text-blue-100">Progress</p>
                  <p className="text-2xl font-bold">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Brain className="text-yellow-300" size={24} />
                <div>
                  <p className="text-sm text-blue-100">Skills</p>
                  <p className="text-2xl font-bold">Growing</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center gap-3">
                <Briefcase className="text-orange-300" size={24} />
                <div>
                  <p className="text-sm text-blue-100">Opportunities</p>
                  <p className="text-2xl font-bold">Waiting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            What would you like to do today?
          </h2>
          <p className="text-gray-600">
            Choose from our AI-powered career tools to accelerate your growth
          </p>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                onMouseEnter={() => speak(action.title)}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-left border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="text-white" size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition">
                  {action.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {action.description}
                </p>
                
                <div className="flex items-center text-blue-600 font-semibold group-hover:gap-3 transition-all">
                  {action.stats}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            💡 Pro Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">🎯 Complete Your Profile</h4>
              <p className="text-sm text-gray-600">
                Add your skills and experience to get better job matches and personalized recommendations.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">🎤 Use Voice Commands</h4>
              <p className="text-sm text-gray-600">
                Say "Open chat", "Build resume", "Take test", or "Find jobs" to navigate hands-free.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">📝 Build Your Resume First</h4>
              <p className="text-sm text-gray-600">
                A complete resume helps our AI provide better job recommendations and career advice.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-2">🧪 Take Skill Tests Regularly</h4>
              <p className="text-sm text-gray-600">
                Track your progress and identify areas for improvement with our adaptive assessments.
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity (placeholder) */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            📊 Your Journey
          </h3>
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="text-blue-600" size={40} />
            </div>
            <p className="text-gray-600 mb-4">
              Start using our tools to see your progress and achievements here
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;