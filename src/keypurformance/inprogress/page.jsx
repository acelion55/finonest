import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import Nav from "../../components/navbar";

export default function InProgressPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, avgDays: 0 });

  useEffect(() => {
    fetchInProgressApplications();
  }, []);

  const fetchInProgressApplications = async () => {
    try {
      setLoading(true);
      const allApps = [];

      const responses = await Promise.all([
        fetch('http://localhost:5000/api/creditcard-applications/all').catch(err => ({ ok: false })),
        fetch('http://localhost:5000/api/personal-loan-applications/all').catch(err => ({ ok: false })),
        fetch('http://localhost:5000/api/car-loan-applications/all').catch(err => ({ ok: false })),
        fetch('http://localhost:5000/api/offline-applications/all').catch(err => ({ ok: false })),
        fetch('http://localhost:5000/api/business-loan-applications/all').catch(err => ({ ok: false })),
      ]);

      const typeNames = ['Credit Card', 'Personal Loan', 'Car Loan', 'Offline Loan', 'Business Loan'];

      for (let i = 0; i < responses.length; i++) {
        if (responses[i].ok) {
          const data = await responses[i].json();
          if (data.data && Array.isArray(data.data)) {
            data.data.forEach(app => {
              const status = (app.status || 'pending').toLowerCase();
              if (status === 'pending') {
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
      
      let totalDays = 0;
      allApps.forEach(app => {
        const days = Math.floor((new Date() - new Date(app.dateField)) / (1000 * 60 * 60 * 24));
        totalDays += days;
      });
      const avgDays = allApps.length > 0 ? Math.round(totalDays / allApps.length) : 0;

      setApplications(allApps);
      setStats({ total: allApps.length, thisMonth, avgDays });
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
        <div className="bg-amber-600 p-2 rounded text-white">
          <Clock size={24} />
        </div>
        <h1 className="text-3xl font-bold">In Progress Applications</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Under Processing</h2>
        <p className="text-gray-600 mb-4">View all applications currently being processed.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">Total In Progress</p>
            <p className="text-3xl font-bold text-amber-600">{stats.total}</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">Avg. Processing Time</p>
            <p className="text-3xl font-bold text-amber-600">{stats.avgDays}d</p>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <p className="text-gray-600 text-sm mb-2">This Month</p>
            <p className="text-3xl font-bold text-amber-600">{stats.thisMonth}</p>
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
                  <th className="text-left py-2 font-semibold">Submitted Date</th>
                  <th className="text-left py-2 font-semibold">Status</th>
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
                      <td className="py-2 text-sm"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded text-xs font-semibold">Pending</span></td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-b text-center text-gray-500">
                    <td colSpan="6" className="py-8">No applications in progress</td>
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