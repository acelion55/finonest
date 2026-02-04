import express from 'express';
import { CreditCard } from '../models/CreditCard.js';

const router = express.Router();

// Get all credit cards
router.get('/all', async (req, res) => {
  try {
    const cards = await CreditCard.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: cards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching credit cards',
      error: error.message,
    });
  }
});

// Get unique banks for credit cards
router.get('/filter/banks', async (req, res) => {
  try {
    const banks = await CreditCard.distinct('bank', { isActive: true });
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

// Get credit cards by bank
router.get('/filter/bybank/:bank', async (req, res) => {
  try {
    const { bank } = req.params;
    const products = await CreditCard.find({ bank: bank, isActive: true });
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

// Get credit card by ID
router.get('/:id', async (req, res) => {
  try {
    const card = await CreditCard.findOne({ id: parseInt(req.params.id) });
    
    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    res.status(200).json({
      success: true,
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching credit card',
      error: error.message,
    });
  }
});

// Create a new credit card (Admin only - for seeding data)
router.post('/create', async (req, res) => {
  try {
    const { id, bank, bankLogo, name, image, features, color, description } = req.body;

    if (!id || !bank || !name || !features || !color) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const newCard = new CreditCard({
      id,
      bank,
      bankLogo,
      name,
      image,
      features,
      color,
      description,
    });

    await newCard.save();

    res.status(201).json({
      success: true,
      message: 'Credit card created successfully',
      data: newCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating credit card',
      error: error.message,
    });
  }
});

// Update credit card
router.put('/:id', async (req, res) => {
  try {
    const card = await CreditCard.findOneAndUpdate(
      { id: parseInt(req.params.id) },
      req.body,
      { new: true, runValidators: true }
    );

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credit card updated successfully',
      data: card,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating credit card',
      error: error.message,
    });
  }
});

// Delete credit card
router.delete('/:id', async (req, res) => {
  try {
    const card = await CreditCard.findOneAndDelete({ id: parseInt(req.params.id) });

    if (!card) {
      return res.status(404).json({
        success: false,
        message: 'Credit card not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Credit card deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting credit card',
      error: error.message,
    });
  }
});

export default router;
