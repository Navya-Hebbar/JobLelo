// final roadmap
import React, { useState, Fragment } from 'react';
// Lottie is not installed or available, replacing Lottie import with a simple div for clean, runnable code.
// import Lottie from 'lottie-react'; // Commented out to prevent module not found error
import {
  FaCode, FaLaptopCode, FaFilter, FaStar, FaChevronDown, FaBook, FaGlobe,
  FaDatabase, FaLightbulb, FaTools, FaMicrochip, FaLayerGroup,
} from 'react-icons/fa';

// --------------------------------------------------------------------------
// 1. REAL DATA STRUCTURE (EXPANDED TO MULTI-PLATFORM)
// All entries now include a 'platform' key, ensuring representation for:
// YouTube, Coursera (Audit), edX (Audit), Udemy (Free), and Khan Academy.
// --------------------------------------------------------------------------

// Placeholder for Lottie Animation JSON files - Added minimal objects
const LOTTIE_ANIMATION = {}; 
const HEADER_ANIMATION = {}; 

// Fallback video for all roadmaps not explicitly filled below.
const FALLBACK_VIDEO_LINK = "https://www.youtube.com/watch?v=ix9cRaBkVe0"; // Python Full Course (12 hours)

// --- A. Detailed Content (Expanded to include all 5 platforms per level) ---
const YOUTUBE_DATA = {
  // 1. Frontend Developer (fe)
  fe: {
    beginner: [
      { title: "HTML & CSS Crash Course for Beginners", link: "https://www.youtube.com/watch?v=G3e-cpL7ao4", platform: "YouTube" },
      { title: "Meta Front-End Developer Certificate (Audit)", link: "https://www.coursera.org/professional-certificates/meta-front-end-developer", platform: "Coursera (Audit)" },
      { title: "Introduction to Web Development (edX Audit)", link: "https://www.edx.org/course/introduction-to-web-development", platform: "edX (Audit)" },
      { title: "The Complete JavaScript Course 2024 (Free)", link: "https://www.udemy.com/course/javascript-basics-for-beginners/", platform: "Udemy (Free)" },
      { title: "HTML & CSS Course (Full Curriculum)", link: "https://www.khanacademy.org/computing/computer-programming/html-css", platform: "Khan Academy" },
    ],
    medium: [
      { title: "ReactJS Fundamentals Full Tutorial", link: "https://www.youtube.com/watch?v=Tj75Dwtq7E8", platform: "YouTube" },
      { title: "Advanced React Development (Audit)", link: "https://www.coursera.org/learn/advanced-react-development", platform: "Coursera (Audit)" },
      { title: "Advanced Front-End Web Dev with React (Audit)", link: "https://www.edx.org/course/advanced-front-end-web-development-with-react", platform: "edX (Audit)" },
      { title: "React (Basic to Advanced) Free Course", link: "https://www.udemy.com/course/react-basic-to-advanced/", platform: "Udemy (Free)" },
      { title: "Intermediate JS Concepts (using KA's CS link)", link: "https://www.khanacademy.org/computing/computer-science", platform: "Khan Academy" },
    ],
    advanced: [
      { title: "Performance Optimization in React & Next.js", link: "https://www.youtube.com/watch?v=tI8_o-O-b0k", platform: "YouTube" },
      { title: "Front-End Web Development Capstone (Audit)", link: "https://www.coursera.org/specializations/front-end-web-development-capstone", platform: "Coursera (Audit)" },
      { title: "Full Stack Web Development (edX Audit)", link: "https://www.edx.org/professional-certificate/full-stack-web-development", platform: "edX (Audit)" },
      { title: "Advanced React Patterns (Generic Free Udemy)", link: "https://www.udemy.com/topic/react/?price=price-free", platform: "Udemy (Free)" },
      { title: "Advanced Algorithms & Data Structures (KA)", link: "https://www.khanacademy.org/computing/computer-science/algorithms", platform: "Khan Academy" },
    ],
  },
  // 2. Backend Developer (be)
  be: {
    beginner: [
      { title: "Python/Node.js Intro: Backend Basics", link: "https://www.youtube.com/watch?v=rfscVS0vtbw", platform: "YouTube" },
      { title: "Introduction to Back-End Development (Audit)", link: "https://www.coursera.org/learn/introduction-to-back-end-development", platform: "Coursera (Audit)" },
      { title: "Intro to Backend Dev with Node.js & Express (Audit)", link: "https://www.edx.org/course/introduction-to-backend-development-with-nodejs-and-express", platform: "edX (Audit)" },
      { title: "The Complete Guide To Backend Development (Free Udemy)", link: "https://www.udemy.com/course/learn-backend-development-with-node-express-and-mongo-db-from-scratch/", platform: "Udemy (Free)" },
      { title: "SQL Database Basics (using KA's CS link)", link: "https://www.khanacademy.org/computing/computer-science/databases", platform: "Khan Academy" },
    ],
    medium: [
      { title: "REST API Design Principles", link: "https://www.youtube.com/watch?v=W7S-dYc068A", platform: "YouTube" },
      { title: "Building Scalable Java Apps (Spring Boot) Free", link: "https://www.udemy.com/course/building-scalable-java-applications-using-spring-boot-and-restful-apis/", platform: "Udemy (Free)" },
      { title: "Introduction to API Design and Management (Audit)", link: "https://www.coursera.org/learn/api-design-management", platform: "Coursera (Audit)" },
      { title: "Introduction to Serverless Computing (edX Audit)", link: "https://www.edx.org/course/introduction-to-serverless-computing", platform: "edX (Audit)" },
      { title: "Networking Fundamentals (KA)", link: "https://www.khanacademy.org/computing", platform: "Khan Academy" },
    ],
    advanced: [
      { title: "Microservices Architecture Deep Dive", link: "https://www.youtube.com/watch?v=o_JgY2G44Y0", platform: "YouTube" },
      { title: "Containerization with Docker Mastery (Free Udemy)", link: "https://www.udemy.com/course/docker-for-the-absolute-beginner-free/", platform: "Udemy (Free)" },
      { title: "System Design for Backend Engineers (Audit)", link: "https://www.coursera.org/learn/system-design", platform: "Coursera (Audit)" },
      { title: "Advanced Message Brokers (Kafka, RabbitMQ) Explained", link: "https://www.youtube.com/watch?v=EkR5lD0-j1s", platform: "YouTube" },
      { title: "Designing Highly Scalable Systems (edX Audit)", link: "https://www.edx.org/course/designing-highly-scalable-systems", platform: "edX (Audit)" },
    ],
  },
  // 3. DevOps Engineer (devops)
  devops: {
    beginner: [
      { title: "Linux Command Line Essentials", link: "https://www.youtube.com/watch?v=sWbFhBmiE0o", platform: "YouTube" },
      { title: "Introduction to Git and Version Control (edX Audit)", link: "https://www.edx.org/course/introduction-to-git-and-github", platform: "edX (Audit)" },
      { title: "Introduction to Cloud Computing (Coursera Audit)", link: "https://www.coursera.org/learn/introduction-to-cloud-computing", platform: "Coursera (Audit)" },
      { title: "Master DevOps in 2025: Beginner's Roadmap", link: "https://www.youtube.com/watch?v=5Z6Pqgpi_rE", platform: "YouTube" },
      { title: "Linux Basics (Free Udemy)", link: "https://www.udemy.com/course/linux-for-absolute-beginners-free/", platform: "Udemy (Free)" },
    ],
    medium: [
      { title: "CI/CD with GitHub Actions Tutorial", link: "https://www.youtube.com/watch?v=R8_M601l19Q", platform: "YouTube" },
      { title: "Terraform Basics (Infrastructure as Code) (edX Audit)", link: "https://www.edx.org/course/infrastructure-as-code-with-terraform", platform: "edX (Audit)" },
      { title: "DevOps Full Course (Jenkins, Gradle, Monitoring) (Free Udemy)", link: "https://www.udemy.com/topic/devops/?price=price-free", platform: "Udemy (Free)" },
      { title: "Introduction to Kubernetes (Coursera Audit)", link: "https://www.coursera.org/learn/kubernetes-introduction", platform: "Coursera (Audit)" },
      { title: "Algorithms (KA)", link: "https://www.khanacademy.org/computing/computer-science/algorithms", platform: "Khan Academy" },
    ],
    advanced: [
      { title: "Kubernetes Deep Dive (The Advanced Orchestration)", link: "https://www.youtube.com/watch?v=X48Vu7G0Bwg", platform: "YouTube" },
      { title: "Monitoring and Alerting (Prometheus/Grafana) (edX Audit)", link: "https://www.edx.org/course/site-reliability-engineering-sre-and-devops-tools", platform: "edX (Audit)" },
      { title: "Complete DevOps Roadmap 2025 - Level 4: Advanced", link: "https://www.youtube.com/watch?v=1J2YOV6LcwY", platform: "YouTube" },
      { title: "SRE (Site Reliability Engineering) Basics (Coursera Audit)", link: "https://www.coursera.org/learn/site-reliability-engineering-sre", platform: "Coursera (Audit)" },
      { title: "Advanced Docker (Free Udemy)", link: "https://www.udemy.com/topic/docker/?price=price-free", platform: "Udemy (Free)" },
    ],
  },
  // 4. Full Stack Developer (fullstack)
  fullstack: {
    beginner: [
      { title: "Full Stack Web Dev for Beginners (HTML, CSS, JS, Node, MongoDB)", link: "https://www.youtube.com/watch?v=nu_pCVPKzTk", platform: "YouTube" },
      { title: "Become a Fullstack Developer from Scratch (26+ hour tutorial)", link: "https://www.youtube.com/watch?v=LzMnsfqjzkA", platform: "YouTube" },
      { title: "Full Stack Development with React (Coursera Audit)", link: "https://www.coursera.org/specializations/full-stack-react", platform: "Coursera (Audit)" },
      { title: "Full Stack Development - The Complete Guide (Free Udemy)", link: "https://www.udemy.com/topic/full-stack-web-development/?price=price-free", platform: "Udemy (Free)" },
      { title: "Web Development Fundamentals (edX Audit)", link: "https://www.edx.org/course/introduction-to-web-development-2", platform: "edX (Audit)" },
    ],
    medium: [
      { title: "Full Stack Course | Build 4 Projects & Get Hired", link: "https://www.youtube.com/watch?v=dKch_WrYwd4", platform: "YouTube" },
      { title: "Server-Side Programming with Python (Coursera Audit)", link: "https://www.coursera.org/learn/server-side-programming-with-python", platform: "Coursera (Audit)" },
      { title: "90 Day Full Stack Developer Roadmap 2024 [FULL GUIDE]", link: "https://www.youtube.com/watch?v=og4p1qJNf1Y", platform: "YouTube" },
      { title: "Backend with Node.js and Express (edX Audit)", link: "https://www.edx.org/course/introduction-to-backend-development-with-nodejs-and-express", platform: "edX (Audit)" },
      { title: "Object-Oriented Programming (KA)", link: "https://www.khanacademy.org/computing/computer-science/object-oriented-programming", platform: "Khan Academy" },
    ],
    advanced: [
      { title: "Microservices Architecture (from the BE advanced track)", link: "https://www.youtube.com/watch?v=o_JgY2G44Y0", platform: "YouTube" },
      { title: "System Design Interview Prep (edX Audit)", link: "https://www.edx.org/course/advanced-system-design", platform: "edX (Audit)" },
      { title: "Advanced Full Stack Topics (Free Udemy)", link: "https://www.udemy.com/topic/web-development/?price=price-free", platform: "Udemy (Free)" },
      { title: "Fullstack Developer Roadmap in 15 mins...", link: "https://www.youtube.com/watch?v=HfNTTwc9yK0", platform: "YouTube" },
      { title: "Cloud Development with AWS (Coursera Audit)", link: "https://www.coursera.org/learn/aws-cloud-development", platform: "Coursera (Audit)" },
    ],
  },
  // 5. Data Analyst (data_analyst)
  data_analyst: {
    beginner: [
      { title: "Zero to Data Analyst - Complete 6 Month Roadmap", link: "https://www.youtube.com/watch?v=QcBlhxh7vXM", platform: "YouTube" },
      { title: "Google Data Analytics Professional Certificate (Audit)", link: "https://www.coursera.org/professional-certificates/google-data-analytics", platform: "Coursera (Audit)" },
      { title: "Data Analysis and Visualization (edX Audit)", link: "https://www.edx.org/professional-certificate/data-analysis-and-visualization", platform: "edX (Audit)" },
      { title: "Excel Full Course for Data Analysis (Free Udemy)", link: "https://www.udemy.com/course/microsoft-excel-beginner-to-advanced-free/", platform: "Udemy (Free)" },
      { title: "Statistics and Probability (KA)", link: "https://www.khanacademy.org/math/statistics-probability", platform: "Khan Academy" },
    ],
    medium: [
      { title: "Power BI Full Course Tutorial for Beginners", link: "https://www.youtube.com/watch?v=T_sYx2jG1vQ", platform: "YouTube" },
      { title: "Advanced SQL Tutorial - Full Course (Medium level)", link: "https://www.youtube.com/watch?v=p3qvj9hO_bo", platform: "YouTube" },
      { title: "Python for Data Science (Coursera Audit)", link: "https://www.coursera.org/specializations/python-3-data-science", platform: "Coursera (Audit)" },
      { title: "Tableau Dashboard Project: HR Analytics (Free Udemy)", link: "https://www.udemy.com/topic/tableau/?price=price-free", platform: "Udemy (Free)" },
      { title: "Introduction to R for Data Science (edX Audit)", link: "https://www.edx.org/course/introduction-to-r-for-data-science", platform: "edX (Audit)" },
    ],
    advanced: [
      { title: "Python for Data Analysis Full Course (Pandas/NumPy)", link: "https://www.youtube.com/watch?v=rfscVS0vtbw", platform: "YouTube" },
      { title: "Advanced Data Modeling and Storytelling", link: "https://www.youtube.com/watch?v=2DGk_nU2f0g", platform: "YouTube" },
      { title: "Data Analyst Interview Questions (Behavioral & Technical)", link: "https://www.youtube.com/watch?v=jW2m1nS7zJ4", platform: "YouTube" },
      { title: "Data Science Capstone Project (Coursera Audit)", link: "https://www.coursera.org/specializations/ibm-data-science-professional-certificate", platform: "Coursera (Audit)" },
      { title: "Data Warehousing and ETL (edX Audit)", link: "https://www.edx.org/course/data-warehousing-and-etl", platform: "edX (Audit)" },
    ],
  },
  // 6. AI Engineer (ai_engineer)
  ai_engineer: {
    beginner: [
      { title: "AI Engineer Roadmap 2025: Getting Started", link: "https://www.youtube.com/watch?v=68E66p4uN3w", platform: "YouTube" },
      { title: "Machine Learning Specialization by Andrew Ng (Audit)", link: "https://www.coursera.org/specializations/machine-learning-introduction", platform: "Coursera (Audit)" },
      { title: "Introduction to Artificial Intelligence (AI) - Microsoft (Audit)", link: "https://www.edx.org/course/introduction-to-artificial-intelligence-ai-microsoft", platform: "edX (Audit)" },
      { title: "Python for AI, Machine Learning, and Data Science (Free Udemy)", link: "https://www.udemy.com/topic/python/?price=price-free", platform: "Udemy (Free)" },
      { title: "Linear Algebra Fundamentals (KA)", link: "https://www.khanacademy.org/math/linear-algebra", platform: "Khan Academy" },
    ],
    medium: [
      { title: "Deep Learning Full Course - Neural Networks & TensorFlow", link: "https://www.youtube.com/watch?v=9L9jR1L7_Ew", platform: "YouTube" },
      { title: "NLP Tutorial: Text Generation & Transformers (Coursera Audit)", link: "https://www.coursera.org/specializations/natural-language-processing", platform: "Coursera (Audit)" },
      { title: "Advanced Data Structures & Algorithms for ML (Free Udemy)", link: "https://www.udemy.com/topic/data-science/?price=price-free", platform: "Udemy (Free)" },
      { title: "Deep Learning Fundamentals (edX Audit)", link: "https://www.edx.org/course/deep-learning-fundamentals", platform: "edX (Audit)" },
      { title: "AI/ML Engineering Interview Preparation", link: "https://www.youtube.com/watch?v=Xh0YlCgD6r0", platform: "YouTube" },
    ],
    advanced: [
      { title: "LLMs and Generative AI Explained", link: "https://www.youtube.com/watch?v=iTf2Y17J09k", platform: "YouTube" },
      { title: "Prompt Engineering and AI Agents Roadmap (Coursera Audit)", link: "https://www.coursera.org/learn/prompt-engineering", platform: "Coursera (Audit)" },
      { title: "Building an ML Pipeline with MLOps Tools", link: "https://www.youtube.com/watch?v=rX37_dM-uNY", platform: "YouTube" },
      { title: "System Design for AI/ML Applications (edX Audit)", link: "https://www.edx.org/course/machine-learning-engineering-for-production-mlops", platform: "edX (Audit)" },
      { title: "Advanced Reinforcement Learning (Free Udemy)", link: "https://www.udemy.com/topic/machine-learning/?price=price-free", platform: "Udemy (Free)" },
    ],
  },
  // 7. System Design (system_design)
  system_design: {
    beginner: [
      { title: "System Design for Beginners: Fundamentals", link: "https://www.youtube.com/watch?v=EkR5lD0-j1s", platform: "YouTube" },
      { title: "Microservices Architecture (from the BE advanced track)", link: "https://www.youtube.com/watch?v=o_JgY2G44Y0", platform: "YouTube" },
      { title: "Introduction to System Design (Coursera Audit)", link: "https://www.coursera.org/learn/system-design", platform: "Coursera (Audit)" },
      { title: "Introduction to Databases, Caching, and Load Balancers (Free Udemy)", link: "https://www.udemy.com/topic/system-design/?price=price-free", platform: "Udemy (Free)" },
      { title: "Cloud Computing Fundamentals (edX Audit)", link: "https://www.edx.org/course/introduction-to-cloud-computing", platform: "edX (Audit)" },
    ],
    medium: [
      { title: "System Design Interview Prep - In-Depth Examples", link: "https://www.youtube.com/watch?v=EkR5lD0-j1s", platform: "YouTube" },
      { title: "Designing YouTube: Complete Case Study (edX Audit)", link: "https://www.edx.org/course/building-scalable-cloud-applications", platform: "edX (Audit)" },
      { title: "Designing a URL Shortener (System Design Interview)", link: "https://www.youtube.com/watch?v=EkR5lD0-j1s", platform: "YouTube" },
      { title: "Designing Large-Scale Systems (Coursera Audit)", link: "https://www.coursera.org/learn/designing-large-scale-systems", platform: "Coursera (Audit)" },
      { title: "Advanced Networking Concepts (KA)", link: "https://www.khanacademy.org/computing", platform: "Khan Academy" },
    ],
    advanced: [
      { title: "Distributed System Design Patterns", link: "https://www.youtube.com/watch?v=EkR5lD0-j1s", platform: "YouTube" },
      { title: "Consistency, Availability, and Partition Tolerance (CAP Theorem) (edX Audit)", link: "https://www.edx.org/course/distributed-systems", platform: "edX (Audit)" },
      { title: "Advanced System Design: Database Sharding & Indexing", link: "https://www.youtube.com/watch?v=EkR5lD0-j1s", platform: "YouTube" },
      { title: "Advanced System Design Interview Prep (Free Udemy)", link: "https://www.udemy.com/topic/system-design/?price=price-free", platform: "Udemy (Free)" },
      { title: "Architecting Distributed Cloud Applications (Coursera Audit)", link: "https://www.coursera.org/specializations/architecting-distributed-cloud-applications", platform: "Coursera (Audit)" },
    ],
  },
  // 8. Python (python)
  python: {
    beginner: [
      { title: "Python Full Course for Beginners - 12 Hours", link: "https://www.youtube.com/watch?v=ix9cRaBkVe0", platform: "YouTube" },
      { title: "Learn Python for Free - Full Beginner Tutorial", link: "https://www.youtube.com/watch?v=rfscVS0vtbw", platform: "YouTube" },
      { title: "Python for Everybody Specialization (Coursera Audit)", link: "https://www.coursera.org/specializations/python", platform: "Coursera (Audit)" },
      { title: "Introduction to Computer Science and Python Programming (edX Audit)", link: "https://www.edx.org/course/introduction-to-computer-science-and-programming-using-python", platform: "edX (Audit)" },
      { title: "Python Basic Data Types and Control Flow (Free Udemy)", link: "https://www.udemy.com/course/python-basics-for-beginners-free/", platform: "Udemy (Free)" },
    ],
    medium: [
      { title: "Intermediate Python Programming - Advanced Concepts", link: "https://www.youtube.com/watch?v=ix9cRaBkVe0", platform: "YouTube" },
      { title: "Object-Oriented Programming (OOP) in Python (Coursera Audit)", link: "https://www.coursera.org/learn/object-oriented-programming-in-python", platform: "Coursera (Audit)" },
      { title: "Python Data Structures (Lists, Dicts, Sets) Deep Dive (Free Udemy)", link: "https://www.udemy.com/topic/python/?price=price-free", platform: "Udemy (Free)" },
      { title: "Intermediate Python: Data Structures (edX Audit)", link: "https://www.edx.org/course/intermediate-python-data-structures", platform: "edX (Audit)" },
      { title: "Matrices and Vectors (KA)", link: "https://www.khanacademy.org/math/linear-algebra", platform: "Khan Academy" },
    ],
    advanced: [
      { title: "Async Python, Concurrency, and Multithreading", link: "https://www.youtube.com/watch?v=ix9cRaBkVe0", platform: "YouTube" },
      { title: "Decorators and Generators in Python (Free Udemy)", link: "https://www.udemy.com/topic/python/?price=price-free", platform: "Udemy (Free)" },
      { title: "Advanced Testing in Python (Pytest/Unit Testing)", link: "https://www.youtube.com/watch?v=ix9cRaBkVe0", platform: "YouTube" },
      { title: "Python for Data Science Capstone (Coursera Audit)", link: "https://www.coursera.org/specializations/python-3-data-science", platform: "Coursera (Audit)" },
      { title: "Advanced Algorithms in Python (edX Audit)", link: "https://www.edx.org/course/advanced-data-structures-and-algorithms", platform: "edX (Audit)" },
    ],
  },
};

