import React, { useState, useEffect } from 'react';
import { Banknote, Search, ArrowRight } from 'lucide-react';
import  { Link } from 'react-router-dom';
import Nav from "../../components/navbar";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function PersonalLoanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loanData, setLoanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/personal-loans/all`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setLoanData(data.data);
        } else {
          setError(data.message || 'Failed to load loans');
        }
      } catch (err) {
        console.error('Error fetching loans:', err);
        setError('Unable to load loans. Make sure the backend server is running on http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  // Search Logic
  const filteredLoans = loanData.filter(loan =>
    loan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.bank.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
          <p className="text-slate-400">Loading personal loans...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400 mb-2">{error}</p>
            <p className="text-slate-400 text-sm">Start the server: cd server && npm run dev</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Nav />
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-green-600 p-2 rounded text-white">
              <Banknote size={24} />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">Personal Loans</h1>
          </div>
          <p className="text-slate-600 text-lg">Quick approvals, flexible terms, financial freedom</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by loan name or bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>
        {/* Loans Grid */}
        {filteredLoans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLoans.map((loan) => (
              <LoanCard key={loan._id} loan={loan} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No loans found matching your search</p>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

// Loan Card Component
const LoanCard = ({ loan }) => {
  return (
    <Link to={`/productportfolio/persnolloan/apply/${loan.id}`}>
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 cursor-pointer border border-slate-100 hover:border-green-300">
        
        {/* Bank Logo and Color */}
        <div className={`${loan.color} rounded-xl h-32 mb-4 flex items-center justify-center text-white text-4xl font-bold`}>
          {loan.name.charAt(0)}
        </div>

        {/* Bank Info */}
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{loan.bank}</p>
        <h3 className="text-xl font-bold text-slate-800 mb-3">{loan.name}</h3>

        {/* Loan Details */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Amount:</span>
            <span className="font-semibold text-slate-800">₹{loan.minAmount.toLocaleString()} - ₹{loan.maxAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Interest Rate:</span>
            <span className="font-semibold text-slate-800">{loan.interestRate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tenure:</span>
            <span className="font-semibold text-slate-800">{loan.tenure}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-slate-600 mb-2">Key Features:</p>
          <ul className="text-xs text-slate-600 space-y-1">
            {loan.features.slice(0, 2).map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Apply Button */}
        <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
          Apply Now <ArrowRight size={16} />
        </button>
      </div>
    </Link>
  );
};
 