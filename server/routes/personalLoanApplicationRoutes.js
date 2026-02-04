import express from 'express';
import { PersonalLoanApplication } from '../models/PersonalLoanApplication.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all applications
router.get('/all', async (req, res) => {
  try {
    const applications = await PersonalLoanApplication.find().sort({ appliedAt: -1 });
    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
});

// Get user's applications (protected)
router.get('/my-applications', authenticateToken, async (req, res) => {
  try {
    const applications = await PersonalLoanApplication.find({ userId: req.userId }).sort({ appliedAt: -1 });
    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications',
      error: error.message,
    });
  }
});

// Create new application (protected)
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { loanId, loanName, bank, fullName, mobileNumber, email, loanAmount } = req.body;

    if (!loanId || !loanName || !bank || !fullName || !mobileNumber || !email || !loanAmount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newApplication = new PersonalLoanApplication({
      userId: req.userId,
      loanId,
      loanName,
      bank,
      fullName,
      mobileNumber,
      email,
      loanAmount,
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: newApplication,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating application',
      error: error.message,
    });
  }
});

export default router;