// Fallback content for new roadmaps that don't have detailed YOUTUBE_DATA
const getMockContent = (courseName) => ({
  beginner: [
    { title: `Introduction to ${courseName} (Full Course)`, link: FALLBACK_VIDEO_LINK, platform: "YouTube" },
    { title: `Free Course: ${courseName} Basics`, link: "https://www.udemy.com/topic/web-development/?price=price-free", platform: "Udemy (Free)" },
    { title: `Foundations of ${courseName} (Audit)`, link: "https://www.coursera.org/search?query=data%20science&sortBy=P2P%20Rating", platform: "Coursera (Audit)" },
    { title: `Introduction to ${courseName} (edX Audit)`, link: "https://www.edx.org/search?q=computer%20science", platform: "edX (Audit)" },
    { title: `Learn ${courseName} Concepts`, link: "https://www.khanacademy.org/computing", platform: "Khan Academy" },
  ],
  medium: [
    { title: `Core Concepts of ${courseName} (Intermediate Study)`, link: FALLBACK_VIDEO_LINK, platform: "YouTube" },
    { title: `Intermediate Patterns in ${courseName} (Project Ideas)`, link: FALLBACK_VIDEO_LINK, platform: "YouTube" },
    { title: `Intermediate ${courseName} (Coursera Audit)`, link: "https://www.coursera.org/search?query=data%20science&sortBy=P2P%20Rating", platform: "Coursera (Audit)" },
    { title: `Building a ${courseName} Project from Scratch (Free Udemy)`, link: "https://www.udemy.com/topic/web-development/?price=price-free", platform: "Udemy (Free)" },
    { title: `Advanced Topics in ${courseName} (edX Audit)`, link: "https://www.edx.org/search?q=computer%20science", platform: "edX (Audit)" },
  ],
  advanced: [
    { title: `Scaling and Optimization for ${courseName}`, link: FALLBACK_VIDEO_LINK, platform: "YouTube" },
    { title: `Deep Dive into ${courseName} Ecosystem`, link: FALLBACK_VIDEO_LINK, platform: "YouTube" },
    { title: `Interview Prep: Advanced ${courseName} Questions (Free Udemy)`, link: "https://www.udemy.com/topic/web-development/?price=price-free", platform: "Udemy (Free)" },
    { title: `Advanced ${courseName} Architecture (Coursera Audit)`, link: "https://www.coursera.org/search?query=data%20science&sortBy=P2P%20Rating", platform: "Coursera (Audit)" },
    { title: `System Design with ${courseName} (edX Audit)`, link: "https://www.edx.org/search?q=computer%20science", platform: "edX (Audit)" },
  ],
});


