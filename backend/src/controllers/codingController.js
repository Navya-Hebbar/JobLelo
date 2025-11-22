// backend/src/controllers/codingController.js
import axios from "axios";

export const getAllProblems = async (req, res) => {
  try {
    let allProblems = [];

    // --- Codeforces Problems ---
    try {
      const cfResponse = await axios.get("https://codeforces.com/api/problemset.problems");
      const cfProblems = cfResponse.data.result.problems.slice(0, 100).map(p => ({
        id: `cf-${p.contestId}-${p.index}`,
        title: p.name,
        platform: "Codeforces",
        difficulty: p.rating || "Unknown",
        link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
        tags: p.tags || []
      }));
      allProblems = [...allProblems, ...cfProblems];
    } catch (cfError) {
      console.error("Codeforces API error:", cfError.message);
    }

    // --- LeetCode Problems (Using GraphQL) ---
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
              }
            }
          }
        `,
        variables: {
          categorySlug: "",
          skip: 0,
          limit: 100,
          filters: {}
        }
      };

      const lcResponse = await axios.post(
        "https://leetcode.com/graphql",
        lcQuery,
        { 
          headers: { 
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0"
          } 
        }
      );

      if (lcResponse.data.data && lcResponse.data.data.problemsetQuestionList) {
        const lcProblems = lcResponse.data.data.problemsetQuestionList.questions.map(p => ({
          id: `lc-${p.titleSlug}`,
          title: `${p.frontendQuestionId}. ${p.title}`,
          platform: "LeetCode",
          difficulty: p.difficulty,
          link: `https://leetcode.com/problems/${p.titleSlug}/`,
          tags: p.topicTags ? p.topicTags.map(t => t.name).slice(0, 3) : [],
          acRate: Math.round(p.acRate)
        }));
        allProblems = [...allProblems, ...lcProblems];
      }
    } catch (lcError) {
      console.error("LeetCode API error:", lcError.message);
    }

    // --- HackerRank Problems (Mock data - as they don't have public API) ---
    const hrProblems = [
      {
        id: "hr-solve-me-first",
        title: "Solve Me First",
        platform: "HackerRank",
        difficulty: "Easy",
        link: "https://www.hackerrank.com/challenges/solve-me-first",
        tags: ["Warmup"]
      },
      {
        id: "hr-simple-array-sum",
        title: "Simple Array Sum",
        platform: "HackerRank",
        difficulty: "Easy",
        link: "https://www.hackerrank.com/challenges/simple-array-sum",
        tags: ["Arrays"]
      },
      {
        id: "hr-compare-triplets",
        title: "Compare the Triplets",
        platform: "HackerRank",
        difficulty: "Easy",
        link: "https://www.hackerrank.com/challenges/compare-the-triplets",
        tags: ["Arrays"]
      }
    ];
    allProblems = [...allProblems, ...hrProblems];

    // Sort by difficulty and platform
    allProblems.sort((a, b) => {
      const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
      const aDiff = typeof a.difficulty === 'number' ? 2 : difficultyOrder[a.difficulty] || 2;
      const bDiff = typeof b.difficulty === 'number' ? 2 : difficultyOrder[b.difficulty] || 2;
      return aDiff - bDiff;
    });

    res.status(200).json({ 
      success: true,
      problems: allProblems,
      count: allProblems.length
    });
  } catch (err) {
    console.error("Error fetching problems:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Server error while fetching problems." 
    });
  }
};

// Execute code (Basic implementation)
export const executeCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    // This is a mock implementation
    // In production, use a secure code execution service like:
    // - Judge0 API
    // - Sphere Engine
    // - AWS Lambda
    // - Docker containers with resource limits

    // Mock execution result
    const result = {
      success: true,
      output: "Execution output will appear here",
      executionTime: "45ms",
      memory: "2.5MB",
      testsPassed: 2,
      totalTests: 3
    };

    res.status(200).json(result);
  } catch (err) {
    console.error("Code execution error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to execute code" 
    });
  }
};

// Submit solution
export const submitSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user?.userId || 'guest';

    // In production, save to database
    // const submission = await Submission.create({
    //   userId,
    //   problemId,
    //   code,
    //   language,
    //   timestamp: new Date()
    // });

    res.status(200).json({
      success: true,
      message: "Solution submitted successfully",
      submissionId: Date.now()
    });
  } catch (err) {
    console.error("Submission error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to submit solution" 
    });
  }
};

// Get user's submissions
export const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user?.userId || 'guest';

    // In production, fetch from database
    // const submissions = await Submission.find({ userId }).sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      submissions: []
    });
  } catch (err) {
    console.error("Get submissions error:", err.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch submissions" 
    });
  }
};