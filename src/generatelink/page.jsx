import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const GenerateLink = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productType: '',
    bank: '',
    productName: '',
    productId: '',
    referralName: '',
    source: '',
    campaign: '',
  });

  const [banks, setBanks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const productTypes = [
    { label: 'Car Loan', value: 'carloan' },
    { label: 'Credit Card', value: 'creditcard' },
    { label: 'Personal Loan', value: 'personalloan' },
    { label: 'Business Loan', value: 'businessloan' },
    { label: 'Offline', value: 'offline' },
  ];

  // Fetch banks when product type changes
  useEffect(() => {
    if (formData.productType) {
      fetchBanks();
      setFormData(prev => ({ ...prev, bank: '', productName: '', productId: '' }));
      setProducts([]);
    }
  }, [formData.productType]);

  // Fetch products when bank changes
  useEffect(() => {
    if (formData.productType && formData.bank) {
      fetchProducts();
      setFormData(prev => ({ ...prev, productName: '', productId: '' }));
    }
  }, [formData.bank]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/product-links/banks/${formData.productType}`
      );
      const data = await response.json();
      if (data.success) {
        setBanks(data.data);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch banks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/api/product-links/products/${formData.productType}/${formData.bank}`
      );
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductSelect = (product) => {
    setFormData(prev => ({
      ...prev,
      productName: product.name,
      productId: product.id,
    }));
  };

  const handleGenerateLink = async () => {
    try {
      if (!formData.productType || !formData.bank || !formData.productName || !formData.productId) {
        setError('Please select all required fields');
        return;
      }

      setLoading(true);
      const response = await fetch(`${API_URL}/api/product-links/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productType: formData.productType,
          bank: formData.bank,
          productName: formData.productName,
          productId: formData.productId,
          referralName: formData.referralName || 'Anonymous',
          source: formData.source || 'Direct',
          campaign: formData.campaign || 'General',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedLink(data.data);
        setError('');
      } else {
        setError(data.message || 'Failed to generate link');
      }
    } catch (err) {
      setError('Failed to generate link');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink.shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData({
      productType: '',
      bank: '',
      productName: '',
      productId: '',
      referralName: '',
      source: '',
      campaign: '',
    });
    setGeneratedLink(null);
    setBanks([]);
    setProducts([]);
    setError('');
  };

  if (generatedLink) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
                >
                  <ArrowLeft size={20} />
                  Back
                </button>
                <h1 className="text-3xl font-bold text-slate-900">Link Generated Successfully</h1>
              </div>
              <button
                onClick={() => navigate('/generatelink/mylinks')}
                className="bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
              >
                My Links
              </button>
            </div>

            {/* Success Card */}
            <div className="bg-white rounded-lg border-2 border-green-200 shadow-lg p-8 mb-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">Link Created!</h2>
                <p className="text-slate-600">Your shareable product link is ready to use.</p>
              </div>

              {/* Product Details */}
              <div className="bg-slate-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-slate-900 mb-4">Product Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Product Type</p>
                    <p className="text-slate-900 font-semibold">{formData.productType.toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Bank</p>
                    <p className="text-slate-900 font-semibold">{formData.bank}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Product Name</p>
                    <p className="text-slate-900 font-semibold">{formData.productName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Product ID</p>
                    <p className="text-slate-900 font-semibold">#{formData.productId}</p>
                  </div>
                </div>
              </div>

              {/* Link Display */}
              <div className="mb-6">
                <p className="text-sm text-slate-500 font-medium mb-3">Your Shareable Link</p>
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink.shareableUrl}
                    className="flex-1 bg-transparent text-sm text-slate-900 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
                  >
                    {copied ? (
                      <>
                        <Check size={18} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={18} /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Link Code */}
              <div className="mb-6">
                <p className="text-sm text-slate-500 font-medium mb-2">Unique Code</p>
                <p className="text-lg font-mono font-bold text-slate-900 bg-slate-100 p-3 rounded">
                  {generatedLink.uniqueCode}
                </p>
              </div>

              {/* Link Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Clicks</p>
                  <p className="text-2xl font-bold text-slate-900">{generatedLink.clicks || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Conversions</p>
                  <p className="text-2xl font-bold text-slate-900">{generatedLink.conversions || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Status</p>
                  <p className="text-xl font-bold text-green-600 capitalize">{generatedLink.status}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-slate-100 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition"
                >
                  Generate Another Link
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-bold text-slate-900">Generate Product Link</h1>
            </div>
            <button
              onClick={() => navigate('/generatelink/mylinks')}
              className="bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition"
            >
              My Links
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-lg p-8">
            <div className="space-y-6">
              {/* Step 1: Product Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Step 1: Select Product Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Choose a product type...</option>
                  {productTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Bank */}
              {formData.productType && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Step 2: Select Bank <span className="text-red-600">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {loading ? (
                      <p className="text-slate-500">Loading banks...</p>
                    ) : banks.length > 0 ? (
                      banks.map(bank => (
                        <button
                          key={bank}
                          onClick={() => setFormData(prev => ({ ...prev, bank }))}
                          className={`p-3 rounded-lg border-2 font-semibold transition ${
                            formData.bank === bank
                              ? 'border-blue-600 bg-blue-50 text-blue-900'
                              : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                          }`}
                        >
                          {bank}
                        </button>
                      ))
                    ) : (
                      <p className="text-slate-500">No banks available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Product */}
              {formData.bank && (
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-3">
                    Step 3: Select Product <span className="text-red-600">*</span>
                  </label>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {loading ? (
                      <p className="text-slate-500">Loading products...</p>
                    ) : products.length > 0 ? (
                      products.map(product => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className={`w-full p-4 rounded-lg border-2 transition text-left ${
                            formData.productId === product.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            {product.image && (
                              <img src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
                            )}
                            <div>
                              <h3 className="font-semibold text-slate-900">{product.name}</h3>
                              <p className="text-sm text-slate-600">ID: #{product.id}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="text-slate-500">No products available</p>
                    )}
                  </div>
                </div>
              )}

              {/* Optional Information */}
              {formData.productType && formData.bank && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-4">Optional Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Referral Name</label>
                      <input
                        type="text"
                        name="referralName"
                        value={formData.referralName}
                        onChange={handleChange}
                        placeholder="Your name (optional)"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Campaign Name</label>
                      <input
                        type="text"
                        name="campaign"
                        value={formData.campaign}
                        onChange={handleChange}
                        placeholder="e.g., Social Media, Email"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-2">Source</label>
                      <input
                        type="text"
                        name="source"
                        value={formData.source}
                        onChange={handleChange}
                        placeholder="e.g., Direct, Referral, Website"
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerateLink}
                disabled={!formData.productType || !formData.bank || !formData.productName || loading}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate Link'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerateLink;
