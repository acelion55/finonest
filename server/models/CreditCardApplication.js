import mongoose from 'mongoose';

// Credit Card Application Schema
const creditCardApplicationSchema = new mongoose.Schema(
  {
    cardId: {
      type: Number,
      required: true,
    },
    cardName: {
      type: String,
      required: true,
    },
    bank: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const CreditCardApplication = mongoose.model('CreditCardApplication', creditCardApplicationSchema);
