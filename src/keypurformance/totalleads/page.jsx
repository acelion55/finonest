import React, { useState, useEffect } from 'react'
import { Filter, Copy, Eye } from 'lucide-react'
import Nav from "../../components/navbar"

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchAllApplications();
  }, []);

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all applications in parallel
      const responses = await Promise.all([
        fetch('http://localhost:5000/api/creditcard-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/personal-loan-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/car-loan-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/offline-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/business-loan-applications/all').catch(err => ({ ok: false, error: err })),
      ]);

      const allLeads = [];

      // Process credit card applications
      if (responses[0].ok) {
        const creditCardData = await responses[0].json();
        if (creditCardData.data && Array.isArray(creditCardData.data)) {
          creditCardData.data.forEach(app => {
            allLeads.push({
              ...app,
              type: 'Credit Card',
              product: app.cardName || 'Credit Card',
              bank: app.bank || 'N/A',
              applicationType: 'creditcard'
            });
          });
        }
      }

      // Process personal loan applications
      if (responses[1].ok) {
        const personalLoanData = await responses[1].json();
        if (personalLoanData.data && Array.isArray(personalLoanData.data)) {
          personalLoanData.data.forEach(app => {
            allLeads.push({
              ...app,
              type: 'Personal Loan',
              product: app.loanName || 'Personal Loan',
              bank: app.bank || 'N/A',
              applicationType: 'personalloan'
            });
          });
        }
      }

      // Process car loan applications
      if (responses[2].ok) {
        const carLoanData = await responses[2].json();
        if (carLoanData.data && Array.isArray(carLoanData.data)) {
          carLoanData.data.forEach(app => {
            allLeads.push({
              ...app,
              type: 'Car Loan',
              product: app.loanName || 'Car Loan',
              bank: app.bank || 'N/A',
              applicationType: 'carloan'
            });
          });
        }
      }

      // Process offline applications
      if (responses[3].ok) {
        const offlineData = await responses[3].json();
        if (offlineData.data && Array.isArray(offlineData.data)) {
          offlineData.data.forEach(app => {
            allLeads.push({
              ...app,
              type: 'Offline Loan',
              product: 'Offline Personal Loan',
              bank: 'Direct',
              applicationType: 'offline'
            });
          });
        }
      }

      // Process business loan applications
      if (responses[4].ok) {
        const businessData = await responses[4].json();
        if (businessData.data && Array.isArray(businessData.data)) {
          businessData.data.forEach(app => {
            allLeads.push({
              ...app,
              type: 'Business Loan',
              product: app.businessName || 'Business Loan',
              bank: 'Business',
              applicationType: 'business'
            });
          });
        }
      }

      // Sort by creation date (newest first)
      allLeads.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.appliedAt || 0);
        const dateB = new Date(b.createdAt || b.appliedAt || 0);
        return dateB - dateA;
      });
      
      console.log('All leads loaded:', allLeads);
      setLeads(allLeads);

      if (allLeads.length === 0) {
        console.warn('No applications found in the database');
        setError('No applications found. Submit a form to see results here.');
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load leads. Make sure the backend server is running on http://localhost:5000');
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = filterType === 'all' 
    ? leads 
    : leads.filter(lead => lead.applicationType === filterType);

  const handleCopyURL = (leadId) => {
    const url = `${window.location.origin}/lead/${leadId}`;
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Leads & Applications</h1>
            <p className="text-slate-600">View all submitted applications across all products</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center gap-4 flex-wrap">
            <Filter size={20} className="text-slate-600" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Applications</option>
              <option value="creditcard">Credit Card</option>
              <option value="personalloan">Personal Loan</option>
              <option value="carloan">Car Loan</option>
              <option value="offline">Offline Loan</option>
              <option value="business">Business Loan</option>
            </select>
            <span className="text-sm text-slate-600 ml-auto">
              Total: <span className="font-semibold">{filteredLeads.length}</span> leads
            </span>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-slate-500">Loading leads...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Lead ID</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Date/Time</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Phone</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Product</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Bank</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Advisor</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-left font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead, index) => (
                      <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-700 font-mono text-xs">{lead._id?.substring(0, 8) || 'N/A'}</td>
                        <td className="px-6 py-4 text-slate-700 whitespace-nowrap text-xs">{formatDate(lead.createdAt)}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">{lead.fullName}</td>
                        <td className="px-6 py-4 text-slate-700">{lead.mobileNumber}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {lead.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-700 text-sm">{lead.product}</td>
                        <td className="px-6 py-4 text-slate-700 text-sm">{lead.bank}</td>
                        <td className="px-6 py-4 text-slate-700 text-sm">harsh vardhan</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status || 'pending')}`}>
                            {(lead.status || 'pending').charAt(0).toUpperCase() + (lead.status || 'pending').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => alert(`History for ${lead.fullName}`)}
                              className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 transition-colors"
                            >
                              History
                            </button>
                            <button
                              onClick={() => handleCopyURL(lead._id)}
                              className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <Copy size={14} /> Copy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="px-6 py-8 text-center text-slate-500">
                        No leads found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && leads.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-slate-500 text-lg">No applications submitted yet</p>
              <p className="text-slate-400 text-sm mt-2">Applications will appear here as users submit them</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default LeadsPage
