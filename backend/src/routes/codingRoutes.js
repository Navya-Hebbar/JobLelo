// backend/src/routes/codingRoutes.js
import express from "express";
import { 
  getAllProblems, 
  executeCode, 
  submitSolution, 
  getUserSubmissions 
} from "../controllers/codingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/problems", getAllProblems);

// Protected routes (require authentication)
router.post("/execute", authMiddleware, executeCode);
router.post("/submit", authMiddleware, submitSolution);
router.get("/submissions", authMiddleware, getUserSubmissions);

export default router;