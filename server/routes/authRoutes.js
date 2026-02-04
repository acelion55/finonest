import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const router = express.Router();

// Generate JWT Token with device ID
const generateToken = (id, deviceId) => {
  return jwt.sign({ id, deviceId }, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_env', {
    expiresIn: '30d',
  });
};

// Verify device ID from request header
const getDeviceId = (req) => {
  return req.headers['x-device-id'] || null;
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName } = req.body;
    const deviceId = getDeviceId(req);

    // Validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password and confirm password',
      });
    }

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Device identification failed',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Create new user
    user = new User({
      email,
      password,
      fullName: fullName || '',
      sessions: [],
    });

    await user.save();

    // Generate token with device ID
    const token = generateToken(user._id, deviceId);

    // Add session to user
    user.sessions.push({
      deviceId,
      token,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during signup: ' + error.message,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const deviceId = getDeviceId(req);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    if (!deviceId) {
      return res.status(400).json({
        success: false,
        message: 'Device identification failed',
      });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate token with device ID
    const token = generateToken(user._id, deviceId);

    // Remove old session from same device if exists, then add new session
    user.sessions = user.sessions.filter(session => session.deviceId !== deviceId);
    user.sessions.push({
      deviceId,
      token,
    });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        aadhaar: user.aadhaar,
        pan: user.pan,
        bankName: user.bankName,
        kycStatus: user.kycStatus,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login: ' + error.message,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile (Protected)
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const deviceId = getDeviceId(req);

    if (!token || !deviceId) {
      return res.status(401).json({
        success: false,
        message: 'No token or device ID provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_env');
    
    // Verify device ID matches
    if (decoded.deviceId !== deviceId) {
      return res.status(401).json({
        success: false,
        message: 'Device mismatch - unauthorized access',
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify session exists
    const sessionExists = user.sessions.some(session => 
      session.deviceId === deviceId && session.token === token
    );

    if (!sessionExists) {
      return res.status(401).json({
        success: false,
        message: 'Session not found - please login again',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user KYC details (Protected)
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const deviceId = getDeviceId(req);

    if (!token || !deviceId) {
      return res.status(401).json({
        success: false,
        message: 'No token or device ID provided',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_change_in_env');
    
    // Verify device ID matches
    if (decoded.deviceId !== deviceId) {
      return res.status(401).json({
        success: false,
        message: 'Device mismatch - unauthorized access',
      });
    }

    let user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify session exists
    const sessionExists = user.sessions.some(session => 
      session.deviceId === deviceId && session.token === token
    );

    if (!sessionExists) {
      return res.status(401).json({
        success: false,
        message: 'Session not found - please login again',
      });
    }

    // Update fields
    const { fullName, phone, aadhaar, pan, bankAccountNumber, bankIFSC, bankName, accountHolderName } = req.body;

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (aadhaar) user.aadhaar = aadhaar;
    if (pan) user.pan = pan;
    if (bankAccountNumber) user.bankAccountNumber = bankAccountNumber;
    if (bankIFSC) user.bankIFSC = bankIFSC;
    if (bankName) user.bankName = bankName;
    if (accountHolderName) user.accountHolderName = accountHolderName;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile: ' + error.message,
    });
  }
});

export default router;
