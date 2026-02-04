import mongoose from 'mongoose';

// Payout Schema
const payoutSchema = new mongoose.Schema(
  {
    referralId: {
      type: String,
      required: true,
    },
    referralName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    leadId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    leadStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'converted'],
      default: 'pending',
    },
    commission: {
      type: Number,
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    deduction: {
      type: Number,
      default: 0,
    },
    finalPayout: {
      type: Number,
      default: 0,
    },
    remark: {
      type: String,
      default: '',
    },
    payoutStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    payoutDate: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Payout = mongoose.model('Payout', payoutSchema);
