import mongoose from 'mongoose';

// Personal Loan Application Schema
const personalLoanApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    loanId: {
      type: Number,
      required: true,
    },
    loanName: {
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
    loanAmount: {
      type: Number,
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

export const PersonalLoanApplication = mongoose.model('PersonalLoanApplication', personalLoanApplicationSchema);
