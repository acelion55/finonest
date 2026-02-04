import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Phone, User, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import Nav from "./nav";
import { useParams } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ApplyLoanPage = () => {
  const params = useParams();
  const loanId = params.id;

  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    loanAmount: '',
    agreed: false
  });

  // Fetch loan data from API
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/personal-loans/${loanId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch loan data');
        }
        
        const data = await response.json();
        if (data.success) {
          setLoan(data.data);
        } else {
          setError('Failed to load loan data');
        }
      } catch (err) {
        console.error('Error fetching loan data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchLoanData();
    }
  }, [loanId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!loan) {
      alert("Loan data not loaded");
      return;
    }

    if (!formData.loanAmount) {
      alert("Please enter loan amount");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/personal-loan-applications/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loanId: loan.id,
          loanName: loan.name,
          bank: loan.bank,
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
          loanAmount: parseInt(formData.loanAmount),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Loan application submitted successfully!");
        setFormData({ fullName: '', mobileNumber: '', email: '', loanAmount: '', agreed: false });
      } else {
        alert("❌ Failed to submit application: " + data.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert("❌ Error submitting application: " + error.message);
    }
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 flex items-center justify-center">
          <p className="text-slate-400">Loading loan details...</p>
        </div>
      </>
    );
  }

  if (error || !loan) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Error: {error || 'Loan not found'}</p>
            <p className="text-slate-400 text-sm mt-2">Make sure the server is running on http://localhost:5000</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
    <Nav />
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <Link to="/productportfolio/persnolloan" className="flex items-center gap-2 text-green-600 font-semibold mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Personal Loans
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Loan Summary */}
          <div className="w-full md:w-2/5 bg-slate-50/50 p-8 border-r border-slate-100">
            <div className="sticky top-8">
              <div className={`${loan.color} rounded-2xl h-40 mb-8 flex items-center justify-center text-white text-6xl font-bold`}>
                {loan.name.charAt(0)}
              </div>

              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{loan.bank}</p>
              <h2 className="text-3xl font-bold text-slate-800 mb-6">{loan.name}</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Loan Amount</p>
                  <p className="text-2xl font-bold text-slate-800">₹{loan.minAmount.toLocaleString()} - ₹{loan.maxAmount.toLocaleString()}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Interest Rate</p>
                  <p className="text-2xl font-bold text-slate-800">{loan.interestRate}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tenure</p>
                  <p className="text-2xl font-bold text-slate-800">{loan.tenure}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-xs font-bold text-slate-600 mb-3 uppercase">Features</p>
                  <ul className="space-y-2">
                    {loan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="text-green-600 mt-0.5 shrink-0" size={16} />
                        <span className="text-sm text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Application Form */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Apply for Personal Loan</h3>
            <p className="text-slate-600 text-sm mb-8">Fill in your details to apply for this loan. It takes less than 2 minutes!</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-3 text-slate-400" size={18} />
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="9876543210"
                    maxLength="10"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3 text-slate-400" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
              </div>

              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Required Loan Amount *</label>
                <div className="relative">
                  <IndianRupee className="absolute left-4 top-3 text-slate-400" size={18} />
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    placeholder={`${loan.minAmount} - ${loan.maxAmount}`}
                    min={loan.minAmount}
                    max={loan.maxAmount}
                    className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Min: ₹{loan.minAmount.toLocaleString()} | Max: ₹{loan.maxAmount.toLocaleString()}</p>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3 pt-4">
                <input
                  type="checkbox"
                  name="agreed"
                  checked={formData.agreed}
                  onChange={handleInputChange}
                  id="agree"
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  required
                />
                <label htmlFor="agree" className="text-sm text-slate-600">
                  I agree to the terms and conditions and authorize {loan.bank} to contact me for further processing.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-xl mt-8"
              >
                Submit Application
              </button>

              {/* Security Badge */}
              <div className="flex items-center gap-2 justify-center text-slate-500 text-xs pt-4">
                <ShieldCheck size={16} />
                Your information is safe and encrypted
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ApplyLoanPage;
