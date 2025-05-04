const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendOTPEmail = require('../utils/mailer'); // Send OTP Email

const router = express.Router();

// Generate 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Signup Route
router.post('/signup', async (req, res) => {
    const { username, password, email } = req.body;

    try {
        const exists = await User.findOne({ $or: [{ username }, { email }] });
        if (exists) return res.status(400).json({ message: 'Username or Email already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const otp = generateOTP(); // Generate OTP
        const otpExpires = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

        // Log the generated OTP to check it in the console
        console.log('OTP generated:', otp);

        const user = new User({ username, password: hashed, email, otp, otpExpires });
        await user.save();

        await sendOTPEmail(email, username, otp); // Send OTP email

        res.status(201).json({ message: 'OTP sent to email' });
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500).json({ message: 'Error during signup' });
    }
});

// OTP Verification Route
router.post('/verify', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check if user is already verified
        if (user.isVerified) return res.status(400).json({ message: 'User already verified' });

        // Check if OTP matches and hasn't expired
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpires = undefined; // Clear OTP expiration
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (err) {
        console.error("Verification Error:", err);
        res.status(500).json({ message: 'Verification error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check if user is verified
        if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });

        // Compare password
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: 'Login error' });
    }
});

module.exports = router;
