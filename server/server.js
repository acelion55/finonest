import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import creditCardRoutes from './routes/creditCardRoutes.js';
import creditCardApplicationRoutes from './routes/creditCardApplicationRoutes.js';
import personalLoanRoutes from './routes/personalLoanRoutes.js';
import personalLoanApplicationRoutes from './routes/personalLoanApplicationRoutes.js';
import carLoanRoutes from './routes/carLoanRoutes.js';
import carLoanApplicationRoutes from './routes/carLoanApplicationRoutes.js';
import offlineApplicationRoutes from './routes/offlineApplicationRoutes.js';
import businessLoanApplicationRoutes from './routes/businessLoanApplicationRoutes.js';
import payoutRoutes from './routes/payoutRoutes.js';
import productLinkRoutes from './routes/productLinkRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'https://*.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/creditcards', creditCardRoutes);
app.use('/api/creditcard-applications', creditCardApplicationRoutes);
app.use('/api/personal-loans', personalLoanRoutes);
app.use('/api/personal-loan-applications', personalLoanApplicationRoutes);
app.use('/api/car-loans', carLoanRoutes);
app.use('/api/car-loan-applications', carLoanApplicationRoutes);
app.use('/api/offline-applications', offlineApplicationRoutes);
app.use('/api/business-loan-applications', businessLoanApplicationRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/product-links', productLinkRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on 192.168.29.239:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   GET  /api/creditcards/all - Get all credit cards`);
  console.log(`   GET  /api/creditcards/:id - Get credit card by ID`);
  console.log(`   POST /api/creditcards/create - Create new credit card`);
  console.log(`   PUT  /api/creditcards/:id - Update credit card`);
  console.log(`   DELETE /api/creditcards/:id - Delete credit card`);
});
