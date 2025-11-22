// backend/src/controllers/codingController.js
import axios from "axios";
import Submission from "../models/Submission.js";

// Fetch problems from multiple platforms
export const getAllProblems = async (req, res) => {
  try {
    let allProblems = [];
    const { limit = 500, difficulty, tags, search } = req.query;

    // --- LeetCode Problems (All Available - Multiple API Calls) ---
    try {
      const leetcodeProblems = [];
      const batchSize = 100;
      const maxProblems = parseInt(limit);
      
      // Fetch in batches to get more problems
      for (let skip = 0; skip < maxProblems && skip < 3000; skip += batchSize) {
        try {
          const lcQuery = {
            query: `
              query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
                problemsetQuestionList: questionList(
                  categorySlug: $categorySlug
                  limit: $limit
                  skip: $skip
                  filters: $filters
                ) {
                  total: totalNum
                  questions: data {
                    acRate
                    difficulty
                    frontendQuestionId: questionFrontendId
                    title
                    titleSlug
                    topicTags {
                      name
                      slug
                    }
                    likes
                    dislikes
                    isPaidOnly
                    status
                  }
                }
              }
            `,
            variables: {
              categorySlug: "",
              skip: skip,
              limit: batchSize,
              filters: difficulty ? { difficulty: difficulty.toUpperCase() } : {}
            }
          };

          const lcResponse = await axios.post(
            "https://leetcode.com/graphql",
            lcQuery,
            { 
              headers: { 
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                "Referer": "https://leetcode.com/problemset/all/",
                "Origin": "https://leetcode.com"
              },
              timeout: 15000
            }
          );

          if (lcResponse.data.data?.problemsetQuestionList?.questions) {
            const batch = lcResponse.data.data.problemsetQuestionList.questions
              .filter(p => !p.isPaidOnly) // Only free problems
              .map(p => ({
                id: `lc-${p.titleSlug}`,
                title: `${p.frontendQuestionId}. ${p.title}`,
                platform: "LeetCode",
                difficulty: p.difficulty,
                link: `https://leetcode.com/problems/${p.titleSlug}/`,
                tags: p.topicTags ? p.topicTags.map(t => t.name) : [],
                acceptance: Math.round(p.acRate * 10) / 10,
                likes: p.likes,
                dislikes: p.dislikes,
                slug: p.titleSlug,
                status: p.status || null
              }));
            
            leetcodeProblems.push(...batch);
            
            // If we got less than batchSize, we've reached the end
            if (batch.length < batchSize) break;
          }
          
          // Small delay between requests to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
          
        } catch (batchError) {
          console.error(`LeetCode batch error (skip ${skip}):`, batchError.message);
          break;
        }
      }
      
      allProblems = [...allProblems, ...leetcodeProblems];
      console.log(`✓ Fetched ${leetcodeProblems.length} LeetCode problems`);
      
    } catch (lcError) {
      console.error("LeetCode API error:", lcError.message);
    }

    // --- Codeforces Problems (All Available) ---
    try {
      const cfResponse = await axios.get(
        "https://codeforces.com/api/problemset.problems",
        { 
          timeout: 15000,
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
          }
        }
      );
      
      if (cfResponse.data.status === 'OK') {
        const cfProblems = cfResponse.data.result.problems
          .filter(p => p.rating) // Only problems with ratings
          .map(p => ({
            id: `cf-${p.contestId}-${p.index}`,
            title: `${p.index}. ${p.name}`,
            platform: "Codeforces",
            difficulty: p.rating <= 1200 ? 'Easy' : p.rating <= 1800 ? 'Medium' : 'Hard',
            link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
            tags: p.tags || [],
            rating: p.rating,
            acceptance: null,
            contestId: p.contestId,
            index: p.index
          }));
        
        allProblems = [...allProblems, ...cfProblems];
        console.log(`✓ Fetched ${cfProblems.length} Codeforces problems`);
      }
    } catch (cfError) {
      console.error("Codeforces API error:", cfError.message);
    }

    // --- HackerRank Problems (Via Web Scraping - Mock for now) ---
    try {
      // HackerRank doesn't have a public API
      // You would need to implement web scraping or use their private API
      const hrMockProblems = [
        {
          id: "hr-solve-me-first",
          title: "Solve Me First",
          platform: "HackerRank",
          difficulty: "Easy",
          link: "https://www.hackerrank.com/challenges/solve-me-first",
          tags: ["Warmup", "Basic"],
          acceptance: 95.5
        },
        {
          id: "hr-simple-array-sum",
          title: "Simple Array Sum",
          platform: "HackerRank",
          difficulty: "Easy",
          link: "https://www.hackerrank.com/challenges/simple-array-sum",
          tags: ["Arrays", "Basic"],
          acceptance: 92.3
        },
        {
          id: "hr-compare-triplets",
          title: "Compare the Triplets",
          platform: "HackerRank",
          difficulty: "Easy",
          link: "https://www.hackerrank.com/challenges/compare-the-triplets",
          tags: ["Arrays", "Implementation"],
          acceptance: 89.7
        }
      ];
      
      allProblems = [...allProblems, ...hrMockProblems];
      console.log(`✓ Added ${hrMockProblems.length} HackerRank problems (mock data)`);
      
    } catch (hrError) {
      console.error("HackerRank API error:", hrError.message);
    }

    // --- GeeksforGeeks Problems (Mock - No public API) ---
    try {
      const gfgMockProblems = [
        {
          id: "gfg-reverse-array",
          title: "Reverse an Array",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          link: "https://practice.geeksforgeeks.org/problems/reverse-an-array",
          tags: ["Array", "Two Pointers"],
          acceptance: 78.4
        },
        {
          id: "gfg-largest-element",
          title: "Largest Element in Array",
          platform: "GeeksforGeeks",
          difficulty: "Easy",
          link: "https://practice.geeksforgeeks.org/problems/largest-element-in-array",
          tags: ["Array"],
          acceptance: 82.1
        }
      ];
      
      allProblems = [...allProblems, ...gfgMockProblems];
      console.log(`✓ Added ${gfgMockProblems.length} GeeksforGeeks problems (mock data)`);
      
    } catch (gfgError) {
      console.error("GeeksforGeeks error:", gfgError.message);
    }

    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      allProblems = allProblems.filter(p => 
        p.title.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    if (tags && tags.length > 0) {
      const tagsArray = Array.isArray(tags) ? tags : [tags];
      allProblems = allProblems.filter(p => 
        tagsArray.some(tag => 
          p.tags.some(pTag => pTag.toLowerCase().includes(tag.toLowerCase()))
        )
      );
    }

    // Sort: Easy first, then by platform preference (LeetCode > Codeforces > Others)
    allProblems.sort((a, b) => {
      const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
      const aDiff = diffOrder[a.difficulty] || 2;
      const bDiff = diffOrder[b.difficulty] || 2;
      
      if (aDiff !== bDiff) return aDiff - bDiff;
      
      // Platform priority
      const platformOrder = { LeetCode: 1, Codeforces: 2, HackerRank: 3, GeeksforGeeks: 4 };
      return (platformOrder[a.platform] || 5) - (platformOrder[b.platform] || 5);
    });

    // Remove duplicates based on title similarity
    const uniqueProblems = [];
    const seenTitles = new Set();
    
    for (const problem of allProblems) {
      const normalizedTitle = problem.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueProblems.push(problem);
      }
    }

    // Get platform statistics
    const platformStats = uniqueProblems.reduce((acc, p) => {
      acc[p.platform] = (acc[p.platform] || 0) + 1;
      return acc;
    }, {});

    // Get difficulty statistics
    const difficultyStats = uniqueProblems.reduce((acc, p) => {
      acc[p.difficulty] = (acc[p.difficulty] || 0) + 1;
      return acc;
    }, {});

    // Get all unique tags
    const allTags = [...new Set(uniqueProblems.flatMap(p => p.tags))].sort();

    res.status(200).json({ 
      success: true,
      problems: uniqueProblems,
      count: uniqueProblems.length,
      statistics: {
        total: uniqueProblems.length,
        platforms: platformStats,
        difficulties: difficultyStats,
        availableTags: allTags.slice(0, 100) // Top 100 tags
      },
      message: `Successfully fetched ${uniqueProblems.length} problems from ${Object.keys(platformStats).length} platforms`
    });
  } catch (err) {
    console.error("Error fetching problems:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch problems from external platforms",
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
  getProblemDetails,
  runCode,
  submitSolution,
  getUserSubmissions,
  getLeaderboard,
  getUserProfile
};