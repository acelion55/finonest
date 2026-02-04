import express from 'express';
import { CarLoanApplication } from '../models/CarLoanApplication.js';

const router = express.Router();

// Get all applications
router.get('/all', async (req, res) => {
  try {
    const applications = await CarLoanApplication.find().sort({ appliedAt: -1 });
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

// Create new application
router.post('/apply', async (req, res) => {
  try {
    const { loanId, loanName, bank, fullName, mobileNumber, email, loanAmount, carType } = req.body;

    if (!loanId || !loanName || !bank || !fullName || !mobileNumber || !email || !loanAmount || !carType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newApplication = new CarLoanApplication({
      loanId,
      loanName,
      bank,
      fullName,
      mobileNumber,
      email,
      loanAmount,
      carType,
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
