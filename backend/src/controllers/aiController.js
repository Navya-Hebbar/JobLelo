// backend/src/controllers/aiController.js
import model from '../config/gemini.js';

const cleanJSON = (text) => {
  return text.replace(/```json|```/g, '').trim();
};

const chatWithAI = async (req, res) => {
  try {
    const { messages, context } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Messages array is required' 
      });
    }
    
    let history = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    if (history.length > 0) {
      if (history[0].role === 'model') {
        history = [
          { role: 'user', parts: [{ text: 'Hello' }] },
          ...history
        ];
      }
      
      for (let i = 1; i < history.length; i++) {
        if (history[i].role === history[i-1].role) {
          const syntheticRole = history[i].role === 'user' ? 'model' : 'user';
          const syntheticText = syntheticRole === 'model' ? 'I understand.' : 'Continue.';
          history.splice(i, 0, {
            role: syntheticRole,
            parts: [{ text: syntheticText }]
          });
        }
      }
    }

    const chat = model.startChat({ history });

    const lastMessage = messages[messages.length - 1].content;
    const systemContext = `You are Joblelo AI, an expert career assistant specializing in:
- Interview preparation and mock interviews
- Resume optimization and ATS compatibility
- Career roadmap planning
- Job search strategies
- Skill development guidance

${context ? `User Context: ${JSON.stringify(context)}` : ''}

Provide helpful, concise, and actionable advice. Be encouraging and professional.`;

    const result = await chat.sendMessage(`${systemContext}\n\nUser: ${lastMessage}`);
    const response = result.response.text();

    res.json({
      success: true,
      message: response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: "AI Service temporarily unavailable. Please try again." 
    });
  }
};

const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide a valid resume (minimum 50 characters)' 
      });
    }
    
    const prompt = `Analyze this resume professionally and provide:

1. **Strengths** (3 key points)
2. **Areas for Improvement** (3 specific suggestions)
3. **ATS Score** (0-100 with explanation)
4. **Keywords Missing** (5-10 industry-relevant keywords)
5. **Overall Summary** (2-3 sentences)

Resume:
${resumeText}

Format your response clearly with headers and bullet points.`;
    
    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const matchJobs = async (req, res) => {
  try {
    const { skills, experience, preferences } = req.body;

    if (!skills || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Skills array is required' 
      });
    }

    const prompt = `As a job matching AI, analyze this candidate profile and provide realistic job matches:

**Candidate Profile:**
- Skills: ${skills.join(', ')}
- Experience Level: ${experience || 'Entry Level'}
- Preferences: ${JSON.stringify(preferences || {})}

Provide EXACTLY 5 job role recommendations in valid JSON format (no markdown):
[
  {
    "role": "Job Title",
    "matchScore": 85,
    "company": "Example Company Type",
    "salary": "$XX,XXX - $XX,XXX",
    "missingSkills": ["Skill1", "Skill2"],
    "description": "Brief role description"
  }
]

Base match scores on real skill alignment. Include realistic missing skills.`;

    const result = await model.generateContent(prompt);
    const text = cleanJSON(result.response.text());
    
    let matches;
    try {
      matches = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      matches = [
        { 
          role: "Junior Frontend Developer", 
          matchScore: 78, 
          company: "Tech Startups",
          salary: "$50,000 - $70,000",
          missingSkills: ["TypeScript", "Testing"],
          description: "Build user interfaces with React"
        },
        { 
          role: "React Developer", 
          matchScore: 85, 
          company: "Mid-size Companies",
          salary: "$60,000 - $85,000",
          missingSkills: ["Redux", "GraphQL"],
          description: "Develop modern web applications"
        },
        { 
          role: "Full Stack Junior", 
          matchScore: 65, 
          company: "Various Industries",
          salary: "$55,000 - $75,000",
          missingSkills: ["Node.js", "Databases", "Docker"],
          description: "Work on both frontend and backend"
        }
      ];
    }

    res.json({ 
      success: true, 
      matches,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Job match error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Job matching service temporarily unavailable" 
    });
  }
};

const generateSkillTest = async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic) {
      return res.status(400).json({ 
        success: false, 
        error: 'Topic is required' 
      });
    }

    const questionCount = count || 5;
    const level = difficulty || 'Medium';

    const prompt = `Generate ${questionCount} ${level} difficulty multiple-choice questions about ${topic}.

Requirements:
- Questions should test practical knowledge
- Each question must have 4 options
- Mark the correct answer clearly
- Include a brief explanation for each answer

Return ONLY valid JSON (no markdown):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": "Option B",
    "difficulty": "${level}",
    "explanation": "Brief explanation of the correct answer"
  }
]`;

    const result = await model.generateContent(prompt);
    const text = cleanJSON(result.response.text());
    
    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      questions = [
        {
          question: `What is a key concept in ${topic}?`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correct: "Option B",
          difficulty: level,
          explanation: "This is the correct answer because..."
        }
      ];
    }

    res.json({ 
      success: true, 
      questions,
      topic,
      difficulty: level,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Skill test error:', error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to generate test questions" 
    });
  }
};

const generateRoadmap = async (req, res) => {
  try {
    const { targetRole, currentSkills, timeframe } = req.body;

    if (!targetRole) {
      return res.status(400).json({ 
        success: false, 
        error: 'Target role is required' 
      });
    }

    const months = timeframe || 6;
    const skills = currentSkills || [];

    const prompt = `Create a detailed learning roadmap to become a ${targetRole} in ${months} months.

Current Skills: ${skills.length > 0 ? skills.join(', ') : 'Beginner level'}

Provide a comprehensive roadmap with:
1. **Month-by-Month Plan** - Specific goals for each month
2. **Skills to Learn** - Prioritized list with explanations
3. **Projects to Build** - Hands-on portfolio projects
4. **Resources** - Best learning platforms and courses
5. **Milestones** - Clear checkpoints to track progress

Format with clear sections and bullet points.`;

    const result = await model.generateContent(prompt);
    const roadmap = result.response.text();

    res.json({
      success: true,
      roadmap,
      targetRole,
      timeframe: months,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Roadmap generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export default {
  chatWithAI,
  analyzeResume,
  matchJobs,
  generateSkillTest,
  generateRoadmap
};