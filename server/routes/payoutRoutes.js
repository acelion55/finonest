import express from 'express';
import { Payout } from '../models/Payout.js';

const router = express.Router();

// Get all payouts
router.get('/all', async (req, res) => {
  try {
    const payouts = await Payout.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payouts',
      error: error.message,
    });
  }
});

// Get payout by ID
router.get('/:id', async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({
        success: false,
        message: 'Payout not found',
      });
    }
    res.status(200).json({
      success: true,
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payout',
      error: error.message,
    });
  }
});

// Create new payout
router.post('/create', async (req, res) => {
  try {
    const {
      referralId,
      referralName,
      email,
      mobileNumber,
      leadId,
      customerName,
      product,
      leadStatus,
      commission,
      bonus,
      deduction,
      remark,
      payoutStatus,
    } = req.body;

    // Validation
    if (!referralId || !referralName || !email || !leadId || !customerName || !product) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      });
    }

    // Calculate final payout
    const finalPayout = (commission || 0) + (bonus || 0) - (deduction || 0);

    const newPayout = new Payout({
      referralId,
      referralName,
      email,
      mobileNumber,
      leadId,
      customerName,
      product,
      leadStatus,
      commission,
      bonus,
      deduction,
      finalPayout,
      remark,
      payoutStatus,
    });

    const savedPayout = await newPayout.save();
    res.status(201).json({
      success: true,
      message: 'Payout created successfully',
      data: savedPayout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payout',
      error: error.message,
    });
  }
});

// Update payout
router.put('/:id', async (req, res) => {
  try {
    const { commission, bonus, deduction, payoutStatus, payoutDate, remark } = req.body;

    const payout = await Payout.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({
        success: false,
        message: 'Payout not found',
      });
    }

    // Update fields
    if (commission !== undefined) payout.commission = commission;
    if (bonus !== undefined) payout.bonus = bonus;
    if (deduction !== undefined) payout.deduction = deduction;
    if (payoutStatus !== undefined) payout.payoutStatus = payoutStatus;
    if (payoutDate !== undefined) payout.payoutDate = payoutDate;
    if (remark !== undefined) payout.remark = remark;

    // Recalculate final payout
    payout.finalPayout = payout.commission + payout.bonus - payout.deduction;

    const updatedPayout = await payout.save();
    res.status(200).json({
      success: true,
      message: 'Payout updated successfully',
      data: updatedPayout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payout',
      error: error.message,
    });
  }
});

// Delete payout
router.delete('/:id', async (req, res) => {
  try {
    const payout = await Payout.findByIdAndDelete(req.params.id);
    if (!payout) {
      return res.status(404).json({
        success: false,
        message: 'Payout not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Payout deleted successfully',
      data: payout,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payout',
      error: error.message,
    });
  }
});

// Get payouts by referral ID
router.get('/referral/:referralId', async (req, res) => {
  try {
    const payouts = await Payout.find({ referralId: req.params.referralId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: payouts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payouts',
      error: error.message,
    });
  }
});

export default router;
