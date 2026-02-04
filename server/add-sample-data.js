import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { OfflineApplication } from './models/OfflineApplication.js';
import { BusinessLoanApplication } from './models/BusinessLoanApplication.js';
import { CreditCardApplication } from './models/CreditCardApplication.js';
import { PersonalLoanApplication } from './models/PersonalLoanApplication.js';
import { CarLoanApplication } from './models/CarLoanApplication.js';

dotenv.config();

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Sample Offline Applications
    const offlineSamples = [
      {
        fullName: 'Rajesh Kumar',
        mobileNumber: '9876543210',
        email: 'rajesh@example.com',
        loanAmount: 500000,
        monthlyIncome: 50000,
        employmentType: 'salaried',
        loanPurpose: 'Home Renovation',
        agreed: true,
        status: 'pending',
      },
      {
        fullName: 'Priya Singh',
        mobileNumber: '8765432109',
        email: 'priya@example.com',
        loanAmount: 300000,
        monthlyIncome: 35000,
        employmentType: 'self-employed',
        loanPurpose: 'Business Expansion',
        agreed: true,
        status: 'pending',
      },
    ];

    // Sample Business Loan Applications
    const businessSamples = [
      {
        fullName: 'Amit Patel',
        mobileNumber: '7654321098',
        email: 'amit@example.com',
        businessName: 'Tech Solutions Pvt Ltd',
        loanAmount: 1000000,
        businessType: 'IT Services',
        annualRevenue: 5000000,
        businessAge: '3 years',
        loanPurpose: 'Expansion',
        agreed: true,
        status: 'pending',
      },
      {
        fullName: 'Sneha Desai',
        mobileNumber: '6543210987',
        email: 'sneha@example.com',
        businessName: 'Fashion Boutique',
        loanAmount: 500000,
        businessType: 'Retail',
        annualRevenue: 2000000,
        businessAge: '2 years',
        loanPurpose: 'Inventory',
        agreed: true,
        status: 'pending',
      },
    ];

    // Insert Offline Applications
    console.log('\n📝 Adding Offline Loan Applications...');
    await OfflineApplication.insertMany(offlineSamples);
    console.log('✅ Added 2 Offline Loan applications');

    // Insert Business Applications
    console.log('\n📝 Adding Business Loan Applications...');
    await BusinessLoanApplication.insertMany(businessSamples);
    console.log('✅ Added 2 Business Loan applications');

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\nYou can now check the leads page to see the applications.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();
