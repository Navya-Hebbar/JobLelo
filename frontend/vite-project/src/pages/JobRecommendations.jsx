import React, { useState, useEffect } from 'react';
import { Briefcase, Loader2, TrendingUp, AlertCircle, DollarSign } from 'lucide-react';
import { api } from '../services/api';
import { useVoice } from '../context/VoiceContext';

const JobRecommendations = () => {
  const { speak } = useVoice();
  
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState({
    skills: '',
    experience: '0-1 years',
    preferences: {
      remote: false,
      location: '',
      salaryMin: ''
    }
  });
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!profile.skills.trim()) {
      speak('Please enter your skills first');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const skillsArray = profile.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      
      const response = await api.getJobMatches({
        skills: skillsArray,
        experience: profile.experience,
        preferences: profile.preferences
      });
      
      if (response.success && response.matches) {
        setJobs(response.matches);
        speak(`Found ${response.matches.length} job matches`);
      }
    } catch (error) {
      console.error('Job search error:', error);
      speak('Failed to fetch job matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getMatchLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    return 'Fair Match';
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Briefcase className="text-orange-600" size={32} />
          <h2 className="text-3xl font-bold text-gray-800">AI Job Matcher</h2>
        </div>

        <div className="space-y-4">
          {/* Skills Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Skills *
            </label>
            <textarea
              placeholder="Enter your skills separated by commas (e.g., React, JavaScript, Python, AWS...)"
              value={profile.skills}
              onChange={(e) => setProfile({...profile, skills: e.target.value})}
              className="w-full border-2 border-gray-300 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Experience Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={profile.experience}
                onChange={(e) => setProfile({...profile, experience: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="0-1 years">Entry Level (0-1 years)</option>
                <option value="1-3 years">Junior (1-3 years)</option>
                <option value="3-5 years">Mid-Level (3-5 years)</option>
                <option value="5+ years">Senior (5+ years)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Preferred Location
              </label>
              <input
                type="text"
                placeholder="e.g., San Francisco, Remote"
                value={profile.preferences.location}
                onChange={(e) => setProfile({
                  ...profile, 
                  preferences: {...profile.preferences, location: e.target.value}
                })}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimum Salary
              </label>
              <input
                type="text"
                placeholder="e.g., $70,000"
                value={profile.preferences.salaryMin}
                onChange={(e) => setProfile({
                  ...profile, 
                  preferences: {...profile.preferences, salaryMin: e.target.value}
                })}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Remote Work Preference */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={profile.preferences.remote}
              onChange={(e) => setProfile({
                ...profile, 
                preferences: {...profile.preferences, remote: e.target.checked}
              })}
              className="w-4 h-4 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-semibold text-gray-700">
              Open to remote positions
            </span>
          </label>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={isLoading || !profile.skills.trim()}
            className="w-full bg-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Finding Matches...
              </>
            ) : (
              <>
                <TrendingUp size={24} />
                Find Job Matches
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="animate-spin text-orange-600" size={48} />
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-600" size={24} />
                <div>
                  <h3 className="font-bold text-yellow-800">No matches found</h3>
                  <p className="text-yellow-700">Try adjusting your skills or preferences</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Found {jobs.length} Job Matches
                </h3>
                <p className="text-gray-600">Sorted by match score</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {jobs.map((job, index) => (
                  <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all p-6 border-t-4 border-orange-500"
                  >
                    {/* Match Score Badge */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-3 py-1 rounded-full font-bold text-sm ${getMatchColor(job.matchScore)}`}>
                        {job.matchScore}% Match
                      </div>
                      <span className="text-xs text-gray-500">{getMatchLabel(job.matchScore)}</span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {job.role}
                    </h3>

                    {/* Company */}
                    {job.company && (
                      <p className="text-sm text-gray-600 mb-3">
                        {job.company}
                      </p>
                    )}

                    {/* Salary */}
                    {job.salary && (
                      <div className="flex items-center gap-2 text-green-600 font-semibold mb-3">
                        <DollarSign size={16} />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                    )}

                    {/* Description */}
                    {job.description && (
                      <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                        {job.description}
                      </p>
                    )}

                    {/* Missing Skills */}
                    {job.missingSkills && job.missingSkills.length > 0 && (
                      <div className="border-t pt-3">
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          Skills to develop:
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {job.missingSkills.map((skill, i) => (
                            <span 
                              key={i} 
                              className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Apply Button */}
                    <button className="w-full mt-4 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition-all">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Tips Section */}
      {!hasSearched && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">💡 Tips for Better Matches:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• List all your technical skills, including frameworks and tools</li>
            <li>• Be specific about your experience level</li>
            <li>• Include soft skills like "leadership" or "communication"</li>
            <li>• Update preferences to find remote opportunities</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default JobRecommendations;