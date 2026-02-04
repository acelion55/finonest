import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyLinks = () => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/product-links/all`);
      const data = await response.json();
      if (data.success) {
        setLinks(data.data);
        setError('');
      }
    } catch (err) {
      setError('Failed to fetch links');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link.shareableUrl);
    setCopiedId(link._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteLink = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    
    try {
      const response = await fetch(`${API_URL}/api/product-links/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        setLinks(links.filter(link => link._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    const badgeStyles = {
      active: 'bg-green-100 text-green-700',
      inactive: 'bg-gray-100 text-gray-700',
      expired: 'bg-red-100 text-red-700',
    };
    return badgeStyles[status] || badgeStyles.active;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-slate-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-3xl font-bold text-slate-900">My Generated Links</h1>
            </div>
            <button
              onClick={() => navigate('/generatelink')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Generate New Link
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Links Table */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-lg overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-slate-500">Loading your links...</div>
            ) : links.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-900">Product</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Bank</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Code</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Clicks</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Status</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Created</th>
                      <th className="px-6 py-4 font-semibold text-slate-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {links.map((link) => (
                      <tr key={link._id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{link.productName}</p>
                            <p className="text-xs text-slate-500">{link.productType}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700">{link.bank}</td>
                        <td className="px-6 py-4">
                          <code className="bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-800">
                            {link.uniqueCode}
                          </code>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{link.clicks}</p>
                            <p className="text-xs text-slate-500">{link.conversions} conversions</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(link.status)}`}>
                            {link.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 text-xs">
                          {new Date(link.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopyLink(link)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition"
                              title="Copy link"
                            >
                              {copiedId === link._id ? (
                                <Check size={18} className="text-green-600" />
                              ) : (
                                <Copy size={18} className="text-blue-600" />
                              )}
                            </button>
                            <a
                              href={link.shareableUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-slate-100 rounded-lg transition"
                              title="View link"
                            >
                              <Eye size={18} className="text-slate-600" />
                            </a>
                            <button
                              onClick={() => handleDeleteLink(link._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition"
                              title="Delete link"
                            >
                              <Trash2 size={18} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-slate-600 mb-4">No links generated yet</p>
                <button
                  onClick={() => navigate('/generatelink')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Create Your First Link
                </button>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {links.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <p className="text-sm text-slate-600 mb-2">Total Links</p>
                <p className="text-3xl font-bold text-slate-900">{links.length}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <p className="text-sm text-slate-600 mb-2">Total Clicks</p>
                <p className="text-3xl font-bold text-slate-900">{links.reduce((sum, l) => sum + l.clicks, 0)}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <p className="text-sm text-slate-600 mb-2">Total Conversions</p>
                <p className="text-3xl font-bold text-slate-900">{links.reduce((sum, l) => sum + l.conversions, 0)}</p>
              </div>
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                <p className="text-sm text-slate-600 mb-2">Conversion Rate</p>
                <p className="text-3xl font-bold text-slate-900">
                  {links.length > 0 
                    ? ((links.reduce((sum, l) => sum + l.conversions, 0) / links.reduce((sum, l) => sum + l.clicks, 0)) * 100 || 0).toFixed(1)
                    : 0}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyLinks;
