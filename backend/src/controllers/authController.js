const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || "joblelo-secret-key-change-in-production";

const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Basic input validation
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    // 2. Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email." });
    }

    // 3. Hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // 4. Create the new user in the database
    const user = await User.create({ email, passwordHash });

    // 5. Success response
    return res.status(201).json({ message: "User registered successfully!", userId: user._id });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({ message: "Server error during registration." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Basic input validation
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    // 3. Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    // 4. Generate a JSON Web Token (JWT)
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // 5. Success response with token and user info
    return res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { register, login };