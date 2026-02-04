import React, { useState } from 'react';
import { Briefcase, CheckCircle2, ShieldCheck, Mail, Phone, User, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';
import Nav from "../../components/navbar";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function BusinessLoanPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    businessName: '',
    loanAmount: '',
    businessType: 'retail',
    annualRevenue: '',
    businessAge: '1-2 years',
    loanPurpose: '',
    agreed: false,
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/business-loan-applications/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        setFormData({
          fullName: '',
          mobileNumber: '',
          email: '',
          businessName: '',
          loanAmount: '',
          businessType: 'retail',
          annualRevenue: '',
          businessAge: '1-2 years',
          loanPurpose: '',
          agreed: false,
        });
        
        setTimeout(() => {
          setSubmitted(false);
        }, 3000);
      } else {
        setError(data.message || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Error submitting application:', err);
      setError('Unable to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-slate-50 p-4 md:p-10">
        <div className="max-w-5xl mx-auto">
          
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-teal-600 p-2 rounded text-white">
                <Briefcase size={24} />
              </div>
              <h1 className="text-4xl font-bold text-slate-800">Business Loan</h1>
            </div>
            <p className="text-slate-600 text-lg">Fuel your business growth with our comprehensive financing solutions.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            
            {/* Application Form */}
            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Apply for Business Loan</h3>
              <p className="text-slate-600 text-sm mb-8">Fill in your business details and we'll get back to you within 24 hours with a personalized offer.</p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="text-green-600 mt-0.5 shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-green-800">Application Submitted!</h4>
                    <p className="text-sm text-green-700">Our team will review your application and contact you shortly.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm font-semibold">{error}</p>
                </div>
              )}

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
                      placeholder="Enter your full name"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      pattern="[0-9]{10}"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
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
                      placeholder="your.email@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Business Name *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Enter your business name"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Business Type */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="retail">Retail</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="service">Service</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Business Age */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Business Age</label>
                  <select
                    name="businessAge"
                    value={formData.businessAge}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  >
                    <option value="0-1 years">Less than 1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-5 years">2-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>

                {/* Annual Revenue */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Annual Revenue (₹)</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input
                      type="number"
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleInputChange}
                      placeholder="Enter annual revenue"
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Loan Amount (₹) *</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-3 text-slate-400" size={18} />
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      placeholder="Enter loan amount"
                      min="50000"
                      max="5000000"
                      required
                      className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Loan Purpose */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Loan Purpose</label>
                  <textarea
                    name="loanPurpose"
                    value={formData.loanPurpose}
                    onChange={handleInputChange}
                    placeholder="Tell us how you plan to use this loan (expansion, inventory, equipment, etc.)"
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                  ></textarea>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-3 pt-4 border-t border-slate-200">
                  <input
                    type="checkbox"
                    name="agreed"
                    id="agreed"
                    checked={formData.agreed}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-teal-600 rounded focus:ring-2 focus:ring-teal-500"
                  />
                  <label htmlFor="agreed" className="text-sm text-slate-600">
                    I agree to the terms and conditions and authorize the company to contact me regarding this business loan application. I also consent to a financial audit and background check.
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !formData.agreed}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all ${
                    loading || !formData.agreed
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-teal-600 hover:bg-teal-700 active:scale-95'
                  }`}
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 pt-8 border-t border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <ShieldCheck className="text-teal-600 shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-slate-800">100% Secure</p>
                      <p className="text-sm text-slate-600">Your business data is encrypted and secure</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                    <div>
                      <p className="font-semibold text-slate-800">Fast Approval</p>
                      <p className="text-sm text-slate-600">Get contacted within 24 hours with an offer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-6">
            <Link to="/productportfolio/persnolloan" className="flex items-center gap-2 text-teal-600 font-semibold hover:gap-3 transition-all">
              ← Back to Products
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