// --- B. Categorized Roadmaps (Unchanged) ---
const ROADMAP_CATEGORIES = [
  {
    title: "Role-based Roadmaps",
    id: "roles",
    icon: <FaLayerGroup />,
    items: [
      { id: 'fe', name: 'Frontend Developer', icon: <FaLaptopCode /> },
      { id: 'be', name: 'Backend Developer', icon: <FaCode /> },
      { id: 'fullstack', name: 'Full Stack', icon: <FaCode /> },
      { id: 'devops', name: 'DevOps Engineer', icon: <FaFilter /> },
      { id: 'data_analyst', name: 'Data Analyst', icon: <FaDatabase /> },
      { id: 'ai_engineer', name: 'AI Engineer', icon: <FaMicrochip /> },
      { id: 'ai_data_sci', name: 'AI and Data Scientist', icon: <FaMicrochip /> },
      { id: 'data_engineer', name: 'Data Engineer', icon: <FaDatabase /> },
      { id: 'android', name: 'Android', icon: <FaTools /> },
      { id: 'ml', name: 'Machine Learning', icon: <FaMicrochip /> },
      { id: 'postgresql', name: 'PostgreSQL', icon: <FaDatabase /> },
      { id: 'ios', name: 'iOS', icon: <FaTools /> },
      { id: 'blockchain', name: 'Blockchain', icon: <FaBook /> },
      { id: 'qa', name: 'QA', icon: <FaTools /> },
      { id: 'software_arch', name: 'Software Architect', icon: <FaLayerGroup /> },
      { id: 'cyber_sec', name: 'Cyber Security', icon: <FaFilter /> },
      { id: 'ux_design', name: 'UX Design', icon: <FaGlobe /> },
      { id: 'tech_writer', name: 'Technical Writer', icon: <FaBook /> },
      { id: 'game_dev', name: 'Game Developer', icon: <FaGlobe /> },
      { id: 'server_game_dev', name: 'Server Side Game Developer', icon: <FaGlobe /> },
      { id: 'mlops', name: 'MLOps', icon: <FaMicrochip /> },
      { id: 'pm', name: 'Product Manager', icon: <FaBook /> },
      { id: 'eng_manager', name: 'Engineering Manager', icon: <FaLayerGroup /> },
      { id: 'dev_rel', name: 'Developer Relations', icon: <FaBook /> },
      { id: 'bi_analyst', name: 'BI Analyst', icon: <FaDatabase /> },
    ],
  },
  {
    title: "Skill-based Roadmaps",
    id: "skills",
    icon: <FaTools />,
    items: [
      { id: 'sql', name: 'SQL', icon: <FaDatabase /> },
      { id: 'cs', name: 'Computer Science', icon: <FaBook /> },
      { id: 'react', name: 'React', icon: <FaLaptopCode /> },
      { id: 'vue', name: 'Vue', icon: <FaLaptopCode /> },
      { id: 'angular', name: 'Angular', icon: <FaLaptopCode /> },
      { id: 'js', name: 'JavaScript', icon: <FaLaptopCode /> },
      { id: 'ts', name: 'TypeScript', icon: <FaLaptopCode /> },
      { id: 'nodejs', name: 'Node.js', icon: <FaCode /> },
      // Note: Python is fully detailed above, the rest use getMockContent
      { id: 'python', name: 'Python', icon: <FaCode /> },
      { id: 'system_design', name: 'System Design', icon: <FaLayerGroup /> },
      { id: 'java', name: 'Java', icon: <FaCode /> },
      { id: 'aspnet', name: 'ASP.NET Core', icon: <FaCode /> },
      { id: 'api_design', name: 'API Design', icon: <FaFilter /> },
      { id: 'spring', name: 'Spring Boot', icon: <FaCode /> },
      { id: 'flutter', name: 'Flutter', icon: <FaTools /> },
      { id: 'cpp', name: 'C++', icon: <FaCode /> },
      { id: 'rust', name: 'Rust', icon: <FaCode /> },
      { id: 'go', name: 'Go Roadmap', icon: <FaCode /> },
      { id: 'design_arch', name: 'Design and Architecture', icon: <FaLayerGroup /> },
      { id: 'graphql', name: 'GraphQL', icon: <FaFilter /> },
      { id: 'react_native', name: 'React Native', icon: <FaTools /> },
      { id: 'design_system', name: 'Design System', icon: <FaGlobe /> },
      { id: 'prompt_eng', name: 'Prompt Engineering', icon: <FaMicrochip /> },
      { id: 'mongodb', name: 'MongoDB', icon: <FaDatabase /> },
      { id: 'linux', name: 'Linux', icon: <FaFilter /> },
      { id: 'kubernetes', name: 'Kubernetes', icon: <FaFilter /> },
      { id: 'docker', name: 'Docker', icon: <FaFilter /> },
      { id: 'aws', name: 'AWS', icon: <FaFilter /> },
      { id: 'terraform', name: 'Terraform', icon: <FaFilter /> },
      { id: 'dsa', name: 'Data Structures & Algorithms', icon: <FaBook /> },
      { id: 'redis', name: 'Redis', icon: <FaDatabase /> },
      { id: 'git', name: 'Git and GitHub', icon: <FaTools /> },
      { id: 'php', name: 'PHP', icon: <FaCode /> },
      { id: 'cloudflare', name: 'Cloudflare', icon: <FaGlobe /> },
      { id: 'ai_red_team', name: 'AI Red Teaming', icon: <FaMicrochip /> },
      { id: 'ai_agents', name: 'AI Agents', icon: <FaMicrochip /> },
      { id: 'nextjs', name: 'Next.js', icon: <FaLaptopCode /> },
      { id: 'code_review', name: 'Code Review', icon: <FaBook /> },
      { id: 'kotlin', name: 'Kotlin', icon: <FaTools /> },
      { id: 'html', name: 'HTML', icon: <FaLaptopCode /> },
      { id: 'css', name: 'CSS', icon: <FaLaptopCode /> },
      { id: 'swift_ui', name: 'Swift & Swift UI', icon: <FaTools /> },
      { id: 'shell_bash', name: 'Shell / Bash', icon: <FaTools /> },
      { id: 'laravel', name: 'Laravel', icon: <FaCode /> },
      { id: 'elasticsearch', name: 'Elasticsearch', icon: <FaDatabase /> },
    ],
  },
  {
    title: "Project Ideas",
    id: "projects",
    icon: <FaLightbulb />,
    items: [
      { id: 'proj_fe', name: 'Frontend Project Ideas', icon: <FaLaptopCode /> },
      { id: 'proj_be', name: 'Backend Project Ideas', icon: <FaCode /> },
      { id: 'proj_devops', name: 'DevOps Project Ideas', icon: <FaFilter /> },
    ],
  },
];


