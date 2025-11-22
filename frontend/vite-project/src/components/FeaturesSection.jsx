import React from 'react';
import { MessageSquare, FileText, Brain, Briefcase, Map, Volume2 } from 'lucide-react';
import FeatureCard from './FeatureCard';

const FeaturesSection = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Voice Assistant',
      description: 'Chat with our AI using voice or text to get instant career advice and interview preparation.',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      href: '/chat'
    },
    {
      icon: FileText,
      title: 'Smart Resume Builder',
      description: 'Create ATS-friendly resumes with auto-save and instant JSON export features.',
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      href: '/resume'
    },
    {
      icon: Brain,
      title: 'Adaptive Skill Tests',
      description: 'Take dynamic quizzes that adapt to your proficiency level with instant feedback.',
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      href: '/test'
    },
    {
      icon: Briefcase,
      title: 'AI Job Matching',
      description: 'Find jobs that perfectly match your skills, projects, and experience using AI.',
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      href: '/jobs'
    },
    {
      icon: Map,
      title: 'Career Roadmap',
      description: 'Get a personalized step-by-step guide to mastering your dream role.',
      color: 'bg-gradient-to-br from-pink-500 to-pink-600',
      href: '/roadmap'
    },
    {
      icon: Volume2,
      title: 'Full Voice Control',
      description: 'Navigate the entire platform using voice commands. Perfect for accessibility.',
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      href: '#' // Assuming settings modal or page isn't created yet
    }
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our AI-powered tools streamline your entire job search journey from preparation to placement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;