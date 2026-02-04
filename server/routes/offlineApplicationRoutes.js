import express from 'express';
import { OfflineApplication } from '../models/OfflineApplication.js';

const router = express.Router();

// Get all offline applications
router.get('/all', async (req, res) => {
  try {
    const applications = await OfflineApplication.find();
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

// Get offline application by ID
router.get('/:id', async (req, res) => {
  try {
    const application = await OfflineApplication.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }
    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application',
      error: error.message,
    });
  }
});

// Create new offline application
router.post('/create', async (req, res) => {
  try {
    const { fullName, mobileNumber, email, loanAmount, monthlyIncome, employmentType, loanPurpose, agreed } = req.body;

    // Validation
    if (!fullName || !mobileNumber || !email || !loanAmount || !agreed) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      });
    }

    const newApplication = new OfflineApplication({
      fullName,
      mobileNumber,
      email,
      loanAmount,
      monthlyIncome,
      employmentType,
      loanPurpose,
      agreed,
      status: 'pending',
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

// Update offline application
router.put('/:id', async (req, res) => {
  try {
    const application = await OfflineApplication.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating application',
      error: error.message,
    });
  }
});

// Delete offline application
router.delete('/:id', async (req, res) => {
  try {
    const application = await OfflineApplication.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting application',
      error: error.message,
    });
  }
});

export default router;
