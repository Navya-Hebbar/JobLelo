import express from "express";
// Note: Assuming the controller is imported correctly from its path
import { login, register } from "../controllers/authController.js";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

// POST /api/auth/register
// Route for creating a new user account
router.post("/register", register);

// POST /api/auth/login
// Route for authenticating a user and issuing a JWT
router.post("/login", login);
router.post("/analyze", analyzeResume);

export default router;