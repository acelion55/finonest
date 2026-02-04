import mongoose from 'mongoose';

const businessLoanApplicationSchema = new mongoose.Schema({
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
  businessName: {
    type: String,
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  businessType: {
    type: String,
    required: true,
  },
  annualRevenue: {
    type: Number,
  },
  businessAge: {
    type: String,
  },
  loanPurpose: {
    type: String,
  },
  agreed: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const BusinessLoanApplication = mongoose.model('business_loan_form', businessLoanApplicationSchema);
