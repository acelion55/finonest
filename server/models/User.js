import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const sessionSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 30 * 24 * 60 * 60, // 30 days TTL
  },
});

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
    // Sessions - store per-device tokens
    sessions: [sessionSchema],
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
    partialFilterExpression: { aadhaar: { $type: 'string', $gt: '' } }
  }
);

// Create partial unique index for pan (only when not empty)
userSchema.index(
  { pan: 1 },
  { 
    unique: true, 
    partialFilterExpression: { pan: { $type: 'string', $gt: '' } }
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
