import mongoose from 'mongoose';

const offlineApplicationSchema = new mongoose.Schema({
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
  monthlyIncome: {
    type: Number,
  },
  employmentType: {
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

export const OfflineApplication = mongoose.model('offline_form', offlineApplicationSchema);
