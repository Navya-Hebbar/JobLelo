import React, { useState, useEffect } from 'react';
import { Code, Play, Send, RotateCcw, ChevronLeft, Clock, CheckCircle, XCircle, AlertCircle, Trophy, TrendingUp, Loader2, Search, Filter } from 'lucide-react';

const CompleteCodingPlatform = () => {
  // State Management
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState('problems'); // problems, editor, submissions
  
  // Editor State
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  
  // Filters
  const [filters, setFilters] = useState({
    difficulty: 'All',
    status: 'All',
    tags: [],
    search: ''
  });

  // Mock comprehensive problem database
  const mockProblems = [
    {
      id: 'lc-1',
      title: '1. Two Sum',
      difficulty: 'Easy',
      platform: 'LeetCode',
      acceptance: 49.2,
      companies: ['Google', 'Amazon', 'Microsoft'],
      tags: ['Array', 'Hash Table'],
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

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
• 2 <= nums.length <= 10⁴
• -10⁹ <= nums[i] <= 10⁹
• -10⁹ <= target <= 10⁹
• Only one valid answer exists.`,
      publicTestCases: [
        { input: { nums: [2,7,11,15], target: 9 }, expected: [0,1], explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
        { input: { nums: [3,2,4], target: 6 }, expected: [1,2], explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
        { input: { nums: [3,3], target: 6 }, expected: [0,1], explanation: 'nums[0] + nums[1] = 3 + 3 = 6' }
      ],
      hiddenTestCases: [
        { input: { nums: [-1,-2,-3,-4,-5], target: -8 }, expected: [2,4] },
        { input: { nums: [0,4,3,0], target: 0 }, expected: [0,3] },
        { input: { nums: Array.from({length: 1000}, (_, i) => i), target: 1999 }, expected: [999, 1000] }
      ],
      hints: [
        'Use a hash map to store the numbers you\'ve seen so far',
        'For each number, check if target - number exists in the hash map',
        'Don\'t forget to store the index along with the value'
      ],
      starterCode: {
        javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
    
};`,
        python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
        cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
        java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`
      },
      solution: `// Optimal Solution - Hash Map Approach
// Time: O(n), Space: O(n)
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
};`
    },
    {
      id: 'lc-121',
      title: '121. Best Time to Buy and Sell Stock',
      difficulty: 'Easy',
      platform: 'LeetCode',
      acceptance: 54.1,
      companies: ['Facebook', 'Amazon', 'Bloomberg'],
      tags: ['Array', 'Dynamic Programming'],
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
Explanation: In this case, no transactions are done and the max profit = 0.

Constraints:
• 1 <= prices.length <= 10⁵
• 0 <= prices[i] <= 10⁴`,
      publicTestCases: [
        { input: [7,1,5,3,6,4], expected: 5, explanation: 'Buy at 1, sell at 6' },
        { input: [7,6,4,3,1], expected: 0, explanation: 'No profit possible' }
      ],
      hiddenTestCases: [
        { input: [2,4,1], expected: 2 },
        { input: [3,2,6,5,0,3], expected: 4 },
        { input: Array.from({length: 10000}, (_, i) => i), expected: 9999 }
      ],
      starterCode: {
        javascript: `/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    // Write your code here
    
};`
      }
    },
    {
      id: 'lc-3',
      title: '3. Longest Substring Without Repeating Characters',
      difficulty: 'Medium',
      platform: 'LeetCode',
      acceptance: 33.8,
      companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
      tags: ['Hash Table', 'String', 'Sliding Window'],
      description: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "bbbbb"
Output: 1
Explanation: The answer is "b", with the length of 1.

Example 3:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.

Constraints:
• 0 <= s.length <= 5 * 10⁴
• s consists of English letters, digits, symbols and spaces.`,
      publicTestCases: [
        { input: "abcabcbb", expected: 3, explanation: 'Substring "abc"' },
        { input: "bbbbb", expected: 1, explanation: 'Substring "b"' },
        { input: "pwwkew", expected: 3, explanation: 'Substring "wke"' }
      ],
      hiddenTestCases: [
        { input: "", expected: 0 },
        { input: " ", expected: 1 },
        { input: "dvdf", expected: 3 },
        { input: "tmmzuxt", expected: 5 }
      ],
      starterCode: {
        javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    // Write your code here
    
};`
      }
    }
  ];

  useEffect(() => {
    loadProblems();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, problems]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProblems(mockProblems);
      setFilteredProblems(mockProblems);
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...problems];

    if (filters.difficulty !== 'All') {
      filtered = filtered.filter(p => p.difficulty === filters.difficulty);
    }

    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredProblems(filtered);
  };

  const selectProblem = (problem) => {
    setSelectedProblem(problem);
    setCode(problem.starterCode[language] || '');
    setTestResults([]);
    setOutput('');
    setActiveView('editor');
    setActiveTab('description');
  };

  const runCode = async () => {
    if (!selectedProblem) return;
    
    setIsRunning(true);
    setOutput('Running public test cases...\n');
    setTestResults([]);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Execute code against public test cases
      const results = [];
      
      for (let i = 0; i < selectedProblem.publicTestCases.length; i++) {
        const testCase = selectedProblem.publicTestCases[i];
        
        try {
          const startTime = performance.now();
          
          // Create safe execution environment
          const func = new Function('input', `
            ${code}
            if (typeof twoSum !== 'undefined') return twoSum(input.nums || input, input.target);
            if (typeof maxProfit !== 'undefined') return maxProfit(input);
            if (typeof lengthOfLongestSubstring !== 'undefined') return lengthOfLongestSubstring(input);
            return null;
          `);
          
          const output = func(testCase.input);
          const endTime = performance.now();
          const executionTime = Math.round(endTime - startTime);
          
          const passed = JSON.stringify(output) === JSON.stringify(testCase.expected);
          
          results.push({
            testNumber: i + 1,
            type: 'Public',
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(testCase.expected),
            output: JSON.stringify(output),
            passed,
            executionTime,
            explanation: testCase.explanation
          });
        } catch (err) {
          results.push({
            testNumber: i + 1,
            type: 'Public',
            input: JSON.stringify(testCase.input),
            expected: JSON.stringify(testCase.expected),
            output: `Runtime Error: ${err.message}`,
            passed: false,
            executionTime: 0
          });
        }
      }
      
      setTestResults(results);
      
      const passedCount = results.filter(r => r.passed).length;
      const totalTests = results.length;
      
      let outputText = `✓ Public Test Cases: ${passedCount}/${totalTests} passed\n\n`;
      
      results.forEach(result => {
        outputText += `${result.passed ? '✓' : '✗'} Test Case ${result.testNumber}\n`;
        outputText += `  Input: ${result.input}\n`;
        outputText += `  Expected: ${result.expected}\n`;
        outputText += `  Output: ${result.output}\n`;
        outputText += `  Time: ${result.executionTime}ms\n\n`;
      });
      
      if (passedCount === totalTests) {
        outputText += `\n✓ All public tests passed! Click Submit to run against hidden test cases.`;
      } else {
        outputText += `\n✗ ${totalTests - passedCount} test(s) failed. Fix your code and try again.`;
      }
      
      setOutput(outputText);
      
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (!selectedProblem) return;
    
    // Check if public tests passed
    if (testResults.length === 0) {
      setOutput('⚠️ Please run your code first before submitting.');
      return;
    }
    
    const publicPassed = testResults.every(r => r.passed);
    if (!publicPassed) {
      setOutput('⚠️ All public test cases must pass before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    setOutput('Submitting solution...\nRunning against hidden test cases...\n');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Run against hidden test cases
      const allResults = [...testResults];
      
      for (let i = 0; i < selectedProblem.hiddenTestCases.length; i++) {
        const testCase = selectedProblem.hiddenTestCases[i];
        
        try {
          const startTime = performance.now();
          
          const func = new Function('input', `
            ${code}
            if (typeof twoSum !== 'undefined') return twoSum(input.nums || input, input.target);
            if (typeof maxProfit !== 'undefined') return maxProfit(input);
            if (typeof lengthOfLongestSubstring !== 'undefined') return lengthOfLongestSubstring(input);
            return null;
          `);
          
          const output = func(testCase.input);
          const endTime = performance.now();
          const executionTime = Math.round(endTime - startTime);
          
          const passed = JSON.stringify(output) === JSON.stringify(testCase.expected);
          
          allResults.push({
            testNumber: testResults.length + i + 1,
            type: 'Hidden',
            input: 'Hidden',
            expected: 'Hidden',
            output: passed ? 'Correct' : 'Wrong Answer',
            passed,
            executionTime
          });
        } catch (err) {
          allResults.push({
            testNumber: testResults.length + i + 1,
            type: 'Hidden',
            input: 'Hidden',
            expected: 'Hidden',
            output: 'Runtime Error',
            passed: false,
            executionTime: 0
          });
        }
      }
      
      setTestResults(allResults);
      
      const totalPassed = allResults.filter(r => r.passed).length;
      const totalTests = allResults.length;
      const allPassed = totalPassed === totalTests;
      
      const avgTime = Math.round(allResults.reduce((sum, r) => sum + r.executionTime, 0) / totalTests);
      const maxMemory = '42.3 MB'; // Mock memory usage
      
      let outputText = '';
      
      if (allPassed) {
        outputText = `
╔════════════════════════════════════╗
║         ✓ ACCEPTED!                ║
╚════════════════════════════════════╝

Status: Accepted
Test Cases Passed: ${totalPassed}/${totalTests}

Runtime: ${avgTime}ms (Beats 87.23% of submissions)
Memory: ${maxMemory} (Beats 75.45% of submissions)

Your submission has been accepted!
- All test cases passed
- No runtime errors
- Within time and memory limits

Points Earned: +${selectedProblem.difficulty === 'Easy' ? 10 : selectedProblem.difficulty === 'Medium' ? 20 : 30}
`;
      } else {
        const failedTest = allResults.find(r => !r.passed);
        outputText = `
╔════════════════════════════════════╗
║      ✗ WRONG ANSWER                ║
╚════════════════════════════════════╝

Status: Wrong Answer
Test Cases Passed: ${totalPassed}/${totalTests}

Failed on: Test Case #${failedTest.testNumber} (${failedTest.type})

Your code failed on one or more test cases.
Please review your logic and try again.
`;
      }
      
      setOutput(outputText);
      
    } catch (err) {
      setOutput(`Submission Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCode = () => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[language] || '');
      setTestResults([]);
      setOutput('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (activeView === 'problems') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Problems</h1>
              <p className="text-gray-400">Practice coding with real test cases and hidden test validation</p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                <Trophy className="inline mr-2" size={20} />
                Leaderboard
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
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

              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Solved">Solved</option>
                <option value="Attempted">Attempted</option>
                <option value="Todo">Todo</option>
              </select>
              
              <button
                onClick={() => setFilters({ difficulty: 'All', status: 'All', tags: [], search: '' })}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Problems Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Acceptance</th>
                  <th className="px-6 py-4 text-left">Difficulty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProblems.map((problem) => (
                  <tr
                    key={problem.id}
                    onClick={() => selectProblem(problem)}
                    className="hover:bg-gray-750 cursor-pointer transition"
                  >
                    <td className="px-6 py-4">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white hover:text-blue-400 transition">
                        {problem.title}
                      </div>
                      <div className="flex gap-2 mt-1">
                        {problem.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {problem.acceptance}%
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400'
                        : problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Editor View
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveView('problems')}
            className="flex items-center gap-2 hover:text-blue-400 transition"
          >
            <ChevronLeft size={20} />
            Back to Problems
          </button>
          <div className="w-px h-6 bg-gray-700"></div>
          <h2 className="font-semibold">{selectedProblem?.title}</h2>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
            Hints
          </button>
          <button className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition">
            Solutions
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* Left: Problem Description */}
        <div className="w-1/2 border-r border-gray-700 overflow-y-auto">
          <div className="p-6">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
              {['description', 'solutions', 'submissions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-2 font-semibold capitalize transition ${
                    activeTab === tab
                      ? 'text-white border-b-2 border-blue-500'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedProblem?.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400'
                    : selectedProblem?.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedProblem?.difficulty}
                  </span>
                  <span className="text-gray-400 text-sm">{selectedProblem?.acceptance}% Acceptance</span>
                </div>

                <div className="prose prose-invert max-w-none">
                  <pre className="text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedProblem?.description}
                  </pre>
                </div>

                {selectedProblem?.companies && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Companies</h3>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProblem.companies.map((company, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: Code Editor */}
        <div className="w-1/2 flex flex-col">
          {/* Editor Header */}
          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 px-3 py-1.5 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={resetCode}
                className="px-3 py-1.5 bg-gray-700 rounded hover:bg-gray-600 transition flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-gray-900">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full p-4 bg-gray-900 text-white font-mono text-sm resize-none focus:outline-none"
              spellCheck="false"
            />
          </div>

          {/* Output Panel */}
          <div className="h-1/3 border-t border-gray-700 bg-gray-800 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Output</h3>
                <div className="flex gap-2">
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-4 py-1.5 bg-green-600 rounded hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isRunning ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
                    Run
                  </button>
                  <button
                    onClick={submitCode}
                    disabled={isSubmitting}
                    className="px-4 py-1.5 bg-blue-600 rounded hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                    Submit
                  </button>
                </div>
              </div>

              {testResults.length > 0 ? (
                <div className="space-y-3">
                  {testResults.map((result, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border-2 ${
                        result.passed
                          ? 'bg-green-500/5 border-green-500/40'
                          : 'bg-red-500/5 border-red-500/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.passed ? (
                          <CheckCircle className="text-green-400 mt-0.5" size={20} />
                        ) : (
                          <XCircle className="text-red-400 mt-0.5" size={20} />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">
                              Test Case #{result.testNumber} ({result.type})
                            </span>
                            <span className="text-sm text-gray-400">{result.executionTime}ms</span>
                          </div>
                          {result.type === 'Public' && (
                            <>
                              <div className="text-sm space-y-1">
                                <div><span className="text-gray-400">Input:</span> <span className="font-mono text-blue-300">{result.input}</span></div>
                                <div><span className="text-gray-400">Expected:</span> <span className="font-mono text-green-400">{result.expected}</span></div>
                                <div><span className="text-gray-400">Output:</span> <span className={`font-mono ${result.passed ? 'text-green-400' : 'text-red-400'}`}>{result.output}</span></div>
                              </div>
                              {result.explanation && (
                                <div className="mt-2 text-xs text-gray-400 italic">{result.explanation}</div>
                              )}
                            </>
                          )}
                          {result.type === 'Hidden' && (
                            <div className="text-sm text-gray-400">
                              Hidden test case - {result.passed ? 'Passed ✓' : 'Failed ✗'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {output || 'Click "Run" to test your code against public test cases\nClick "Submit" to run against all test cases including hidden ones'}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteCodingPlatform;