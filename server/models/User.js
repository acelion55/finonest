import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    fullName: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    // KYC Details
    aadhaar: {
      type: String,
      default: '',
      sparse: true,
    },
    pan: {
      type: String,
      default: '',
      sparse: true,
    },
    bankAccountNumber: {
      type: String,
      default: '',
    },
    bankIFSC: {
      type: String,
      default: '',
    },
    bankName: {
      type: String,
      default: '',
    },
    accountHolderName: {
      type: String,
      default: '',
    },
    // Verification Status
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    aadhaarVerified: {
      type: Boolean,
      default: false,
    },
    panVerified: {
      type: Boolean,
      default: false,
    },
    bankVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create partial unique index for aadhaar (only when not empty)
userSchema.index(
  { aadhaar: 1 },
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { aadhaar: { $ne: '' } }
  }
);

// Create partial unique index for pan (only when not empty)
userSchema.index(
  { pan: 1 },
  { 
    unique: true, 
    sparse: true,
    partialFilterExpression: { pan: { $ne: '' } }
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
