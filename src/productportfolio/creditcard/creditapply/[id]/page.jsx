import React, { useState, useEffect, useContext } from 'react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Phone, User } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import Nav from "./nav";
import { AuthContext } from "../../../../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ApplyCardPage = () => {
  const { token } = useContext(AuthContext);
  const params = useParams();
  const cardId = params.id;

  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    agreed: false
  });

  // Fetch card data from API
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/creditcards/${cardId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch card data');
        }
        
        const data = await response.json();
        if (data.success) {
          setCard(data.data);
        } else {
          setError('Failed to load card data');
        }
      } catch (err) {
        console.error('Error fetching card data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardData();
    }
  }, [cardId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!card) {
      alert("Card data not loaded");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/creditcard-applications/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardId: card.id,
          cardName: card.name,
          bank: card.bank,
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ Application submitted successfully!");
        setFormData({ fullName: '', mobileNumber: '', email: '', agreed: false });
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
          <p className="text-slate-400">Loading card details...</p>
        </div>
      </>
    );
  }

  if (error || !card) {
    return (
      <>
        <Nav />
        <div className="min-h-screen bg-slate-50 p-4 md:p-10 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-400">Error: {error || 'Card not found'}</p>
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
        <Link to="/productportfolio/creditcard" className="flex items-center gap-2 text-blue-600 font-semibold mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={18} /> Back to Credit Cards
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Side: Product Summary */}
          <div className="w-full md:w-2/5 bg-slate-50/50 p-8 border-r border-slate-100">
            <div className="sticky top-8">
              <div className="relative w-full aspect-[1.6/1] rounded-2xl shadow-2xl overflow-hidden mb-8 group">
                {/* IDFC Card Image Placeholder */}
                <div className="w-full h-full bg-linear-to-br from-blue-700 to-blue-900 flex flex-col justify-between p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-8 bg-yellow-400/20 rounded-md backdrop-blur-sm border border-yellow-400/30" />
                    <span className="text-lg font-bold italic opacity-80">VISA</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] tracking-[0.3em] opacity-60">{card.bank} Family</p>
                    <p className="text-sm font-medium tracking-widest leading-none uppercase">Harsh Vardhan</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <img src="/idfc-logo.png" alt={card.bank} className="h-4" />
                    <span className="text-xs font-bold text-slate-400 uppercase">{card.bank}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{card.name}</h2>
                </div>

                <ul className="space-y-4">
                  <Feature text="Lifetime Free: No joining or annual fees." />
                  <Feature text="Rewards: Up to 10x points on spending." />
                  <Feature text="Travel Benefits: Complimentary railway lounge access." />
                </ul>

                <div className="pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-2xl">
                    <ShieldCheck size={24} />
                    <p className="text-xs font-medium">Your data is secured with bank-grade encryption</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Application Form */}
          <div className="w-full md:w-3/5 p-8 md:p-12">
            <div className="max-w-md mx-auto">
              <div className="mb-10 text-center md:text-left">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Apply for {card.name}</h3>
                <p className="text-slate-500">Fill in your details to proceed</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Mobile Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="tel" 
                      required
                      maxLength="10"
                      placeholder="Enter 10-digit mobile number"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="Enter your email address"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start gap-3 py-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    required
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onChange={(e) => setFormData({...formData, agreed: e.target.checked})}
                  />
                  <label htmlFor="terms" className="text-xs text-slate-500 leading-normal">
                    I agree to the <span className="text-blue-600 font-bold cursor-pointer">Terms & Conditions</span> and <span className="text-blue-600 font-bold cursor-pointer">Privacy Policy</span>
                  </label>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600   py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-[0.98]"
                >
                  Submit Application
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
    </>
  );
};

// Sub-component for benefits
const Feature = ({ text }) => (
  <li className="flex items-start gap-3">
    <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={18} />
    <span className="text-sm text-slate-600 font-medium">{text}</span>
  </li>
);

export default ApplyCardPage;
