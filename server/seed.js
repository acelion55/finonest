import dotenv from 'dotenv';
import connectDB from './config/database.js';
import { CreditCard } from './models/CreditCard.js';
import { PersonalLoan } from './models/PersonalLoan.js';
import { CarLoan } from './models/CarLoan.js';

dotenv.config();

const creditCardData = [
  {
    id: 1,
    bank: "IDFC First Bank",
    bankLogo: "/idfc-logo.png",
    name: "Classic Credit Card",
    image: "/classic-card.png",
    features: [
      "Lifetime Free: No joining or annual fees.",
      "Rewards: Up to 10x points on spending.",
      "Travel Benefits: Complimentary railway lounge access."
    ],
    color: "bg-blue-600"
  },
  {
    id: 2,
    bank: "IDFC First Bank",
    bankLogo: "/idfc-logo.png",
    name: "HPCL Credit Card",
    image: "/hpcl-card.png",
    features: [
      "Fuel Savings: Up to 6.5% savings on HPCL fuel.",
      "Utility Rewards: Earn 5% back on groceries and utilities.",
      "Travel Perks: Complimentary airport lounge access."
    ],
    color: "bg-slate-900"
  },
  {
    id: 3,
    bank: "IDFC First Bank",
    bankLogo: "/idfc-logo.png",
    name: "SWYPP Credit Card",
    image: "/swypp-card.png",
    features: [
      "EMI conversion: Easily convert transactions to EMIs.",
      "Railway Lounge: Complimentary access to railway lounges.",
      "Merchant offers: Discounts on popular brands and online portals."
    ],
    color: "bg-orange-400"
  },
  {
    id: 4,
    bank: "BOB Financial",
    bankLogo: "/bob-logo.png",
    name: "Uni GoldX Credit Card",
    image: "/uni-card.png",
    features: [
      "Gold Rewards: Earn 1% back in digital gold.",
      "Lifetime Free: Zero joining and annual fees.",
      "Zero Forex Markup: No extra fees on international spending."
    ],
    color: "bg-black"
  }
];

const personalLoanData = [
  {
    id: 1,
    bank: "IDFC First Bank",
    bankLogo: "/idfc-logo.png",
    name: "Quick Loan",
    image: "/personal-loan-1.png",
    features: [
      "Approval in 24 hours",
      "Minimal documentation",
      "Flexible repayment tenure up to 5 years",
      "No hidden charges"
    ],
    color: "bg-green-600",
    minAmount: 100000,
    maxAmount: 2500000,
    interestRate: "9% - 15%",
    tenure: "1-5 years"
  },
  {
    id: 2,
    bank: "BOB Financial",
    bankLogo: "/bob-logo.png",
    name: "Standard Personal Loan",
    image: "/personal-loan-2.png",
    features: [
      "Competitive interest rates",
      "Flexible tenure options",
      "Instant disbursal",
      "Balance transfer facility available"
    ],
    color: "bg-blue-600",
    minAmount: 150000,
    maxAmount: 3000000,
    interestRate: "8.5% - 14%",
    tenure: "1-6 years"
  },
  {
    id: 3,
    bank: "SBIN",
    bankLogo: "/sbin-logo.png",
    name: "Employee Personal Loan",
    image: "/personal-loan-3.png",
    features: [
      "Exclusive for salaried employees",
      "Salary deduction facility",
      "Quick approval process",
      "Lower interest rates"
    ],
    color: "bg-purple-600",
    minAmount: 50000,
    maxAmount: 2000000,
    interestRate: "7.5% - 12%",
    tenure: "1-5 years"
  }
];

const carLoanData = [
  {
    id: 1,
    bank: "HDFC Bank",
    bankLogo: "/hdfc-logo.png",
    name: "New Car Loan",
    image: "/car-loan-1.png",
    features: [
      "Up to 100% financing for new cars",
      "Instant approval and disbursal",
      "No processing fee",
      "Flexible down payment options",
      "Competitive interest rates"
    ],
    color: "bg-red-600",
    minAmount: 300000,
    maxAmount: 5000000,
    interestRate: "8% - 12%",
    tenure: "1-7 years"
  },
  {
    id: 2,
    bank: "ICICI Bank",
    bankLogo: "/icici-logo.png",
    name: "Used Car Loan",
    image: "/car-loan-2.png",
    features: [
      "Financing for vehicles up to 10 years old",
      "Fast approval and disbursement",
      "Lower documentation requirements",
      "Flexible repayment period",
      "Optional insurance coverage"
    ],
    color: "bg-orange-600",
    minAmount: 100000,
    maxAmount: 2500000,
    interestRate: "9% - 14%",
    tenure: "1-5 years"
  },
  {
    id: 3,
    bank: "Axis Bank",
    bankLogo: "/axis-logo.png",
    name: "Two-Wheeler Loan",
    image: "/car-loan-3.png",
    features: [
      "Quick approval process",
      "Minimal documentation",
      "Competitive interest rates",
      "Balance transfer facility",
      "Extended warranty options"
    ],
    color: "bg-blue-700",
    minAmount: 50000,
    maxAmount: 500000,
    interestRate: "7.5% - 11%",
    tenure: "1-5 years"
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await CreditCard.deleteMany({});
    await PersonalLoan.deleteMany({});
    await CarLoan.deleteMany({});
    console.log('Cleared existing data');

    // Insert credit card data
    await CreditCard.insertMany(creditCardData);
    console.log('✅ Credit cards seeded successfully');

    // Insert personal loan data
    await PersonalLoan.insertMany(personalLoanData);
    console.log('✅ Personal loans seeded successfully');

    // Insert car loan data
    await CarLoan.insertMany(carLoanData);
    console.log('✅ Car loans seeded successfully');

    console.log('\n📊 Database Summary:');
    console.log(`   - Credit Cards: ${await CreditCard.countDocuments()}`);
    console.log(`   - Personal Loans: ${await PersonalLoan.countDocuments()}`);
    console.log(`   - Car Loans: ${await CarLoan.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
