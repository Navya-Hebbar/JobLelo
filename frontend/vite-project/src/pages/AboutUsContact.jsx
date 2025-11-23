import React from 'react';
import { Mail, Briefcase, Users, Zap, RotateCw, Sparkles, Code, Brain, Settings } from 'lucide-react'; // Added more icons

// --- 1. Updated Data Source (with roles mapped to specific icons and improved gradients) ---
const teamMembers = [
    {
        name: 'Navya Hebbar',
        collegeName: 'RVCE',
        yearCourse: '3rd year Data Science',
        role: 'Full Stack Developer',
        contact: 'nav@gmail.com',
        imagePlaceholder: 'NH',
        primaryColor: 'pink', // Changed from red to pink for softer gradient
        gradient: 'from-pink-500 to-red-600',
        icon: Code, // Icon for developer
    },
    {
        name: 'Disha Hebbar',
        collegeName: 'Dr. AIT',
        yearCourse: '4th year CSE',
        role: 'Frontend Developer',
        contact: 'dishaheb@gmail.com',
        imagePlaceholder: 'DH',
        primaryColor: 'purple',
        gradient: 'from-purple-500 to-indigo-600',
        icon: Sparkles, // Icon for creative/frontend
    },
    {
        name: 'Shashank Hebbar',
        collegeName: 'RNSIT',
        yearCourse: '3rd year Information Science',
        role: 'Backend Developer',
        contact: 'shashankdh20@gmail.com',
        imagePlaceholder: 'SH',
        primaryColor: 'green', // Changed from lime to green
        gradient: 'from-green-500 to-emerald-600',
        icon: Settings, // Icon for backend/settings
    },
    {
        name: 'Sumukh M S',
        collegeName: 'Dr. AIT',
        yearCourse: '4th year CSE',
        role: 'AI / ML Engineer',
        contact: 'sumukhms.25@gmail.com',
        imagePlaceholder: 'SM',
        primaryColor: 'blue', // Changed from cyan to blue
        gradient: 'from-blue-500 to-cyan-600',
        icon: Brain, // Icon for AI/ML
    },
];

// --- 2. Card Component (Handles the flip animation and new effects) ---
const FlipCard = ({ member }) => {
    // This helper maps color strings to Tailwind CSS classes dynamically
    const getTextColorClass = (color) => {
        if (color === 'pink') return 'text-pink-300';
        if (color === 'blue') return 'text-blue-300';
        if (color === 'green') return 'text-green-300';
        if (color === 'purple') return 'text-purple-300';
        return 'text-white';
    };

    const DynamicIcon = member.icon; // Get the specific icon component

    return (
        <div className="group h-[380px] w-full [perspective:1000px] relative">
            {/* Overlay for hover glow effect */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl scale-95 group-hover:scale-105 z-0`} />

            {/* The inner container that does the flipping */}
            <div 
                className="relative h-full w-full transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:scale-[1.03] group-hover:shadow-2xl z-10"
            >
                {/* --- FRONT FACE: About Us Summary --- */}
                <div 
                    className={`absolute inset-0 bg-gray-900/80 backdrop-blur-lg rounded-xl border border-white/10 p-6 flex flex-col items-center justify-center [backface-visibility:hidden] transition-all duration-500 group-hover:shadow-none 
                        transform-gpu will-change-transform shadow-xl hover:border-white/30`}
                >
                    {/* Placeholder for Image - Vibrant Ring with Icon */}
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl font-black bg-gradient-to-br ${member.gradient} text-white border-4 border-${member.primaryColor}-300 mb-4 transform group-hover:scale-105 transition-transform duration-300 ease-out`}>
                        {DynamicIcon && <DynamicIcon size={50} className="text-white drop-shadow-lg" />}
                    </div>

                    <h2 className={`text-3xl font-extrabold mb-1 tracking-wide ${getTextColorClass(member.primaryColor)} text-shadow-md`}>{member.name}</h2>
                    <p className="text-lg font-semibold text-gray-200 mb-1">{member.yearCourse}</p>
                    <p className="text-md font-medium text-gray-400 mb-2">{member.collegeName}</p>
                    
                    <p className="text-center text-sm text-gray-400 italic px-2 leading-relaxed">
                        "{member.role}"
                    </p>
                    <div className="mt-4 text-sm font-medium flex items-center text-yellow-400 animate-pulse-slow">
                        <RotateCw size={14} className="mr-2" /> Hover for Connection
                    </div>
                </div>

                {/* --- BACK FACE: Contact Us Details --- */}
                <div 
                    className={`absolute inset-0 bg-gradient-to-br ${member.gradient} rounded-xl shadow-2xl p-6 flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)] transition-all duration-500
                        transform-gpu will-change-transform`}
                >
                    <h3 className="text-3xl font-bold text-white mb-4 flex items-center text-shadow-md">
                        <Zap size={24} className="mr-3 text-yellow-300 drop-shadow-lg" /> Get Connected
                    </h3>
                    
                    <div className="flex items-center gap-3 mb-3 text-xl text-white">
                        <Briefcase size={22} />
                        <span className="font-semibold">{member.role}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xl text-white/90">
                        <Mail size={22} />
                        <a href={`mailto:${member.contact}`} className="font-mono underline hover:text-yellow-200 transition duration-300">
                            {member.contact}
                        </a>
                    </div>
                    <p className="text-center text-base text-white/80 mt-6 max-w-xs leading-relaxed">
                        Reach out for collaborations, questions, or just to say hello!
                    </p>
                </div>
            </div>
        </div>
    );
};


