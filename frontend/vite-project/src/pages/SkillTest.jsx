// frontend/vite-project/src/pages/SkillTest.jsx - ENHANCED VERSION
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, RefreshCw, Trophy, Target, Clock, AlertCircle, Award, History } from 'lucide-react';
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
  
  // NEW: Enhanced results state
  const [testResults, setTestResults] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    testsCompleted: 0,
    avgScore: 0
  });
  
  // Constants
  const SECONDS_PER_QUESTION = 60; // 1 minute per question

  useEffect(() => {
    loadUserStats();
    loadSubmissionHistory();
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (hasStarted && !isLoading && !isFinished && questions.length > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
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

  const loadUserStats = async () => {
    try {
      const response = await api.getUserTestStats();
      if (response.success) {
        setUserStats(response.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadSubmissionHistory = async () => {
    try {
      const response = await api.getTestScores();
      if (response.success && response.scores) {
        setSubmissionHistory(response.scores);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

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
    setIsLoading(true);
    
    try {
      // NEW: Submit to enhanced endpoint that handles all 4 requirements
      const response = await api.submitEnhancedTest({
        topic: testConfig.topic,
        difficulty: testConfig.difficulty,
        answers,
        questions,
        totalQuestions: questions.length,
        timeTakenSeconds: totalTimeTaken,
        completedInTime: timeLeft > 0
      });

      if (response.success) {
        setTestResults(response.results);
        setScore(response.results.score);
        setIsFinished(true);

        // Update local stats
        setUserStats(prev => ({
          totalPoints: prev.totalPoints + (response.results.pointsAwarded || 0),
          testsCompleted: prev.testsCompleted + 1,
          avgScore: response.results.newAvgScore || prev.avgScore
        }));

        // Reload history to show new submission
        loadSubmissionHistory();

        const feedback = response.results.score > 70 
          ? `Excellent! You earned ${response.results.pointsAwarded} points!` 
          : "Keep practicing.";
        
        speak(`Test completed. Your score is ${response.results.score} percent. ${feedback}`);
      }
    } catch (error) {
      console.error('Submission failed:', error);
      speak('Submission failed. Please try again.');
    } finally {
      setIsLoading(false);
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
    setTestResults(null);
  };

  // Test Configuration Screen
  if (!hasStarted) {
    return (
      <div className="max-w-6xl mx-auto mt-10">
        {/* Stats Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white mb-6 shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-1">Your Test Stats</h1>
              <p className="text-purple-100 text-sm">Track your progress and achievements</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-300" size={20} />
                  <span className="text-2xl font-bold">{userStats.totalPoints}</span>
                </div>
                <p className="text-xs text-purple-100">Points</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Target className="text-green-300" size={20} />
                  <span className="text-2xl font-bold">{userStats.testsCompleted}</span>
                </div>
                <p className="text-xs text-purple-100">Completed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2">
                  <Award className="text-blue-300" size={20} />
                  <span className="text-2xl font-bold">{userStats.avgScore}%</span>
                </div>
                <p className="text-xs text-purple-100">Avg Score</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Test Configuration */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-xl p-8">
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
                  Generating Test...
                </>
              ) : (
                'Start Timed Test'
              )}
            </button>
          </div>

          {/* Submission History */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Recent Tests</h3>
              <History className="text-purple-600" size={24} />
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {submissionHistory.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  No tests completed yet
                </p>
              ) : (
                submissionHistory.slice(0, 10).map((test, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-2 ${
                      test.passed
                        ? 'bg-green-50 border-green-300'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">{test.topic}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        test.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        test.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600">
                      <span>{test.score}%</span>
                      {test.pointsAwarded > 0 && (
                        <span className="text-purple-600 font-semibold">
                          +{test.pointsAwarded} pts
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(test.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen with Enhanced Info
  if (isFinished && testResults) {
    const feedback = getFeedback();
    const timeDisplay = formatTime(totalTimeTaken);
    
    return (
      <div className="max-w-4xl mx-auto mt-10">
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

          {/* Enhanced Results Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-gray-800">
                {testResults.answeredCount}
              </div>
              <div className="text-gray-600 text-sm">Answered</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-green-600">
                {testResults.correctCount}
              </div>
              <div className="text-gray-600 text-sm">Correct</div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-red-600">
                {testResults.wrongCount}
              </div>
              <div className="text-gray-600 text-sm">Wrong</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="font-bold text-2xl text-blue-600">
                {timeDisplay}
              </div>
              <div className="text-gray-600 text-sm">Time</div>
            </div>
          </div>

          {/* NEW: Hidden Tests Info */}
          {testResults.hiddenTestsInfo && (
            <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="text-purple-600" size={20} />
                <h3 className="font-bold text-purple-800">Hidden Tests</h3>
              </div>
              <p className="text-sm text-purple-700">
                {testResults.hiddenTestsPassed} / {testResults.totalHiddenTests} hidden test cases passed
              </p>
              <p className="text-xs text-purple-600 mt-1">
                These tests validate edge cases and complex scenarios
              </p>
            </div>
          )}

          {/* NEW: Points Awarded */}
          {testResults.pointsAwarded > 0 && (
            <div className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-lg mb-6">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold text-yellow-800 mb-1">
                +{testResults.pointsAwarded} Points!
              </h3>
              <p className="text-sm text-yellow-700">
                {testResults.isFirstPass 
                  ? "First time passing this difficulty!" 
                  : "Great job completing this test!"}
              </p>
              <p className="text-xs text-yellow-600 mt-2">
                Total Points: {userStats.totalPoints}
              </p>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button 
              onClick={resetTest}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center gap-2"
            >
              <RefreshCw size={20} />
              Take Another Test
            </button>
            
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center gap-2"
            >
              <History size={20} />
              View History
            </button>
          </div>

          {/* Show detailed history if requested */}
          {showHistory && (
            <div className="mt-6 text-left">
              <h3 className="font-bold text-lg mb-3">Submission History</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {submissionHistory.map((test, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">{test.topic} - {test.difficulty}</span>
                      <span className="text-sm">{test.score}%</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {new Date(test.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Test In Progress (existing code continues...)
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

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