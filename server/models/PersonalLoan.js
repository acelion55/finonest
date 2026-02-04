import mongoose from 'mongoose';

const personalLoanSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    bank: {
      type: String,
      required: true,
    },
    bankLogo: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    minAmount: {
      type: Number,
      required: true,
    },
    maxAmount: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: String,
      required: true,
    },
    tenure: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const PersonalLoan = mongoose.model('PersonalLoan', personalLoanSchema);
