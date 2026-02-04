import React, { useState, useContext, useEffect } from 'react';
import Nav from '../components/navbar';
import { AuthContext } from '../context/AuthContext';
import { User, FileText, DollarSign, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function ProfilePage() {
  const navigate = useNavigate();
  const { user, token, updateProfile } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    aadhaar: '',
    pan: '',
    bankAccountNumber: '',
    bankIFSC: '',
    bankName: '',
    accountHolderName: '',
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  // Fetch latest user data from server on page load
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      
      try {
        setPageLoading(true);
        const response = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setFormData({
              fullName: data.user.fullName || '',
              phone: data.user.phone || '',
              aadhaar: data.user.aadhaar || '',
              pan: data.user.pan || '',
              bankAccountNumber: data.user.bankAccountNumber || '',
              bankIFSC: data.user.bankIFSC || '',
              bankName: data.user.bankName || '',
              accountHolderName: data.user.accountHolderName || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserData();
  }, [token]);

  // Also load from context when user changes
  useEffect(() => {
    if (user && !pageLoading) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        aadhaar: user.aadhaar || '',
        pan: user.pan || '',
        bankAccountNumber: user.bankAccountNumber || '',
        bankIFSC: user.bankIFSC || '',
        bankName: user.bankName || '',
        accountHolderName: user.accountHolderName || '',
      });
    }
  }, [user, pageLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage({
        type: 'success',
        text: 'Profile updated successfully! Your information has been saved.',
      });
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({
        type: 'error',
        text: result.message,
      });
    }
    setLoading(false);
  };

  if (pageLoading) {
    return (
      <>
        <Nav />
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Loader className="animate-spin text-white" size={32} />
            </div>
            <p className="text-slate-600 font-semibold">Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Nav />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
            <p className="text-slate-600 font-semibold">Unable to load profile</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Profile & KYC</h1>
            <p className="text-slate-600 mt-2">
              Manage your account and complete KYC verification
            </p>
          </div>

          {/* Message */}
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-gap-2 ${
                message.type === 'error'
                  ? 'bg-red-50 border border-red-200'
                  : 'bg-green-50 border border-green-200'
              }`}
            >
              {message.type === 'error' ? (
                <AlertCircle className="text-red-600 mr-3  shrink-0" size={20} />
              ) : (
                <CheckCircle className="text-green-600 mr-3 shrink-0" size={20} />
              )}
              <p
                className={
                  message.type === 'error'
                    ? 'text-red-700'
                    : 'text-green-700'
                }
              >
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="text-blue-600" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Personal Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Aadhaar Verification */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <FileText className="text-emerald-600" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Aadhaar Details
                  </h2>
                  <p className="text-slate-600 text-sm">
                    12-digit Aadhaar number
                  </p>
                </div>
                {formData.aadhaar && (
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Verified
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  placeholder="XXXX-XXXX-XXXX"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  disabled={loading}
                  maxLength="12"
                />
              </div>
            </div>

            {/* PAN Verification */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <FileText className="text-amber-600" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    PAN Details
                  </h2>
                  <p className="text-slate-600 text-sm">
                    10-character PAN number
                  </p>
                </div>
                {formData.pan && (
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Verified
                  </div>
                )}
              </div>

              <div>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="AAAPA1234A"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
                  disabled={loading}
                  maxLength="10"
                />
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <DollarSign className="text-indigo-600" size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Bank Details
                  </h2>
                  <p className="text-slate-600 text-sm">
                    Your bank account information
                  </p>
                </div>
                {formData.bankAccountNumber && (
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Verified
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="HDFC Bank"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    disabled={loading}
                  />
                </div>

                {/* Account Holder Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    name="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    disabled={loading}
                  />
                </div>

                {/* Account Number */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={handleChange}
                    placeholder="1234567890123456"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    disabled={loading}
                  />
                </div>

                {/* IFSC Code */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    name="bankIFSC"
                    value={formData.bankIFSC}
                    onChange={handleChange}
                    placeholder="HDFC0001234"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
                }`}
              >
                {loading ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
