import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Nav from "../../components/navbar";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ApprovedPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, rate: 0 });

  useEffect(() => {
    fetchApprovedApplications();
  }, []);

  const fetchApprovedApplications = async () => {
    try {
      setLoading(true);
      const allApps = [];
      let totalApps = 0;

      const responses = await Promise.all([
        fetch(`${API_URL}/api/creditcard-applications/all`).catch(err => ({ ok: false })),
        fetch(`${API_URL}/api/personal-loan-applications/all`).catch(err => ({ ok: false })),
        fetch(`${API_URL}/api/car-loan-applications/all`).catch(err => ({ ok: false })),
        fetch(`${API_URL}/api/offline-applications/all`).catch(err => ({ ok: false })),
        fetch(`${API_URL}/api/business-loan-applications/all`).catch(err => ({ ok: false })),
      ]);

      const typeNames = ['Credit Card', 'Personal Loan', 'Car Loan', 'Offline Loan', 'Business Loan'];

      for (let i = 0; i < responses.length; i++) {
        if (responses[i].ok) {
          const data = await responses[i].json();
          if (data.data && Array.isArray(data.data)) {
            data.data.forEach(app => {
              totalApps++;
              const status = (app.status || '').toLowerCase();
              if (status === 'approved') {
                allApps.push({
                  ...app,
                  type: typeNames[i],
                  dateField: app.createdAt || app.appliedAt,
                });
              }
            });
          }
        }
      }

      allApps.sort((a, b) => new Date(b.dateField) - new Date(a.dateField));
      const thisMonth = allApps.filter(app => new Date(app.dateField).getMonth() === new Date().getMonth()).length;
      const rate = totalApps > 0 ? Math.round((allApps.length / totalApps) * 100) : 0;

      setApplications(allApps);
      setStats({ total: allApps.length, thisMonth, rate });
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <>
    <Nav />
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-600 p-2 rounded text-white">
          <CheckCircle size={24} />
        </div>
        <h1 className="text-3xl font-bold">Approved Applications</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Successfully Processed</h2>
        <p className="text-gray-600 mb-4">View all approved and successfully processed applications.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">Total Approved</p>
            <p className="text-3xl font-bold text-green-600">{stats.total}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-green-600">{stats.rate}%</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">This Month</p>
            <p className="text-3xl font-bold text-green-600">{stats.thisMonth}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-semibold">Lead ID</th>
                  <th className="text-left py-2 font-semibold">Customer Name</th>
                  <th className="text-left py-2 font-semibold">Product</th>
                  <th className="text-left py-2 font-semibold">Type</th>
                  <th className="text-left py-2 font-semibold">Approval Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 text-sm">{app._id?.substring(0, 8) || 'N/A'}</td>
                      <td className="py-2 font-medium">{app.fullName}</td>
                      <td className="py-2 text-sm">{app.product || app.loanName || app.cardName || app.businessName || 'N/A'}</td>
                      <td className="py-2 text-sm">{app.type}</td>
                      <td className="py-2 text-sm">{formatDate(app.dateField)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b text-center text-gray-500">
                    <td colSpan="5" className="py-8">No approved applications</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
 