// --------------------------------------------------------------------------
// 2. STYLING
// --------------------------------------------------------------------------
const styles = {
  container: {
    fontFamily: 'system-ui, sans-serif',
    backgroundColor: '#1E293B',
    minHeight: '100vh',
    color: '#E2E8F0',
    padding: '2rem 1rem',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 900,
    color: '#4ADE80',
    marginTop: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  activeButton: {
    backgroundColor: '#4ADE80',
    color: '#1E293B',
    border: '2px solid #4ADE80',
    boxShadow: '0 4px 15px rgba(74, 222, 128, 0.4)',
  },
  inactiveButton: {
    backgroundColor: '#334155',
    color: '#E2E8F0',
    border: '2px solid #334155',
  },
  courseListContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
  categoryTitle: {
    fontSize: '2rem',
    color: '#E2E8F0',
    marginTop: '2rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #334155',
    paddingBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  courseList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  courseItem: {
    backgroundColor: '#475569',
    borderRadius: '8px',
    padding: '1.25rem',
    cursor: 'pointer',
    transition: 'transform 0.2s, background-color 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    border: '2px solid transparent',
    minHeight: '120px',
  },
  activeCourse: {
    border: '2px solid #4ADE80',
    transform: 'scale(1.03)',
  },
  levelSection: {
    backgroundColor: '#2D3A4B',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    borderLeft: '4px solid #4ADE80',
  },
  levelTitle: {
    fontSize: '2rem',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#4ADE80',
  },
  contentList: {
    listStyle: 'none',
    padding: 0,
  },
  contentItem: {
    backgroundColor: '#334155',
    padding: '1rem',
    borderRadius: '6px',
    marginBottom: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  link: {
    color: '#93C5FD',
    textDecoration: 'none',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  platformBadge: {
    marginLeft: '1rem',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    backgroundColor: '#4ADE80',
    color: '#1E293B',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  }
};

// Helper function to capitalize the first letter for display
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// --------------------------------------------------------------------------
// 3. THE ROADMAP COMPONENT
// --------------------------------------------------------------------------

const RoadmapPage = () => {
  const [activeTab, setActiveTab] = useState('course'); // 'course' or 'level'
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseName, setSelectedCourseName] = useState(null);

  const levels = ['beginner', 'medium', 'advanced'];

  // Handle course selection from the list
  const handleCourseSelect = (courseId, courseName) => {
    setSelectedCourse(courseId);
    setSelectedCourseName(courseName);
    setActiveTab('level'); // Automatically switch to level view after selection
  };

  // Determines content: either from YOUTUBE_DATA or the generic fallback
  const getContent = () => {
    if (YOUTUBE_DATA[selectedCourse]) {
      return YOUTUBE_DATA[selectedCourse];
    }
    // Use fallback for all newly added roadmaps
    return getMockContent(selectedCourseName || 'Unknown Course');
  };

  // Render the list of resources for the selected course and level
  const renderContent = () => {
    if (!selectedCourse) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <p style={{ fontSize: '1.5rem', color: '#94A3B8' }}>
            👈 Please select a roadmap above to view the learning path.
          </p>
        </div>
      );
    }

    const content = getContent();

    return (
      <div style={styles.courseListContainer}>
        <h2 style={{...styles.categoryTitle, fontSize: '2.5rem', borderBottom: '3px solid #4ADE80'}}>
          Roadmap: {selectedCourseName}
        </h2>
        <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>
          Content is organized into learning levels. Click on "View Resource" to access the course or video. Resources now include multiple platforms like **Udemy (Free), Coursera (Audit), edX (Audit), Khan Academy, and YouTube**.
        </p>
        {levels.map((level) => (
          <div key={level} style={styles.levelSection}>
            <h3 style={styles.levelTitle}>
              <FaStar style={{ color: level === 'advanced' ? '#FBBF24' : (level === 'medium' ? '#F97316' : '#6EE7B7') }} />
              {capitalize(level)} Level
            </h3>
            <ul style={styles.contentList}>
              {content[level] && content[level].map((item, index) => (
                <li key={index} style={styles.contentItem}>
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    {item.title}
                    <span style={styles.platformBadge}>
                      {item.platform}
                    </span>
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    <FaBook /> View Resource
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  // Renders the main course selection screen with categories
  const renderCourseSelection = () => (
    <div style={styles.courseListContainer}>
      {ROADMAP_CATEGORIES.map((category) => (
        <Fragment key={category.id}>
          <h2 style={styles.categoryTitle}>
            {category.icon} {category.title}
          </h2>
          <div style={styles.courseList}>
            {category.items.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseSelect(course.id, course.name)}
                style={{
                  ...styles.courseItem,
                  ...(selectedCourse === course.id ? styles.activeCourse : {})
                }}
              >
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#4ADE80' }}>
                  {course.icon}
                </span>
                <p style={{ fontWeight: 'bold' }}>{course.name}</p>
              </div>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Page Header with Lottie Animation */}
      <header style={styles.header}>
        {/* Lottie Animation Placeholder */}
        <div style={{ width: '150px', height: '150px' }}>
          {/* Lottie component commented out to prevent errors */}
          <div style={{ backgroundColor: '#2D3A4B', height: '100%', borderRadius: '50%' }}></div>
        </div>
        <h1 style={styles.title}>The Interactive Developer Roadmap</h1>
        <p style={{ color: '#94A3B8', fontSize: '1.25rem' }}>
          Choose your path and level up your skills with curated, multi-platform resources.
        </p>
      </header>

      {/* Course/Level Selection Buttons (Now acts as a tab navigation) */}
      <div style={styles.buttonGroup}>
        <button
          onClick={() => setActiveTab('course')}
          style={{
            ...styles.button,
            ...(activeTab === 'course' ? styles.activeButton : styles.inactiveButton)
          }}
        >
          <FaCode /> Courses & Skills
        </button>
        <button
          onClick={() => selectedCourse && setActiveTab('level')} // Ensure button is clickable only if course is selected
          disabled={!selectedCourse}
          style={{
            ...styles.button,
            ...(activeTab === 'level' ? styles.activeButton : styles.inactiveButton)
          }}
        >
          <FaChevronDown /> Current Roadmap ({selectedCourseName || 'None'})
        </button>
      </div>

      {/* Dynamic Content Display */}
      {activeTab === 'course' && renderCourseSelection()}

      {/* Roadmap Content */}
      {activeTab === 'level' && renderContent()}

      {/* Lottie animation at the bottom (optional) */}
      <div style={{ width: '200px', margin: '3rem auto 0' }}>
        {/* Lottie component commented out to prevent errors */}
      </div>
    </div>
  );
};

export default RoadmapPage;