// backend/src/routes/codingRoutes.js
import express from "express";
import { 
  getAllProblems,
  refreshProblems,      // NEW
  getProblemDetails, 
  runCode,
  submitSolution, 
  getUserSubmissions,
  getLeaderboard,
  getUserProfile
} from "../controllers/codingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/problems", getAllProblems);
router.get("/problems/:slug", getProblemDetails);
router.get("/leaderboard", getLeaderboard);
router.post("/refresh", refreshProblems);  // NEW - Manual refresh

// Protected routes
router.post("/run", authMiddleware, runCode);
router.post("/submit", authMiddleware, submitSolution);
router.get("/submissions", authMiddleware, getUserSubmissions);
router.get("/profile", authMiddleware, getUserProfile);

export default router;