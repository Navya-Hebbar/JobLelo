// backend/src/services/problemFetcher.js
// Create this new file for modular problem fetching

import axios from 'axios';

// LeetCode Problem Fetcher - Fetches ALL available problems
export const fetchLeetCodeProblems = async (maxProblems = 3000) => {
  const problems = [];
  const batchSize = 100;
  
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
                    id
                    slug
                  }
                  likes
                  dislikes
                  isPaidOnly
                  status
                  frequency
                  isFavor
                }
              }
            }
          `,
          variables: {
            categorySlug: "",
            skip: skip,
            limit: batchSize
          }
        };

        const response = await axios.post(
          "https://leetcode.com/graphql",
          query,
          { 
            headers: { 
              "Content-Type": "application/json",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              "Referer": "https://leetcode.com/problemset/all/",
              "Origin": "https://leetcode.com",
              "Accept": "application/json"
            },
            timeout: 15000
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
              status: p.status,
              frequency: p.frequency || 0,
              isFavorite: p.isFavor || false
            }));
          
          problems.push(...batch);
          console.log(`  ✓ Batch ${Math.floor(skip / batchSize) + 1}: ${batch.length} problems`);
          
          // If we got less than expected, we've reached the end
          if (batch.length < batchSize) {
            console.log(`  ℹ️ Reached end of LeetCode problems`);
            break;
          }
        }
        
        // Delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 300));
        
      } catch (batchError) {
        console.error(`  ✗ Batch ${Math.floor(skip / batchSize) + 1} failed:`, batchError.message);
        break;
      }
    }
    
    console.log(`✅ Total LeetCode problems fetched: ${problems.length}`);
    return problems;
    
  } catch (error) {
    console.error('❌ LeetCode fetch failed:', error.message);
    return [];
  }
};

// Codeforces Problem Fetcher - Fetches ALL problems
export const fetchCodeforcesProblems = async () => {
  try {
    console.log('📥 Fetching Codeforces problems...');
    
    const response = await axios.get(
      "https://codeforces.com/api/problemset.problems",
      { 
        timeout: 20000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        }
      }
    );
    
    if (response.data.status === 'OK') {
      const { problems: cfProblems, problemStatistics } = response.data.result;
      
      // Create a map of statistics
      const statsMap = new Map();
      if (problemStatistics) {
        problemStatistics.forEach(stat => {
          const key = `${stat.contestId}-${stat.index}`;
          statsMap.set(key, stat);
        });
      }
      
      const problems = cfProblems
        .filter(p => p.rating) // Only rated problems
        .map(p => {
          const key = `${p.contestId}-${p.index}`;
          const stats = statsMap.get(key) || {};
          
          return {
            id: `cf-${p.contestId}-${p.index}`,
            title: `${p.index}. ${p.name}`,
            platform: "Codeforces",
            difficulty: p.rating <= 1200 ? 'Easy' : p.rating <= 1800 ? 'Medium' : 'Hard',
            link: `https://codeforces.com/problemset/problem/${p.contestId}/${p.index}`,
            tags: p.tags || [],
            rating: p.rating,
            acceptance: stats.solvedCount && stats.solvedCount > 0 
              ? Math.round((stats.solvedCount / (stats.solvedCount + (stats.solvedCount * 2))) * 100) 
              : null,
            contestId: p.contestId,
            index: p.index,
            type: p.type || 'PROGRAMMING',
            points: p.points || null,
            solvedCount: stats.solvedCount || 0
          };
        });
      
      console.log(`✅ Total Codeforces problems fetched: ${problems.length}`);
      return problems;
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ Codeforces fetch failed:', error.message);
    return [];
  }
};

