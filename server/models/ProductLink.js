import mongoose from 'mongoose';

const productLinkSchema = new mongoose.Schema(
  {
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    referralId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    referralName: {
      type: String,
      default: null,
    },
    productType: {
      type: String,
      enum: ['carloan', 'creditcard', 'personalloan', 'businessloan', 'offline'],
      required: true,
    },
    bank: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productId: {
      type: Number,
      required: true,
    },
    productImage: {
      type: String,
      default: null,
    },
    shareableUrl: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
    lastClickedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
    expiryDate: {
      type: Date,
      default: null,
    },
    metadata: {
      source: String,
      campaign: String,
      notes: String,
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

export const ProductLink = mongoose.model('ProductLink', productLinkSchema);
