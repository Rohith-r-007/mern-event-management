const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp, getCurrentUser } = require('../controller/auth.controller.js');
const { protect } = require('../middleware/auth.middleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.get('/me', protect, getCurrentUser);

module.exports = router;