// --- 3. Main Component ---
const AboutUsContact = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-white p-8 overflow-hidden relative">
            
            {/* Animated Background Blob/Gradient */}
            <div className="absolute inset-0 z-0 animate-gradient-move">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '-2s'}}/>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '-4s'}}/>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" style={{animationDelay: '-6s'}}/>
            </div>
            
            {/* Header */}
            <div className="text-center z-10 mb-12 relative"> {/* Relative for z-index */}
                <h1 className="text-7xl font-extrabold mb-3 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-cyan-400 to-purple-500 drop-shadow-lg animate-fade-in">
                    <Users className="inline h-12 w-12 mr-4 text-white drop-shadow-md" /> The I² Crew
                </h1>
                <p className="text-2xl text-gray-300 font-light italic tracking-wider animate-slide-up delay-200">
                    Meet the brilliant minds behind Joblelo.
                </p>
            </div>

            {/* Team Grid (Displays all 4 members equally) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl w-full z-10 relative"> {/* Relative for z-index */}
                {teamMembers.map((member) => (
                    <FlipCard key={member.name} member={member} />
                ))}
            </div>

            {/* General Contact Footer */}
            <div className="mt-16 text-center max-w-xl p-6 bg-gray-900/80 backdrop-blur-lg rounded-xl border border-white/10 shadow-2xl relative z-10 animate-fade-in delay-500">
                <h3 className="text-2xl font-extrabold text-yellow-300 mb-3 drop-shadow-md">General Support & Partnerships</h3>
                <p className="text-lg text-gray-300 mb-2 leading-relaxed">
                    For all non-personal inquiries, technical support, or exciting partnership opportunities:
                </p>
                <a 
                    href="mailto:contact@joblelo.com" 
                    className="flex items-center justify-center text-xl font-mono text-cyan-400 hover:text-cyan-200 transition duration-300 mt-4 animate-bounce-subtle"
                >
                    <Mail size={24} className="mr-2" /> contact@joblelo.com
                </a>
            </div>

            {/* Custom CSS for Keyframe Animations (Needs to be in a global CSS file or within <style jsx> tag) */}
            <style jsx="true">{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s infinite ease-in-out;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                .delay-200 { animation-delay: 0.2s; }
                .delay-500 { animation-delay: 0.5s; }

                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.7s ease-out forwards;
                }

                @keyframes blob {
                    0% {
                        transform: translate(0px, 0px) scale(1);
                    }
                    33% {
                        transform: translate(30px, -50px) scale(1.1);
                    }
                    66% {
                        transform: translate(-20px, 20px) scale(0.9);
                    }
                    100% {
                        transform: translate(0px, 0px) scale(1);
                    }
                }
                .animate-blob {
                    animation: blob 7s infinite cubic-bezier(0.6, -0.28, 0.735, 0.045);
                }

                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2.5s infinite ease-in-out;
                }
                
                .text-shadow-md {
                    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
                }
            `}</style>
        </div>
    );
};

export default AboutUsContact;