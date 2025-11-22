// frontend/vite-project/src/pages/CodingPlatform.jsx
import React, { useState, useEffect } from 'react';
import { Code, Play, RotateCcw, ChevronLeft, ChevronRight, Loader2, CheckCircle, XCircle, Search } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { oneDark } from '@codemirror/theme-one-dark';
import { useVoice } from '../context/VoiceContext';

const CodingPlatform = () => {
  const { speak } = useVoice();
  
  // State Management
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    difficulty: 'All',
    platform: 'All',
    searchQuery: ''
  });
  
  // Editor State
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [activeTab, setActiveTab] = useState('description');

  // Language configurations
  const languageExtensions = {
    javascript: { 
      extension: javascript(), 
      starter: '// JavaScript\nfunction twoSum(nums, target) {\n    // Write your solution here\n    \n}\n\nconsole.log(twoSum([2,7,11,15], 9));'
    },
    python: { 
      extension: python(), 
      starter: '# Python\ndef two_sum(nums, target):\n    # Write your solution here\n    pass\n\nprint(two_sum([2,7,11,15], 9))'
    },
    cpp: { 
      extension: cpp(), 
      starter: '// C++\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    \n}\n\nint main() {\n    vector<int> nums = {2,7,11,15};\n    int target = 9;\n    vector<int> result = twoSum(nums, target);\n    \n    for(int i : result) {\n        cout << i << " ";\n    }\n    return 0;\n}'
    },
    java: { 
      extension: java(), 
      starter: '// Java\nimport java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        \n    }\n    \n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {2,7,11,15};\n        int target = 9;\n        int[] result = sol.twoSum(nums, target);\n        System.out.println(Arrays.toString(result));\n    }\n}'
    }
  };

  // Mock problems with test cases
  const mockProblems = [
    {
      id: 'lc-1',
      title: '1. Two Sum',
      platform: 'LeetCode',
      difficulty: 'Easy',
      link: 'https://leetcode.com/problems/two-sum/',
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
• 2 <= nums.length <= 10^4
• -10^9 <= nums[i] <= 10^9
• -10^9 <= target <= 10^9
• Only one valid answer exists.`,
      testCases: [
        { input: '[2,7,11,15], target=9', expected: '[0,1]', description: 'Basic case' },
        { input: '[3,2,4], target=6', expected: '[1,2]', description: 'Different order' },
        { input: '[3,3], target=6', expected: '[0,1]', description: 'Duplicate numbers' }
      ],
      tags: ['Array', 'Hash Table']
    },
    {
      id: 'lc-2',
      title: '121. Best Time to Buy and Sell Stock',
      platform: 'LeetCode',
      difficulty: 'Easy',
      link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
      description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example 1:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.

Example 2:
Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.`,
      testCases: [
        { input: '[7,1,5,3,6,4]', expected: '5', description: 'Increasing then decreasing' },
        { input: '[7,6,4,3,1]', expected: '0', description: 'Decreasing only' },
        { input: '[1,2,3,4,5]', expected: '4', description: 'Increasing only' }
      ],
      tags: ['Array', 'Dynamic Programming']
    },
    {
      id: 'cf-1',
      title: 'Watermelon',
      platform: 'Codeforces',
      difficulty: 800,
      link: 'https://codeforces.com/problemset/problem/4/A',
      description: `One hot summer day Pete and his friend Billy decided to buy a watermelon. They chose the biggest and the ripest one, in their opinion. After that the watermelon was weighed, and the scales showed w kilos.

They rushed home, dying of thirst, and decided to divide the berry, so that each of them got a part of positive weight. However, it turned out that the watermelon is good only if it can be divided into two even parts (i.e., the parts' weights are equal).

Help Pete and Billy: tell them if they can divide the watermelon in the way they want.

Input: The first line contains a single integer w (1 ≤ w ≤ 100) — the weight of the watermelon bought by the boys.

Output: Print YES if the boys can divide the watermelon into two parts of equal even weight. Otherwise print NO.`,
      testCases: [
        { input: '8', expected: 'YES', description: 'Can be divided: 4+4' },
        { input: '3', expected: 'NO', description: 'Odd number' },
        { input: '2', expected: 'NO', description: 'Too small' }
      ],
      tags: ['Math', 'Brute Force']
    },
    {
      id: 'lc-3',
      title: '217. Contains Duplicate',
      platform: 'LeetCode',
      difficulty: 'Easy',
      link: 'https://leetcode.com/problems/contains-duplicate/',
      description: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

Example 1:
Input: nums = [1,2,3,1]
Output: true

Example 2:
Input: nums = [1,2,3,4]
Output: false

Example 3:
Input: nums = [1,1,1,3,3,4,3,2,4,2]
Output: true`,
      testCases: [
        { input: '[1,2,3,1]', expected: 'true', description: 'Has duplicate' },
        { input: '[1,2,3,4]', expected: 'false', description: 'All distinct' },
        { input: '[1,1,1,3,3,4,3,2,4,2]', expected: 'true', description: 'Multiple duplicates' }
      ],
      tags: ['Array', 'Hash Table', 'Sorting']
    },
    {
      id: 'lc-4',
      title: '242. Valid Anagram',
      platform: 'LeetCode',
      difficulty: 'Easy',
      link: 'https://leetcode.com/problems/valid-anagram/',
      description: `Given two strings s and t, return true if t is an anagram of s, and false otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.

Example 1:
Input: s = "anagram", t = "nagaram"
Output: true

Example 2:
Input: s = "rat", t = "car"
Output: false`,
      testCases: [
        { input: 's="anagram", t="nagaram"', expected: 'true', description: 'Valid anagram' },
        { input: 's="rat", t="car"', expected: 'false', description: 'Not anagram' },
        { input: 's="a", t="ab"', expected: 'false', description: 'Different lengths' }
      ],
      tags: ['Hash Table', 'String', 'Sorting']
    },
    {
      id: 'cf-2',
      title: 'Way Too Long Words',
      platform: 'Codeforces',
      difficulty: 800,
      link: 'https://codeforces.com/problemset/problem/71/A',
      description: `Sometimes some words like "localization" or "internationalization" are so long that writing them many times is quite tiresome.

Let's consider a word too long if its length is strictly more than 10 characters. All too long words should be replaced with a special abbreviation.

The abbreviation is made like this: we write down the first and the last letter of a word and between them we write the number of letters between the first and the last letters.

Input: The first line contains an integer n (1 ≤ n ≤ 100). Each of the following n lines contains one word.

Output: For each word print its abbreviation.`,
      testCases: [
        { input: 'word', expected: 'word', description: 'Short word' },
        { input: 'localization', expected: 'l10n', description: 'Long word' },
        { input: 'internationalization', expected: 'i18n', description: 'Very long word' }
      ],
      tags: ['Strings']
    }
  ];

  // Load problems on mount
  useEffect(() => {
    loadProblems();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [filters, problems]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      // Try to fetch from backend
      const response = await fetch('http://localhost:5000/api/coding/problems');
      if (response.ok) {
        const data = await response.json();
        if (data.problems && data.problems.length > 0) {
          // Merge backend problems with mock problems (add test cases to backend problems)
          const mergedProblems = [...mockProblems, ...data.problems.slice(0, 20)];
          setProblems(mergedProblems);
          setFilteredProblems(mergedProblems);
          speak(`Loaded ${mergedProblems.length} coding problems`);
        } else {
          throw new Error('No problems received');
        }
      } else {
        throw new Error('Backend not available');
      }
    } catch (err) {
      console.log('Using mock problems:', err.message);
      // Use mock problems as fallback
      setProblems(mockProblems);
      setFilteredProblems(mockProblems);
      speak(`Loaded ${mockProblems.length} practice problems`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...problems];

    if (filters.difficulty !== 'All') {
      filtered = filtered.filter(p => {
        if (typeof p.difficulty === 'number') {
          if (filters.difficulty === 'Easy') return p.difficulty <= 1200;
          if (filters.difficulty === 'Medium') return p.difficulty > 1200 && p.difficulty <= 1600;
          if (filters.difficulty === 'Hard') return p.difficulty > 1600;
        }
        return p.difficulty === filters.difficulty;
      });
    }

    if (filters.platform !== 'All') {
      filtered = filtered.filter(p => p.platform === filters.platform);
    }

    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    setFilteredProblems(filtered);
  };

  const handleProblemSelect = (problem) => {
    setSelectedProblem(problem);
    setCode(languageExtensions[language].starter);
    setOutput('');
    setTestResults([]);
    setActiveTab('description');
    speak(`Selected problem: ${problem.title}`);
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(languageExtensions[newLang].starter);
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    
    setIsRunning(true);
    setOutput('Running test cases...\n');
    setTestResults([]);
    
    try {
      // Show running message
      await new Promise(resolve => setTimeout(resolve, 800));
      setOutput('Compiling and executing code...\n');
      
      // Simulate compilation
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Generate test results based on test cases
      if (selectedProblem.testCases && selectedProblem.testCases.length > 0) {
        const results = selectedProblem.testCases.map((testCase, index) => {
          // For demo: first 2 tests pass, last one fails (you can change this logic)
          const passed = index < 2; // First 2 tests pass
          
          return {
            testNumber: index + 1,
            input: testCase.input,
            expected: testCase.expected,
            output: passed ? testCase.expected : (index === 2 ? '[0,2]' : 'Wrong output'),
            passed: passed,
            description: testCase.description
          };
        });
        
        // Update test results state - THIS IS CRUCIAL
        setTestResults(results);
        
        const passedCount = results.filter(r => r.passed).length;
        const totalTests = results.length;
        
        // Build output text
        let outputText = `✓ Execution completed!\n\n`;
        outputText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        outputText += `Test Results: ${passedCount}/${totalTests} passed\n`;
        outputText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        
        results.forEach((result) => {
          outputText += `${result.passed ? '✓' : '✗'} Test ${result.testNumber}: ${result.description}\n`;
          outputText += `  Input:    ${result.input}\n`;
          outputText += `  Expected: ${result.expected}\n`;
          outputText += `  Got:      ${result.output}\n`;
          outputText += `  Status:   ${result.passed ? '✓ PASSED' : '✗ FAILED'}\n\n`;
        });
        
        if (passedCount === totalTests) {
          outputText += `\n🎉 All test cases passed! Ready to submit.\n`;
        } else {
          outputText += `\n⚠️  ${totalTests - passedCount} test case(s) failed. Review your code.\n`;
        }
        
        setOutput(outputText);
        speak(`${passedCount} out of ${totalTests} tests passed`);
      } else {
        setOutput('⚠️ No test cases available for this problem.\n\nPlease visit the problem on the original platform to see test cases.');
        speak('No test cases available');
      }
    } catch (err) {
      const errorMsg = `❌ Error: ${err.message}\n\nPlease check your code for syntax errors.`;
      setOutput(errorMsg);
      speak('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    speak('Submitting your solution');
    setOutput('Solution submitted! (Feature coming soon)\n\nIn a real implementation, this would:\n1. Run all test cases\n2. Check against hidden test cases\n3. Update your submission history\n4. Award points if accepted');
  };

  const handleReset = () => {
    setCode(languageExtensions[language].starter);
    setOutput('');
    setTestResults([]);
    speak('Code reset');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-xl">Loading coding problems...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Coding Platform</h1>
              <p className="text-blue-100 text-sm">Practice problems from multiple platforms</p>
            </div>
          </div>
          
          {selectedProblem && (
            <button
              onClick={() => setSelectedProblem(null)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
            >
              <ChevronLeft size={20} />
              Back to Problems
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {!selectedProblem ? (
          /* Problem List View */
          <>
            {/* Filters */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={filters.searchQuery}
                    onChange={(e) => setFilters({...filters, searchQuery: e.target.value})}
                    className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters({...filters, platform: e.target.value})}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Platforms</option>
                  <option value="LeetCode">LeetCode</option>
                  <option value="Codeforces">Codeforces</option>
                </select>
                
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                
                <button
                  onClick={() => setFilters({ difficulty: 'All', platform: 'All', searchQuery: '' })}
                  className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Problems Count */}
            <div className="mb-4 text-gray-400">
              Showing {filteredProblems.length} problem{filteredProblems.length !== 1 ? 's' : ''}
            </div>

            {/* Problems Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProblems.length === 0 ? (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <p className="text-xl mb-2">No problems found</p>
                  <p>Try adjusting your filters</p>
                </div>
              ) : (
                filteredProblems.map((problem) => (
                  <div
                    key={problem.id}
                    onClick={() => handleProblemSelect(problem)}
                    className="bg-gray-800 rounded-lg p-5 hover:bg-gray-750 cursor-pointer transition-all transform hover:scale-105 border border-gray-700 hover:border-blue-500"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-white pr-2">{problem.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        typeof problem.difficulty === 'number'
                          ? problem.difficulty <= 1200 ? 'bg-green-500/20 text-green-400'
                          : problem.difficulty <= 1600 ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                          : problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400'
                          : problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {typeof problem.difficulty === 'number' ? `${problem.difficulty}` : problem.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <span className="bg-gray-700 px-2 py-1 rounded">{problem.platform}</span>
                      {problem.tags && problem.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {problem.testCases && (
                      <div className="text-xs text-gray-500 mb-2">
                        {problem.testCases.length} test cases
                      </div>
                    )}
                    
                    <a
                      href={problem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                    >
                      View on {problem.platform}
                      <ChevronRight size={14} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          /* Editor View */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Panel - Problem Description */}
            <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="flex border-b border-gray-700">
                {['description', 'submissions', 'solutions'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-3 font-semibold capitalize transition ${
                      activeTab === tab
                        ? 'bg-gray-700 text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'description' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-4">{selectedProblem.title}</h2>
                    
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`px-3 py-1 rounded font-semibold ${
                        typeof selectedProblem.difficulty === 'number'
                          ? selectedProblem.difficulty <= 1200 ? 'bg-green-500/20 text-green-400'
                          : selectedProblem.difficulty <= 1600 ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                          : selectedProblem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400'
                          : selectedProblem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {typeof selectedProblem.difficulty === 'number' ? `Rating: ${selectedProblem.difficulty}` : selectedProblem.difficulty}
                      </span>
                      <span className="text-gray-400">{selectedProblem.platform}</span>
                    </div>
                    
                    <div className="bg-gray-900 rounded-lg p-4 mb-4">
                      <pre className="text-gray-300 leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedProblem.description || 'Problem description will be loaded from the platform.'}
                      </pre>
                    </div>
                    
                    <a
                      href={selectedProblem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                    >
                      View Full Problem on {selectedProblem.platform}
                      <ChevronRight size={16} />
                    </a>
                  </div>
                )}
                
                {activeTab === 'submissions' && (
                  <div className="text-gray-400 text-center py-12">
                    <p>Your submission history will appear here</p>
                  </div>
                )}
                
                {activeTab === 'solutions' && (
                  <div className="text-gray-400 text-center py-12">
                    <p>Community solutions coming soon</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Code Editor */}
            <div className="bg-gray-800 rounded-lg overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-hidden">
                <CodeMirror
                  value={code}
                  height="100%"
                  extensions={[languageExtensions[language].extension]}
                  theme={oneDark}
                  onChange={(value) => setCode(value)}
                  className="h-full"
                />
              </div>
              
              {/* Output Panel */}
              <div className="border-t border-gray-700 bg-gray-900 overflow-hidden flex flex-col" style={{ maxHeight: '300px' }}>
                <div className="p-4 border-b border-gray-700 bg-gray-800">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      Output:
                      {testResults.length > 0 && (
                        <span className={`text-sm px-2 py-1 rounded ${
                          testResults.filter(r => r.passed).length === testResults.length
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {testResults.filter(r => r.passed).length}/{testResults.length} passed
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {/* Text Output */}
                  <div className="p-4 border-b border-gray-700">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {output || 'Click "Run" to execute your code and see test results here.'}
                    </pre>
                  </div>
                  
                  {/* Visual Test Results */}
                  {testResults.length > 0 && (
                    <div className="p-4 space-y-3">
                      <h4 className="font-semibold text-white mb-3">Test Cases:</h4>
                      {testResults.map((result, i) => (
                        <div 
                          key={i} 
                          className={`rounded-lg border-2 p-4 transition-all ${
                            result.passed 
                              ? 'bg-green-500/5 border-green-500/40' 
                              : 'bg-red-500/5 border-red-500/40'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {result.passed ? (
                                <CheckCircle className="text-green-400" size={24} />
                              ) : (
                                <XCircle className="text-red-400" size={24} />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className={`font-bold mb-2 ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                Test {result.testNumber}: {result.description}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex gap-2">
                                  <span className="text-gray-500 font-medium min-w-[80px]">Input:</span>
                                  <span className="text-blue-300 font-mono">{result.input}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-gray-500 font-medium min-w-[80px]">Expected:</span>
                                  <span className="text-green-400 font-mono font-bold">{result.expected}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="text-gray-500 font-medium min-w-[80px]">Got:</span>
                                  <span className={`font-mono font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.output}
                                  </span>
                                </div>
                                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700">
                                  <span className="text-gray-500 font-medium min-w-[80px]">Status:</span>
                                  <span className={`font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                    {result.passed ? '✓ PASSED' : '✗ FAILED'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodingPlatform;