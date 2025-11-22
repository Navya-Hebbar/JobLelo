import React, { useState, useEffect } from 'react';
import { Save, Download, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { useVoice } from '../context/VoiceContext';

const ResumeBuilder = () => {
  const { speak } = useVoice();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
    projects: ''
  });
  
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [userId] = useState('guest'); // In production, get from auth

  // Load existing resume on mount
  useEffect(() => {
    loadResume();
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasContent()) {
        saveResume(true);
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [formData]);

  const hasContent = () => {
    return Object.values(formData).some(value => value.trim().length > 0);
  };

  const loadResume = async () => {
    try {
      const response = await api.getResume(userId);
      if (response.success && response.resume) {
        setFormData(response.resume);
        setSaveStatus('Loaded existing resume');
      }
    } catch (error) {
      console.error('Load resume error:', error);
    }
  };

  const saveResume = async (isAutoSave = false) => {
    if (!hasContent()) {
      setSaveStatus('Nothing to save');
      return;
    }

    setSaving(true);
    try {
      const resumeData = {
        ...formData,
        userId,
        id: formData.id || Date.now()
      };
      
      const response = await api.saveResume(resumeData);
      
      if (response.success) {
        setLastSaved(new Date());
        setSaveStatus(isAutoSave ? 'Auto-saved' : 'Saved successfully');
        
        if (!isAutoSave) {
          speak('Resume saved successfully');
        }
        
        // Clear status after 3 seconds
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('Save failed');
      speak('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.name || 'resume'}_${Date.now()}.json`;
    link.click();
    
    speak('Resume exported successfully');
    setSaveStatus('Exported as JSON');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000);
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return lastSaved.toLocaleTimeString();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold">Smart Resume Builder</h2>
            <p className="text-sm opacity-90 mt-1">
              ATS-friendly with auto-save & instant export
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => saveResume(false)}
              disabled={saving || !hasContent()}
              className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Save size={20} />
              )}
              Save
            </button>
            
            <button
              onClick={exportAsJSON}
              disabled={!hasContent()}
              className="flex items-center gap-2 bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={20} />
              Export
            </button>
          </div>
        </div>
        
        {/* Save Status */}
        <div className="mt-3 text-sm opacity-90">
          {saveStatus && (
            <span className="flex items-center gap-1">
              <CheckCircle size={16} />
              {saveStatus}
            </span>
          )}
          {!saveStatus && lastSaved && (
            <span>Last saved: {formatLastSaved()}</span>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="p-8 space-y-6">
        
        {/* Personal Information */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name *"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            <input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            
            <input
              type="text"
              placeholder="Location (City, State)"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </section>

        {/* Professional Summary */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Professional Summary
          </h3>
          <textarea
            placeholder="Write a compelling 2-3 sentence summary highlighting your key strengths and career goals..."
            value={formData.summary}
            onChange={(e) => handleInputChange('summary', e.target.value)}
            className="w-full border-2 border-gray-300 p-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </section>

        {/* Skills */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Skills
          </h3>
          <textarea
            placeholder="List your key skills separated by commas (e.g., React, JavaScript, Node.js, Python, AWS, etc.)..."
            value={formData.skills}
            onChange={(e) => handleInputChange('skills', e.target.value)}
            className="w-full border-2 border-gray-300 p-3 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </section>

        {/* Experience */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Work Experience
          </h3>
          <textarea
            placeholder="List your work experience in reverse chronological order. Include company name, position, dates, and key achievements..."
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="w-full border-2 border-gray-300 p-3 rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </section>

        {/* Education */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Education
          </h3>
          <textarea
            placeholder="List your educational qualifications (degree, institution, graduation year, GPA if relevant)..."
            value={formData.education}
            onChange={(e) => handleInputChange('education', e.target.value)}
            className="w-full border-2 border-gray-300 p-3 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </section>

        {/* Projects */}
        <section>
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-green-500 pb-2">
            Projects
          </h3>
          <textarea
            placeholder="Describe your key projects with technologies used and outcomes achieved..."
            value={formData.projects}
            onChange={(e) => handleInputChange('projects', e.target.value)}
            className="w-full border-2 border-gray-300 p-3 rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </section>

        {/* Tips */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <h4 className="font-bold text-green-800 mb-2">💡 ATS Optimization Tips:</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Use standard section headings (Experience, Education, Skills)</li>
            <li>• Include relevant keywords from job descriptions</li>
            <li>• Use bullet points for easy scanning</li>
            <li>• Quantify achievements with numbers when possible</li>
            <li>• Keep formatting simple and clean</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;