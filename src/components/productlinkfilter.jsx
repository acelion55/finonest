import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Search, Copy, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const ProductLinkFilter = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [productType, setProductType] = useState('');
  const [bank, setBank] = useState('');
  const [product, setProduct] = useState(null);
  
  const [banks, setBanks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedLink, setGeneratedLink] = useState(null);
  const [copied, setCopied] = useState(false);

  const productTypes = [
    { label: 'Credit Card', value: 'creditcard' },
    { label: 'Car Loan', value: 'carloan' },
    { label: 'Personal Loan', value: 'personalloan' },
  ];

  // Fetch banks when product type changes
  useEffect(() => {
    if (productType) {
      fetchBanks();
      setBank('');
      setProduct(null);
      setProducts([]);
      setStep(2);
    }
  }, [productType]);

  // Fetch products when bank changes
  useEffect(() => {
    if (productType && bank) {
      fetchProducts();
      setProduct(null);
      setStep(3);
    }
  }, [bank]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      
      // Map product type to correct API endpoint
      const endpointMap = {
        creditcard: 'creditcards',
        carloan: 'car-loans',
        personalloan: 'personal-loans',
      };
      
      const endpoint = `${API_URL}/api/${endpointMap[productType]}/filter/banks`;
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.success) {
        setBanks(data.data || []);
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
      
      // Map product type to correct API endpoint
      const endpointMap = {
        creditcard: 'creditcards',
        carloan: 'car-loans',
        personalloan: 'personal-loans',
      };
      
      const endpoint = `${API_URL}/api/${endpointMap[productType]}/filter/bybank/${encodeURIComponent(bank)}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      if (data.success) {
        setProducts(data.data || []);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (!product) return;

    // Navigate to apply page based on product type
    const applyRoutes = {
      creditcard: `/productportfolio/creditcard/creditapply/${product.id}`,
      carloan: `/productportfolio/carloan/apply/${product.id}`,
      personalloan: `/productportfolio/persnolloan/apply/${product.id}`,
    };

    const route = applyRoutes[productType];
    if (route) {
      navigate(route);
    }
  };

  const generateLink = () => {
    if (!product) return;

    // Generate full shareable link with current domain
    const baseUrl = window.location.origin;
    const applyRoutes = {
      creditcard: `/productportfolio/creditcard/creditapply/${product.id}`,
      carloan: `/productportfolio/carloan/apply/${product.id}`,
      personalloan: `/productportfolio/persnolloan/apply/${product.id}`,
    };

    const route = applyRoutes[productType];
    const fullLink = `${baseUrl}${route}`;
    
    setGeneratedLink({
      url: fullLink,
      productName: product.name,
      bank: bank,
      type: productType,
      timestamp: new Date().toLocaleString(),
    });
  };

  const copyToClipboard = async () => {
    if (!generatedLink) return;
    
    try {
      await navigator.clipboard.writeText(generatedLink.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setStep(1);
    setProductType('');
    setBank('');
    setProduct(null);
    setBanks([]);
    setProducts([]);
    setError('');
    setGeneratedLink(null);
    setCopied(false);
  };

  return (
    <div className="w-full bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6 md:p-8 shadow-lg">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Generate Product Link & Apply
          </h3>
          <p className="text-slate-600">
            Select a product category, bank, and product to generate a shareable link and apply
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: Product Type Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="text-lg font-semibold text-slate-900">Select Product Type</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {productTypes.map(type => (
              <button
                key={type.value}
                onClick={() => setProductType(type.value)}
                className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                  productType === type.value
                    ? 'border-blue-600 bg-white text-blue-600 shadow-md'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Bank Selection */}
        {productType && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h4 className="text-lg font-semibold text-slate-900">Select Bank</h4>
            </div>

            {loading ? (
              <div className="text-slate-600">Loading banks...</div>
            ) : banks.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {banks.map(bankName => (
                  <button
                    key={bankName}
                    onClick={() => setBank(bankName)}
                    className={`p-3 rounded-lg border-2 font-semibold text-sm transition-all ${
                      bank === bankName
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {bankName}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-slate-600">No banks available</div>
            )}
          </div>
        )}

        {/* Step 3: Product Selection */}
        {bank && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h4 className="text-lg font-semibold text-slate-900">Select Product</h4>
            </div>

            {loading ? (
              <div className="text-slate-600">Loading products...</div>
            ) : products.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => setProduct(prod)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      product?.id === prod.id
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {prod.image && (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h5 className="font-semibold text-slate-900">{prod.name}</h5>
                        <p className="text-xs text-slate-500">ID: #{prod.id} • {bank}</p>
                        {prod.features && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {prod.features.slice(0, 2).map((feature, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {product?.id === prod.id && (
                        <div className="text-blue-600">✓</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-slate-600">No products available</div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {product && !generatedLink && (
          <div className="flex gap-3 pt-6 border-t border-slate-200">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={generateLink}
              className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Generate Link & Apply
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Generated Link Section */}
        {generatedLink && (
          <div className="   rounded-xl p-6 shadow-lg">
             

            {/* Link Display */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
              <p className="text-xs text-slate-500 mb-2">Shareable Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedLink.url}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded text-sm text-slate-900 font-mono overflow-hidden"
                />
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-2 rounded font-semibold flex items-center gap-2 transition-colors ${
                    copied
                      ? 'bg-green-500 '
                      : 'bg-blue-600  hover:bg-blue-700'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGeneratedLink(null);
                  setCopied(false);
                }}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Generate Another
              </button>
              
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 rounded-lg bg-slate-600  font-semibold hover:bg-slate-700 transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        )}

        {/* Product Selected Info */}
        {product && (
          <div className="mt-6 p-4 bg-white border-l-4 border-green-500 rounded-lg">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">Selected:</span> {product.name} from {bank} ({productType})
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductLinkFilter;
