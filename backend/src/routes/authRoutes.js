const express = require('express');
// Ensure your authController uses module.exports = { login, register }
const { login, register } = require('../controllers/authController');

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

module.exports = router;