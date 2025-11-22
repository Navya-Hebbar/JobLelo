// backend/src/controllers/codingController.js
import axios from "axios";
import Submission from "../models/Submission.js";
import problemFetcher from "../services/problemFetcher.js"; // Import the service

// NEW: Refresh problems manually
export const refreshProblems = async (req, res) => {
  try {
    console.log("🔄 Manually refreshing problem cache...");
    // Force fetch fresh data
    const problems = await problemFetcher.fetchAllProblems();
    
    res.status(200).json({
      success: true,
      message: "Problems refreshed successfully",
      count: problems.length
    });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to refresh problems",
      details: error.message
    });
  }
};

// Fetch problems (Updated to use service if preferred, or keep existing logic)
export const getAllProblems = async (req, res) => {
  try {
    // Use the cached fetcher for better performance
    const allProblems = await problemFetcher.getCachedOrFetchProblems();
    const { limit = 500, difficulty, tags, search } = req.query;

    let filteredProblems = [...allProblems];

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProblems = filteredProblems.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (difficulty && difficulty !== 'All') {
      filteredProblems = filteredProblems.filter(p => 
        p.difficulty.toLowerCase() === difficulty.toLowerCase()
      );
    }

    if (tags && tags.length > 0) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      filteredProblems = filteredProblems.filter(p => 
        tagsArray.some(tag => 
          p.tags.some(pTag => pTag.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    // Apply limit
    if (limit) {
      filteredProblems = filteredProblems.slice(0, parseInt(limit));
    }

    // Get stats
    const platformStats = filteredProblems.reduce((acc, p) => {
      acc[p.platform] = (acc[p.platform] || 0) + 1;
      return acc;
    }, {});

    const difficultyStats = filteredProblems.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    // Get all unique tags
    const allTags = [...new Set(filteredProblems.flatMap(p => p.tags))].sort();

    res.status(200).json({ 
      success: true,
      problems: filteredProblems,
      count: filteredProblems.length,
      statistics: {
        total: allProblems.length, // Total available in cache
        filtered: filteredProblems.length,
        platforms: platformStats,
        difficulties: difficultyStats,
        availableTags: allTags.slice(0, 100)
      }
    });
  } catch (err) {
    console.error("Error fetching problems:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch problems",
      details: err.message
    });
  }
};

// Get problem details with test cases
export const getProblemDetails = async (req, res) => {
  try {
    const { slug } = req.params;

    // Fetch from LeetCode GraphQL
    const query = {
      query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            title
            titleSlug
            content
            difficulty
            likes
            dislikes
            exampleTestcases
            topicTags {
              name
            }
            codeSnippets {
              lang
              langSlug
              code
            }
            sampleTestCase
            hints
          }
        }
      `,
      variables: { titleSlug: slug }
    };

    const response = await axios.post(
      "https://leetcode.com/graphql",
      query,
      { 
        headers: { 
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0"
        },
        timeout: 10000
      }
    );

    if (response.data.data?.question) {
      const problem = response.data.data.question;
      
      // Parse test cases from exampleTestcases
      const publicTestCases = [];
      if (problem.exampleTestcases) {
        const testLines = problem.exampleTestcases.split('\n');
        for (let i = 0; i < testLines.length; i += 2) {
          if (i + 1 < testLines.length) {
            publicTestCases.push({
              input: testLines[i],
              expected: testLines[i + 1]
            });
          }
        }
      }

      // Get starter code for each language
      const starterCode = {};
      problem.codeSnippets?.forEach(snippet => {
        starterCode[snippet.langSlug] = snippet.code;
      });

      res.status(200).json({
        success: true,
        problem: {
          id: problem.questionId,
          title: problem.title,
          slug: problem.titleSlug,
          description: problem.content,
          difficulty: problem.difficulty,
          tags: problem.topicTags?.map(t => t.name) || [],
          hints: problem.hints || [],
          starterCode,
          publicTestCases,
          likes: problem.likes,
          dislikes: problem.dislikes
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: "Problem not found"
      });
    }
  } catch (err) {
    console.error("Error fetching problem details:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch problem details"
    });
  }
};

// Run code (client-side execution with validation)
export const runCode = async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    // Security validation
    const dangerousPatterns = [
      /require\s*\(/gi,
      /import\s+(?!.*from\s+['"])/gi, // Allow import...from but not dynamic imports
      /eval\s*\(/gi,
      /child_process/gi,
      /fs\./gi,
      /process\.exit/gi,
      /while\s*\(\s*true\s*\)/gi // Infinite loops
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return res.status(400).json({
          success: false,
          error: "Code contains prohibited operations",
          detail: "Your code contains operations that are not allowed for security reasons"
        });
      }
    }

    // Return validation success
    res.status(200).json({
      success: true,
      message: "Code validated successfully",
      canExecute: true,
      executionMode: "client-side" // Execute in browser for safety
    });
  } catch (err) {
    console.error("Code validation error:", err.message);
    res.status(500).json({
      success: false,
      error: "Code validation failed"
    });
  }
};

// Submit solution
export const submitSolution = async (req, res) => {
  try {
    const { 
      problemId, 
      code, 
      language, 
      testResults,
      executionTime 
    } = req.body;
    
    const userId = req.user?.userId || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    // Validate required fields
    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields"
      });
    }

    // Calculate statistics
    const publicTests = testResults?.filter(r => r.type === 'Public') || [];
    const hiddenTests = testResults?.filter(r => r.type === 'Hidden') || [];
    const totalTests = testResults?.length || 0;
    const passedTests = testResults?.filter(r => r.passed).length || 0;
    const allPassed = totalTests > 0 && passedTests === totalTests;

    // Determine status
    let status = 'Wrong Answer';
    if (allPassed) {
      status = 'Accepted';
    } else if (testResults?.some(r => r.output?.includes('Runtime Error'))) {
      status = 'Runtime Error';
    } else if (executionTime > 5000) {
      status = 'Time Limit Exceeded';
    }

    // Calculate points based on difficulty and performance
    let points = 0;
    if (allPassed) {
      const basePoints = { Easy: 10, Medium: 20, Hard: 30 };
      const timeBonus = Math.max(0, 10 - Math.floor(executionTime / 100));
      points = (basePoints['Medium'] || 10) + timeBonus; // Default to Medium
    }

    // Create submission
    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testResults: testResults || [],
      totalTests,
      passedTests,
      executionTime: executionTime || 0,
      status,
      points
    });

    // Calculate user statistics
    const userSubmissions = await Submission.find({ userId });
    const acceptedSubmissions = userSubmissions.filter(s => s.status === 'Accepted');
    const uniqueProblemsSolved = new Set(acceptedSubmissions.map(s => s.problemId)).size;

    res.status(200).json({
      success: true,
      submission: {
        id: submission._id,
        status,
        passedTests,
        totalTests,
        points,
        timestamp: submission.timestamp
      },
      stats: {
        totalSubmissions: userSubmissions.length,
        acceptedSubmissions: acceptedSubmissions.length,
        problemsSolved: uniqueProblemsSolved,
        acceptanceRate: userSubmissions.length > 0 
          ? Math.round((acceptedSubmissions.length / userSubmissions.length) * 100) 
          : 0
      }
    });
  } catch (err) {
    console.error("Submission error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to submit solution"
    });
  }
};

// Get user submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user?.userId || req.userId;
    const { problemId, limit = 50 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    const query = { userId };
    if (problemId) query.problemId = problemId;

    const submissions = await Submission.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    // Calculate statistics
    const stats = {
      total: submissions.length,
      accepted: submissions.filter(s => s.status === 'Accepted').length,
      problemsSolved: new Set(
        submissions.filter(s => s.status === 'Accepted').map(s => s.problemId)
      ).size,
      languages: submissions.reduce((acc, s) => {
        acc[s.language] = (acc[s.language] || 0) + 1;
        return acc;
      }, {}),
      totalPoints: submissions.reduce((sum, s) => sum + (s.points || 0), 0),
      avgExecutionTime: submissions.length > 0
        ? Math.round(submissions.reduce((sum, s) => sum + s.executionTime, 0) / submissions.length)
        : 0
    };

    res.status(200).json({
      success: true,
      submissions: submissions.map(s => ({
        id: s._id,
        problemId: s.problemId,
        language: s.language,
        status: s.status,
        passedTests: s.passedTests,
        totalTests: s.totalTests,
        executionTime: s.executionTime,
        points: s.points,
        timestamp: s.timestamp
      })),
      stats
    });
  } catch (err) {
    console.error("Get submissions error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch submissions"
    });
  }
};

// Get global leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const { limit = 100, timeframe = 'all' } = req.query;

    // Build time filter
    let dateFilter = {};
    if (timeframe === 'week') {
      dateFilter.createdAt = { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) };
    } else if (timeframe === 'month') {
      dateFilter.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
    }

    const leaderboard = await Submission.aggregate([
      { $match: { status: 'Accepted', ...dateFilter } },
      {
        $group: {
          _id: '$userId',
          problemsSolved: { $addToSet: '$problemId' },
          totalSubmissions: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          avgExecutionTime: { $avg: '$executionTime' }
        }
      },
      {
        $project: {
          userId: '$_id',
          problemsSolved: { $size: '$problemsSolved' },
          totalSubmissions: 1,
          totalPoints: 1,
          avgExecutionTime: { $round: ['$avgExecutionTime', 0] }
        }
      },
      { $sort: { problemsSolved: -1, totalPoints: -1, avgExecutionTime: 1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: 1,
          username: { $arrayElemAt: [{ $split: ['$user.email', '@'] }, 0] },
          email: '$user.email',
          problemsSolved: 1,
          totalSubmissions: 1,
          totalPoints: 1,
          avgExecutionTime: 1
        }
      }
    ]);

    // Add ranks
    leaderboard.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    res.status(200).json({
      success: true,
      leaderboard,
      timeframe
    });
  } catch (err) {
    console.error("Leaderboard error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch leaderboard"
    });
  }
};

// Get user profile/stats
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.userId || req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Authentication required"
      });
    }

    const submissions = await Submission.find({ userId });
    const accepted = submissions.filter(s => s.status === 'Accepted');
    
    const stats = {
      totalSubmissions: submissions.length,
      acceptedSubmissions: accepted.length,
      problemsSolved: new Set(accepted.map(s => s.problemId)).size,
      acceptanceRate: submissions.length > 0
        ? Math.round((accepted.length / submissions.length) * 100)
        : 0,
      totalPoints: submissions.reduce((sum, s) => sum + (s.points || 0), 0),
      languages: submissions.reduce((acc, s) => {
        acc[s.language] = (acc[s.language] || 0) + 1;
        return acc;
      }, {}),
      recentActivity: submissions.slice(0, 10).map(s => ({
        problemId: s.problemId,
        status: s.status,
        timestamp: s.timestamp
      }))
    };

    // Get rank
    const allUsers = await Submission.aggregate([
      { $match: { status: 'Accepted' } },
      {
        $group: {
          _id: '$userId',
          problemsSolved: { $addToSet: '$problemId' }
        }
      },
      {
        $project: {
          userId: '$_id',
          problemsSolved: { $size: '$problemsSolved' }
        }
      },
      { $sort: { problemsSolved: -1 } }
    ]);

    const userRank = allUsers.findIndex(u => u.userId.toString() === userId.toString()) + 1;

    res.status(200).json({
      success: true,
      profile: {
        ...stats,
        rank: userRank,
        totalUsers: allUsers.length
      }
    });
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile"
    });
  }
};

export default {
  getAllProblems,
  refreshProblems, // Added to default export
  getProblemDetails,
  runCode,
  submitSolution,
  getUserSubmissions,
  getLeaderboard,
  getUserProfile
};