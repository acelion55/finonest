import express from 'express';
import { PersonalLoan } from '../models/PersonalLoan.js';

const router = express.Router();

// Get all personal loans
router.get('/all', async (req, res) => {
  try {
    const loans = await PersonalLoan.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching personal loans',
      error: error.message,
    });
  }
});

// Get unique banks for personal loans
router.get('/filter/banks', async (req, res) => {
  try {
    const banks = await PersonalLoan.distinct('bank', { isActive: true });
    res.status(200).json({
      success: true,
      data: banks.sort(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching banks',
      error: error.message,
    });
  }
});

// Get personal loans by bank
router.get('/filter/bybank/:bank', async (req, res) => {
  try {
    const { bank } = req.params;
    const products = await PersonalLoan.find({ bank: bank, isActive: true });
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by bank',
      error: error.message,
    });
  }
});

// Get personal loan by ID
router.get('/:id', async (req, res) => {
  try {
    const loan = await PersonalLoan.findOne({ id: parseInt(req.params.id) });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Personal loan not found',
      });
    }

    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching personal loan',
      error: error.message,
    });
  }
});

// Create new personal loan (Admin only)
router.post('/create', async (req, res) => {
  try {
    const { id, bank, bankLogo, name, image, features, color, minAmount, maxAmount, interestRate, tenure, description } = req.body;

    if (!id || !bank || !name || !features || !color || !minAmount || !maxAmount || !interestRate || !tenure) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newLoan = new PersonalLoan({
      id,
      bank,
      bankLogo,
      name,
      image,
      features,
      color,
      minAmount,
      maxAmount,
      interestRate,
      tenure,
      description,
    });

    await newLoan.save();

    res.status(201).json({
      success: true,
      message: 'Personal loan created successfully',
      data: newLoan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating personal loan',
      error: error.message,
    });
  }
});

// Update personal loan
router.put('/:id', async (req, res) => {
  try {
    const loan = await PersonalLoan.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Personal loan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Personal loan updated successfully',
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating personal loan',
      error: error.message,
    });
  }
});

// Delete personal loan
router.delete('/:id', async (req, res) => {
  try {
    const loan = await PersonalLoan.findOneAndDelete({ id: parseInt(req.params.id) });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Personal loan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Personal loan deleted successfully',
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting personal loan',
      error: error.message,
    });
  }
});

export default router;
