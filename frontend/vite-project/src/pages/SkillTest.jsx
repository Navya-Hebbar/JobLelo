import React, { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Trophy, Target } from 'lucide-react';
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

  const startTest = async () => {
    setIsLoading(true);
    setHasStarted(true);
    
    try {
      const response = await api.generateTest(
        testConfig.topic,
        testConfig.difficulty,
        testConfig.count
      );
      
      if (response.success && response.questions) {
        setQuestions(response.questions);
        speak(`Starting ${testConfig.topic} test with ${testConfig.count} questions`);
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
      speak(`Question ${currentStep + 2} of ${questions.length}`);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
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

    // Submit to backend
    try {
      await api.submitTest({ 
        score: finalScore, 
        answers,
        topic: testConfig.topic,
        difficulty: testConfig.difficulty,
        totalQuestions: questions.length,
        correctAnswers: correctCount
      });
      
      speak(`Test completed. Your score is ${finalScore} percent`);
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
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
  };

  // Test Configuration Screen
  if (!hasStarted) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Skill Assessment</h2>
            <p className="text-gray-600">Configure your test settings</p>
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
                Number of Questions
              </label>
              <select
                value={testConfig.count}
                onChange={(e) => setTestConfig({...testConfig, count: parseInt(e.target.value)})}
                className="w-full border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="5">5 Questions (Quick)</option>
                <option value="10">10 Questions (Standard)</option>
                <option value="15">15 Questions (Comprehensive)</option>
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
                Generating Questions...
              </>
            ) : (
              'Start Test'
            )}
          </button>
        </div>
      </div>
    );
  }

  // Results Screen
  if (isFinished) {
    const feedback = getFeedback();
    
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

          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
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

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {testConfig.topic} - {testConfig.difficulty}
        </h2>
        <span className="text-gray-600 font-semibold">
          Question {currentStep + 1} of {questions.length}
        </span>
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

      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="px-6 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
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

      {/* Question Counter */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {Object.keys(answers).length} of {questions.length} answered
      </div>
    </div>
  );
};

export default SkillTest;