// frontend/vite-project/src/pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Award, Briefcase, LogOut } from 'lucide-react';
import { api } from '../services/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    testsCompleted: 0,
    resumesCreated: 0,
    jobsApplied: 0,
    avgScore: 0
  });

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      // Load user statistics
      const testScores = await api.getTestScores();
      if (testScores.success && testScores.scores) {
        const scores = testScores.scores;
        const avgScore = scores.length > 0 
          ? scores.reduce((sum, test) => sum + test.score, 0) / scores.length 
          : 0;
        
        setStats(prev => ({
          ...prev,
          testsCompleted: scores.length,
          avgScore: Math.round(avgScore)
        }));
      }
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <User size={48} />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">
                {user?.email?.split('@')[0] || 'User'}
              </h1>
              <div className="flex items-center gap-2 text-blue-100">
                <Mail size={16} />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-blue-100 mt-1">
                <Calendar size={16} />
                <span>Member since {formatDate(Date.now())}</span>
              </div>
            </div>

            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Award className="text-blue-600" size={32} />
              <span className="text-3xl font-bold text-gray-800">{stats.testsCompleted}</span>
            </div>
            <p className="text-gray-600 font-medium">Tests Completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="text-green-600" size={32} />
              <span className="text-3xl font-bold text-gray-800">{stats.avgScore}%</span>
            </div>
            <p className="text-gray-600 font-medium">Average Score</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <User className="text-purple-600" size={32} />
              <span className="text-3xl font-bold text-gray-800">{stats.resumesCreated}</span>
            </div>
            <p className="text-gray-600 font-medium">Resumes Created</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Mail className="text-orange-600" size={32} />
              <span className="text-3xl font-bold text-gray-800">{stats.jobsApplied}</span>
            </div>
            <p className="text-gray-600 font-medium">Jobs Viewed</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => window.location.href = '/chat'}
              className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition border-2 border-blue-200"
            >
              <h3 className="font-bold text-blue-800 mb-1">AI Career Assistant</h3>
              <p className="text-sm text-blue-600">Get personalized career advice</p>
            </button>

            <button
              onClick={() => window.location.href = '/resume'}
              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition border-2 border-green-200"
            >
              <h3 className="font-bold text-green-800 mb-1">Build Resume</h3>
              <p className="text-sm text-green-600">Create an ATS-friendly resume</p>
            </button>

            <button
              onClick={() => window.location.href = '/test'}
              className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition border-2 border-purple-200"
            >
              <h3 className="font-bold text-purple-800 mb-1">Take Skill Test</h3>
              <p className="text-sm text-purple-600">Test your knowledge</p>
            </button>

            <button
              onClick={() => window.location.href = '/jobs'}
              className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-left transition border-2 border-orange-200"
            >
              <h3 className="font-bold text-orange-800 mb-1">Find Jobs</h3>
              <p className="text-sm text-orange-600">Get AI-powered job matches</p>
            </button>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-xl shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates about your applications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-800">Voice Controls</h3>
                <p className="text-sm text-gray-600">Enable voice navigation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <button className="w-full mt-4 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition border-2 border-red-200">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;