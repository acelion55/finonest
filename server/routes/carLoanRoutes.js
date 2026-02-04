import express from 'express';
import { CarLoan } from '../models/CarLoan.js';

const router = express.Router();

// Get all car loans
router.get('/all', async (req, res) => {
  try {
    const loans = await CarLoan.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: loans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching car loans',
      error: error.message,
    });
  }
});

// Get unique banks for car loans
router.get('/filter/banks', async (req, res) => {
  try {
    const banks = await CarLoan.distinct('bank', { isActive: true });
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

// Get car loans by bank
router.get('/filter/bybank/:bank', async (req, res) => {
  try {
    const { bank } = req.params;
    const products = await CarLoan.find({ bank: bank, isActive: true });
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

// Get car loan by ID
router.get('/:id', async (req, res) => {
  try {
    const loan = await CarLoan.findOne({ id: parseInt(req.params.id) });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Car loan not found',
      });
    }

    res.status(200).json({
      success: true,
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching car loan',
      error: error.message,
    });
  }
});

// Create new car loan (Admin only)
router.post('/create', async (req, res) => {
  try {
    const { id, bank, bankLogo, name, image, features, color, minAmount, maxAmount, interestRate, tenure, description } = req.body;

    if (!id || !bank || !name || !features || !color || !minAmount || !maxAmount || !interestRate || !tenure) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newLoan = new CarLoan({
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
      message: 'Car loan created successfully',
      data: newLoan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating car loan',
      error: error.message,
    });
  }
});

// Update car loan
router.put('/:id', async (req, res) => {
  try {
    const loan = await CarLoan.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Car loan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car loan updated successfully',
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating car loan',
      error: error.message,
    });
  }
});

// Delete car loan
router.delete('/:id', async (req, res) => {
  try {
    const loan = await CarLoan.findOneAndDelete({ id: parseInt(req.params.id) });

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: 'Car loan not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Car loan deleted successfully',
      data: loan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting car loan',
      error: error.message,
    });
  }
});

export default router;