// AtCoder Problem Fetcher (via unofficial API)
export const fetchAtCoderProblems = async () => {
  try {
    console.log('📥 Fetching AtCoder problems...');
    
    // AtCoder problems list (unofficial API)
    const response = await axios.get(
      "https://kenkoooo.com/atcoder/resources/problems.json",
      { 
        timeout: 15000,
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      }
    );
    
    if (response.data && Array.isArray(response.data)) {
      const problems = response.data
        .slice(0, 500) // Limit to 500 most recent
        .map(p => ({
          id: `atcoder-${p.id}`,
          title: p.name || p.title,
          platform: "AtCoder",
          difficulty: 'Medium', // AtCoder doesn't have difficulty levels
          link: `https://atcoder.jp/contests/${p.contest_id}/tasks/${p.id}`,
          tags: [],
          contestId: p.contest_id,
          problemId: p.id,
          acceptance: null
        }));
      
      console.log(`✅ Total AtCoder problems fetched: ${problems.length}`);
      return problems;
    }
    
    return [];
    
  } catch (error) {
    console.error('❌ AtCoder fetch failed:', error.message);
    return [];
  }
};

// SPOJ Problem Fetcher (limited - no official API)
export const fetchSPOJProblems = async () => {
  try {
    console.log('📥 Fetching SPOJ problems...');
    
    // SPOJ doesn't have an official API
    // Using mock data for popular problems
    const problems = [
      {
        id: 'spoj-test',
        title: 'TEST - Life, the Universe, and Everything',
        platform: 'SPOJ',
        difficulty: 'Easy',
        link: 'https://www.spoj.com/problems/TEST/',
        tags: ['Tutorial'],
        acceptance: 89.5
      },
      {
        id: 'spoj-prime1',
        title: 'PRIME1 - Prime Generator',
        platform: 'SPOJ',
        difficulty: 'Easy',
        link: 'https://www.spoj.com/problems/PRIME1/',
        tags: ['Number Theory', 'Math'],
        acceptance: 35.2
      },
      {
        id: 'spoj-aggrcow',
        title: 'AGGRCOW - Aggressive cows',
        platform: 'SPOJ',
        difficulty: 'Medium',
        link: 'https://www.spoj.com/problems/AGGRCOW/',
        tags: ['Binary Search', 'Greedy'],
        acceptance: 42.1
      }
    ];
    
    console.log(`✅ Total SPOJ problems: ${problems.length} (mock data)`);
    return problems;
    
  } catch (error) {
    console.error('❌ SPOJ fetch failed:', error.message);
    return [];
  }
};

// Fetch ALL problems from all platforms
export const fetchAllProblems = async () => {
  console.log('\n🚀 Starting multi-platform problem fetch...\n');
  
  const startTime = Date.now();
  
  // Fetch from all platforms in parallel
  const [
    leetcodeProblems,
    codeforcesProblems,
    atcoderProblems,
    spojProblems
  ] = await Promise.all([
    fetchLeetCodeProblems(3000),
    fetchCodeforcesProblems(),
    fetchAtCoderProblems(),
    fetchSPOJProblems()
  ]);
  
  const allProblems = [
    ...leetcodeProblems,
    ...codeforcesProblems,
    ...atcoderProblems,
    ...spojProblems
  ];
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('\n✅ Multi-platform fetch complete!');
  console.log(`⏱️  Total time: ${duration}s`);
  console.log(`📊 Total problems: ${allProblems.length}`);
  console.log(`   - LeetCode: ${leetcodeProblems.length}`);
  console.log(`   - Codeforces: ${codeforcesProblems.length}`);
  console.log(`   - AtCoder: ${atcoderProblems.length}`);
  console.log(`   - SPOJ: ${spojProblems.length}\n`);
  
  return allProblems;
};

// Cache manager for problems
let problemCache = {
  data: [],
  lastFetch: null,
  isValid: function() {
    if (!this.lastFetch) return false;
    const hoursSinceLastFetch = (Date.now() - this.lastFetch) / (1000 * 60 * 60);
    return hoursSinceLastFetch < 24; // Cache for 24 hours
  }
};

export const getCachedOrFetchProblems = async () => {
  if (problemCache.isValid()) {
    console.log('✅ Using cached problems');
    return problemCache.data;
  }
  
  console.log('🔄 Cache expired or empty, fetching fresh data...');
  const problems = await fetchAllProblems();
  
  problemCache.data = problems;
  problemCache.lastFetch = Date.now();
  
  return problems;
};

export default {
  fetchLeetCodeProblems,
  fetchCodeforcesProblems,
  fetchAtCoderProblems,
  fetchSPOJProblems,
  fetchAllProblems,
  getCachedOrFetchProblems
};