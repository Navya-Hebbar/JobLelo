// frontend/vite-project/src/pages/SkillTest.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, RefreshCw, Trophy, Target, Clock, AlertCircle } from 'lucide-react';
import QuestionCard from '../components/QuestionCard';
import { api } from '../services/api';
import { useVoice } from '../context/VoiceContext';

const SkillTest = () => {
  const { speak } = useVoice();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [testConfig, setTestConfig] = useState({
    topic: 'JavaScript',
    difficulty: 'Medium',
    count: 5
  });
  const [hasStarted, setHasStarted] = useState(false);
  
  // Real-time specific state
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  
  // Constants
  const SECONDS_PER_QUESTION = 60; // 1 minute per question

  // Timer Logic
  useEffect(() => {
    let interval;
    if (hasStarted && !isLoading && !isFinished && questions.length > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          // Voice Alerts
          if (prevTime === 60) speak('One minute remaining');
          if (prevTime === 30) speak('30 seconds left');
          if (prevTime === 10) speak('10 seconds, hurry up');

          if (prevTime <= 1) {
            clearInterval(interval);
            handleAutoSubmit();
            return 0;
          }
          return prevTime - 1;
        });
        
        setTotalTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [hasStarted, isLoading, isFinished, questions.length, speak]);

  const startTest = async () => {
    setIsLoading(true);
    
    try {
      const response = await api.generateTest(
        testConfig.topic,
        testConfig.difficulty,
        testConfig.count
      );
      
      if (response.success && response.questions) {
        setQuestions(response.questions);
        // Set timer based on question count
        const totalTime = testConfig.count * SECONDS_PER_QUESTION;
        setTimeLeft(totalTime);
        setHasStarted(true);
        
        speak(`Starting ${testConfig.topic} test. You have ${Math.floor(totalTime / 60)} minutes.`);
      } else {
        throw new Error('Failed to load questions');
      }
    } catch (error) {
      console.error('Test generation error:', error);
      speak('Failed to generate test questions. Please try again.');
      setHasStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setAnswers({ ...answers, [currentStep]: option });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      speak(`Question ${currentStep + 2}`);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAutoSubmit = () => {
    speak('Time is up! Submitting your test now.');
    handleSubmit();
  };

  const handleSubmit = async () => {
    // Calculate Score
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setIsFinished(true);

    // Submit to backend with time metrics
    try {
      await api.submitTest({ 
        score: finalScore, 
        answers,
        topic: testConfig.topic,
        difficulty: testConfig.difficulty,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timeTakenSeconds: totalTimeTaken,
        completedInTime: timeLeft > 0
      });
      
      const feedback = finalScore > 70 ? "Great job!" : "Keep practicing.";
      speak(`Test completed. Your score is ${finalScore} percent. ${feedback}`);
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getFeedback = () => {
    if (score < 50) {
      return { 
        level: "Beginner", 
        color: "text-red-600", 
        bgColor: "bg-red-50",
        msg: "Keep practicing! Review the fundamentals and try again." 
      };
    }
    if (score < 75) {
      return { 
        level: "Intermediate", 
        color: "text-yellow-600", 
        bgColor: "bg-yellow-50",
        msg: "Good progress! You're on the right track. Practice more advanced topics." 
      };
    }
    return { 
      level: "Advanced", 
      color: "text-green-600", 
      bgColor: "bg-green-50",
      msg: "Excellent! You have strong knowledge in this area." 
    };
  };

  const resetTest = () => {
    setCurrentStep(0);
    setAnswers({});
    setQuestions([]);
    setIsFinished(false);
    setScore(0);
    setHasStarted(false);
    setTimeLeft(0);
    setTotalTimeTaken(0);
  };

  // Test Configuration Screen
  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Real-Time Assessment</h2>
            <p className="text-gray-600">Configure your timed skill test</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Topic
              </label>
              <select
                value={testConfig.topic}
                onChange={(e) => setTestConfig({...testConfig, topic: e.target.value})}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="React">React</option>
                <option value="Python">Python</option>
                <option value="Node.js">Node.js</option>
                <option value="CSS">CSS</option>
                <option value="Data Structures">Data Structures</option>
                <option value="Algorithms">Algorithms</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Easy', 'Medium', 'Hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setTestConfig({...testConfig, difficulty: level})}
                    className={`p-3 rounded-lg font-semibold transition-all ${
                      testConfig.difficulty === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Number of Questions (1 min/question)
              </label>
              <select
                value={testConfig.count}
                onChange={(e) => setTestConfig({...testConfig, count: parseInt(e.target.value)})}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="5">5 Questions (5 Minutes)</option>
                <option value="10">10 Questions (10 Minutes)</option>
                <option value="15">15 Questions (15 Minutes)</option>
              </select>
            </div>
          </div>

          <button
            onClick={startTest}
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition-all mt-8 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Generating Real-Time Test...
              </>
            ) : (
              'Start Timed Test'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isFinished) {
    const feedback = getFeedback();
    const timeDisplay = formatTime(totalTimeTaken);
    
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <Trophy className={`w-20 h-20 mx-auto mb-4 ${feedback.color}`} />
          
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Test Complete!</h2>
          
          <div className={`${feedback.bgColor} rounded-lg p-6 mb-6`}>
            <div className={`text-6xl font-bold mb-2 ${feedback.color}`}>
              {score}%
            </div>
            <p className="text-xl font-semibold mb-2">{feedback.level}</p>
            <p className="text-gray-700">{feedback.msg}</p>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-gray-800">
                {Object.keys(answers).length}
              </div>
              <div className="text-gray-600">Answered</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-green-600">
                {questions.filter((q, i) => answers[i] === q.correct).length}
              </div>
              <div className="text-gray-600">Correct</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-red-600">
                {questions.filter((q, i) => answers[i] && answers[i] !== q.correct).length}
              </div>
              <div className="text-gray-600">Wrong</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-blue-600">
                {timeDisplay}
              </div>
              <div className="text-gray-600">Time</div>
            </div>
          </div>

          <button 
            onClick={resetTest}
            className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2 mx-auto"
          >
            <RefreshCw size={20} />
            Take Another Test
          </button>
        </div>
      </div>
    );
  }

  // Test In Progress
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  // Timer Color Logic
  const getTimerColor = () => {
    if (timeLeft < 10) return 'text-red-600 animate-pulse';
    if (timeLeft < 60) return 'text-orange-500';
    return 'text-gray-700';
  };

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex justify-between items-center sticky top-20 z-10">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {testConfig.topic}
          </h2>
          <span className="text-sm text-gray-500">
            {testConfig.difficulty} Level
          </span>
        </div>
        
        <div className={`flex items-center gap-2 text-2xl font-mono font-bold ${getTimerColor()}`}>
          <Clock size={24} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <div 
          className="bg-purple-600 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
        />
      </div>

      <QuestionCard 
        question={questions[currentStep]} 
        selectedOption={answers[currentStep]} 
        onSelectOption={handleOptionSelect} 
      />

      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="text-sm text-gray-500 font-medium">
          Question {currentStep + 1} of {questions.length}
        </div>
        
        <button
          disabled={!answers[currentStep]}
          onClick={handleNext}
          className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
            answers[currentStep] 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentStep === questions.length - 1 ? "Submit Test" : "Next Question"}
        </button>
      </div>
    </div>
  );
};

export default SkillTest;