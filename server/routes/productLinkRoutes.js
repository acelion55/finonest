import express from 'express';
import { ProductLink } from '../models/ProductLink.js';
import { CarLoan } from '../models/CarLoan.js';
import { CreditCard } from '../models/CreditCard.js';
import { PersonalLoan } from '../models/PersonalLoan.js';

const router = express.Router();

// Generate unique code for link
const generateUniqueCode = () => {
  return 'PL_' + Math.random().toString(36).substring(2, 11).toUpperCase() + Date.now().toString(36).toUpperCase();
};

// Get all product links
router.get('/all', async (req, res) => {
  try {
    const links = await ProductLink.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: links,
      message: 'Product links fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product links',
      error: error.message,
    });
  }
});

// Get single product link by code
router.get('/:code', async (req, res) => {
  try {
    const link = await ProductLink.findOne({ uniqueCode: req.params.code });
    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Product link not found',
      });
    }
    
    // Increment click count
    link.clicks += 1;
    link.lastClickedAt = new Date();
    await link.save();
    
    res.json({
      success: true,
      data: link,
      message: 'Product link found',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product link',
      error: error.message,
    });
  }
});

// Get product links by referral ID
router.get('/referral/:referralId', async (req, res) => {
  try {
    const links = await ProductLink.find({ referralId: req.params.referralId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      data: links,
      message: 'Referral links fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch referral links',
      error: error.message,
    });
  }
});

// Create new product link
router.post('/create', async (req, res) => {
  try {
    const {
      referralId,
      referralName,
      productType,
      bank,
      productName,
      productId,
      productImage,
      source,
      campaign,
      notes,
    } = req.body;

    // Validate required fields
    if (!productType || !bank || !productName || !productId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: productType, bank, productName, productId',
      });
    }

    // Generate unique code
    const uniqueCode = generateUniqueCode();
    
    // Create shareable URL
    const shareableUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/product-link/${uniqueCode}`;

    const newLink = new ProductLink({
      uniqueCode,
      referralId,
      referralName,
      productType,
      bank,
      productName,
      productId,
      productImage,
      shareableUrl,
      metadata: {
        source,
        campaign,
        notes,
      },
    });

    await newLink.save();

    res.status(201).json({
      success: true,
      data: newLink,
      message: 'Product link created successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create product link',
      error: error.message,
    });
  }
});

// Update product link
router.put('/:id', async (req, res) => {
  try {
    const { status, expiryDate, notes } = req.body;

    const link = await ProductLink.findByIdAndUpdate(
      req.params.id,
      {
        status,
        expiryDate,
        'metadata.notes': notes,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Product link not found',
      });
    }

    res.json({
      success: true,
      data: link,
      message: 'Product link updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update product link',
      error: error.message,
    });
  }
});

// Delete product link
router.delete('/:id', async (req, res) => {
  try {
    const link = await ProductLink.findByIdAndDelete(req.params.id);

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Product link not found',
      });
    }

    res.json({
      success: true,
      data: link,
      message: 'Product link deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete product link',
      error: error.message,
    });
  }
});

// Get available banks for product type
router.get('/banks/:productType', async (req, res) => {
  try {
    const { productType } = req.params;

    let banks = [];
    switch (productType) {
      case 'carloan':
        banks = await CarLoan.distinct('bank');
        break;
      case 'creditcard':
        banks = await CreditCard.distinct('bank');
        break;
      case 'personalloan':
        banks = await PersonalLoan.distinct('bank');
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid product type',
        });
    }

    res.json({
      success: true,
      data: banks,
      message: 'Banks fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch banks',
      error: error.message,
    });
  }
});

// Get products for bank and type
router.get('/products/:productType/:bank', async (req, res) => {
  try {
    const { productType, bank } = req.params;

    let products = [];
    switch (productType) {
      case 'carloan':
        products = await CarLoan.find({ bank });
        break;
      case 'creditcard':
        products = await CreditCard.find({ bank });
        break;
      case 'personalloan':
        products = await PersonalLoan.find({ bank });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid product type',
        });
    }

    res.json({
      success: true,
      data: products,
      message: 'Products fetched successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message,
    });
  }
});

export default router;
