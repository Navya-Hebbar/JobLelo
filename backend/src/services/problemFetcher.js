// backend/src/services/problemFetcher.js
import axios from 'axios';

// --- FALLBACK DATA (Used if live API fails) ---
const LEETCODE_FALLBACK = [
  {
    id: 'lc-1',
    questionId: '1',
    title: '1. Two Sum',
    platform: 'LeetCode',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/two-sum/',
    tags: ['Array', 'Hash Table'],
    acceptance: 49.2,
    slug: 'two-sum',
    likes: 45000,
    dislikes: 1500,
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target."
  },
  {
    id: 'lc-2',
    questionId: '2',
    title: '2. Add Two Numbers',
    platform: 'LeetCode',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/add-two-numbers/',
    tags: ['Linked List', 'Math', 'Recursion'],
    acceptance: 40.1,
    slug: 'add-two-numbers',
    likes: 28000,
    dislikes: 5400
  },
  {
    id: 'lc-3',
    questionId: '3',
    title: '3. Longest Substring Without Repeating Characters',
    platform: 'LeetCode',
    difficulty: 'Medium',
    link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    acceptance: 33.8,
    slug: 'longest-substring-without-repeating-characters',
    likes: 36000,
    dislikes: 1600
  },
  {
    id: 'lc-20',
    questionId: '20',
    title: '20. Valid Parentheses',
    platform: 'LeetCode',
    difficulty: 'Easy',
    link: 'https://leetcode.com/problems/valid-parentheses/',
    tags: ['String', 'Stack'],
    acceptance: 40.3,
    slug: 'valid-parentheses',
    likes: 21000,
    dislikes: 1200
  },
  {
    id: 'lc-42',
    questionId: '42',
    title: '42. Trapping Rain Water',
    platform: 'LeetCode',
    difficulty: 'Hard',
    link: 'https://leetcode.com/problems/trapping-rain-water/',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming'],
    acceptance: 59.1,
    slug: 'trapping-rain-water',
    likes: 29000,
    dislikes: 400
  }
];

// LeetCode Problem Fetcher
export const fetchLeetCodeProblems = async (maxProblems = 50) => {
  const problems = [];
  const batchSize = 50; // Reduced batch size to be less aggressive
  
  try {
    console.log('📥 Fetching LeetCode problems...');
    
    for (let skip = 0; skip < maxProblems; skip += batchSize) {
      try {
        const query = {
          query: `
            query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int) {
              problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
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
                }
              }
            }
          `,
          variables: {
            categorySlug: "", // Empty usually defaults to 'all'
            skip: skip,
            limit: batchSize
          }
        };

        // Add realistic headers to avoid bot detection
        const response = await axios.post(
          "https://leetcode.com/graphql",
          query,
          { 
            headers: { 
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Referer": "https://leetcode.com/problemset/all/",
              "Origin": "https://leetcode.com",
              "Accept-Language": "en-US,en;q=0.9"
            },
            timeout: 10000
          }
        );

        if (response.data.data?.problemsetQuestionList?.questions) {
          const batch = response.data.data.problemsetQuestionList.questions
            .filter(p => !p.isPaidOnly)
            .map(p => ({
              id: `lc-${p.titleSlug}`,
              questionId: p.frontendQuestionId,
              title: `${p.frontendQuestionId}. ${p.title}`,
              platform: "LeetCode",
              difficulty: p.difficulty,
              link: `https://leetcode.com/problems/${p.titleSlug}/`,
              tags: p.topicTags ? p.topicTags.map(t => t.name) : [],
              acceptance: Math.round(p.acRate * 10) / 10,
              likes: p.likes || 0,
              dislikes: p.dislikes || 0,
              slug: p.titleSlug,
              status: null
            }));
          
          problems.push(...batch);
          console.log(`  ✓ Batch ${Math.floor(skip / batchSize) + 1}: ${batch.length} problems fetched`);
          
          if (batch.length < batchSize) break; // End of list
        }
        
        // Polite delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (batchError) {
        console.error(`  ✗ LeetCode batch failed (likely rate limited):`, batchError.message);
        break; // Stop fetching if blocked to prevent spamming errors
      }
    }
    
    // CHECK: If fetch failed (0 problems), use fallback
    if (problems.length === 0) {
      console.log("⚠️ Live fetch returned 0 problems. Using fallback data.");
      return LEETCODE_FALLBACK;
    }
    
    console.log(`✅ Total LeetCode problems: ${problems.length}`);
    return problems;
    
  } catch (error) {
    console.error('❌ LeetCode fetch critical error:', error.message);
    return LEETCODE_FALLBACK; // Use fallback on critical error
  }
};

// Codeforces Problem Fetcher
export const fetchCodeforcesProblems = async () => {
  try {
    console.log('📥 Fetching Codeforces problems...');
    
    const response = await axios.get(
      "https://codeforces.com/api/problemset.problems",
      { 
        timeout: 15000,
        headers: { "User-Agent": "Mozilla/5.0" }
      }
    );
    
    if (response.data.status === 'OK') {
      // Limit to top 50 to keep db size manageable for demo
      const problems = response.data.result.problems
        .slice(0, 50)
        .map(p => ({
          id: `cf-${p.contestId}-${p.index}`,
          title: `${p.index}. ${p.name}`,
          platform: "Codeforces",
          difficulty: (p.rating || 0) <= 1200 ? 'Easy' : (p.rating || 0) <= 1800 ? 'Medium' : 'Hard',
          link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
          tags: p.tags || [],
          rating: p.rating,
          slug: `${p.contestId}/${p.index}`, // Simple identifier
          acceptance: null
        }));
      
      console.log(`✅ Fetched ${problems.length} Codeforces problems`);
      return problems;
    }
    return [];
  } catch (error) {
    console.error('❌ Codeforces fetch failed:', error.message);
    return [];
  }
};

// Fetch ALL
export const fetchAllProblems = async () => {
  console.log('\n🚀 Starting problem refresh (LeetCode & Codeforces)...\n');
  
  // Only fetch LeetCode and Codeforces as requested
  const [lc, cf] = await Promise.all([
    fetchLeetCodeProblems(100), // Try to get 100
    fetchCodeforcesProblems()
  ]);
  
  const all = [...lc, ...cf];
  
  console.log(`\n🏁 Refresh complete! Total: ${all.length} problems available.`);
  return all;
};

// Simple Cache
let problemCache = {
  data: [],
  lastFetch: null
};

export const getCachedOrFetchProblems = async () => {
  if (problemCache.data.length > 0) {
    console.log('✅ Serving problems from cache');
    return problemCache.data;
  }
  
  const problems = await fetchAllProblems();
  problemCache.data = problems;
  problemCache.lastFetch = Date.now();
  return problems;
};

export default {
  fetchLeetCodeProblems,
  fetchCodeforcesProblems,
  fetchAllProblems,
  getCachedOrFetchProblems
};