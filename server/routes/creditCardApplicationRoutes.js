import express from 'express';
import { CreditCardApplication } from '../models/CreditCardApplication.js';

const router = express.Router();

// Get all applications
router.get('/all', async (req, res) => {
  try {
    const applications = await CreditCardApplication.find().sort({ appliedAt: -1 });
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

// Get applications by card ID
router.get('/card/:cardId', async (req, res) => {
  try {
    const applications = await CreditCardApplication.find({ cardId: parseInt(req.params.cardId) }).sort({ appliedAt: -1 });
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
    const { cardId, cardName, bank, fullName, mobileNumber, email } = req.body;

    if (!cardId || !cardName || !bank || !fullName || !mobileNumber || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newApplication = new CreditCardApplication({
      cardId,
      cardName,
      bank,
      fullName,
      mobileNumber,
      email,
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

// Update application status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const application = await CreditCardApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
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

export default router;
