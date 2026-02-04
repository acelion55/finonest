import React, { useState, useEffect } from 'react';
import { 
  Hourglass, 
  CalendarCheck, 
  Wallet, 
  BarChart3, 
  PlusCircle, 
  Coins, 
  Download,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/navbar"

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const PayoutDashboard = () => {
  const navigate = useNavigate();
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    thisMonth: 0,
    totalPaid: 0,
    lastMonth: 0,
    accruedThisMonth: 0,
    totalCommission: 0,
  });

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/payouts/all`);
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setPayouts(data.data);

        // Calculate statistics
        let pending = 0;
        let thisMonth = 0;
        let totalPaid = 0;
        let lastMonth = 0;
        let accruedThisMonth = 0;
        let totalCommission = 0;

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonthDate = new Date(currentYear, currentMonth - 1, 1);

        data.data.forEach(payout => {
          const payoutDate = new Date(payout.createdAt);
          const payoutMonth = payoutDate.getMonth();
          const payoutYear = payoutDate.getFullYear();

          // Count pending payouts
          if (payout.payoutStatus === 'pending') {
            pending += payout.finalPayout || 0;
          }

          // Count this month
          if (payoutMonth === currentMonth && payoutYear === currentYear) {
            thisMonth += payout.finalPayout || 0;
            accruedThisMonth += payout.finalPayout || 0;
          }

          // Count total paid
          if (payout.payoutStatus === 'completed') {
            totalPaid += payout.finalPayout || 0;
          }

          // Count last month
          if (payoutMonth === currentMonth - 1 && payoutYear === currentYear) {
            lastMonth += payout.finalPayout || 0;
          }

          // Total commission
          totalCommission += payout.commission || 0;
        });

        setStats({
          pending,
          thisMonth,
          totalPaid,
          lastMonth,
          accruedThisMonth,
          totalCommission,
        });
      }
    } catch (error) {
      console.error('Error fetching payouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    { title: 'Pending Payouts', value: `₹${stats.pending.toLocaleString()}`, sub: 'Awaiting payment', icon: <Hourglass />, bgColor: 'bg-amber-500' },
    { title: 'Paid This Month', value: `₹${stats.thisMonth.toLocaleString()}`, sub: 'Current month earnings', icon: <CalendarCheck />, bgColor: 'bg-green-500' },
    { title: 'Total Paid Till Now', value: `₹${stats.totalPaid.toLocaleString()}`, sub: 'Lifetime earnings', icon: <Wallet />, bgColor: 'bg-blue-600' },
  ];

  const secondaryCards = [
    { title: 'Last Month', value: `₹${stats.lastMonth.toLocaleString()}`, icon: <BarChart3 className="text-slate-400" /> },
    { title: 'Accrued This Month', value: `₹${stats.accruedThisMonth.toLocaleString()}`, icon: <PlusCircle className="text-purple-500" />, valueColor: 'text-purple-600' },
    { title: 'Total Commission', value: `₹${stats.totalCommission.toLocaleString()}`, sub: 'Direct + Referral', icon: <Coins className="text-indigo-500" />, valueColor: 'text-indigo-700' },
  ];

  const getPayoutStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value) => {
    return `₹${(value || 0).toLocaleString()}`;
  };

  return (
    <>
    <Nav/>
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/payout')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Payout Dashboard</h1>
        </div>
        <div className="flex gap-4">
          <select className="border border-slate-300 rounded px-4 py-2 bg-white text-sm outline-none">
            <option>All Records</option>
            <option>This Month</option>
            <option>Last Month</option>
          </select>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition">
            <Download size={18} />
            Download Report
          </button>
        </div>
      </div>

      {/* Primary Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {summaryCards.map((card, idx) => (
          <div key={idx} className={`${card.bgColor} text-white p-6 rounded-lg shadow-sm relative overflow-hidden`}>
            <p className="text-sm font-medium opacity-90 mb-4">{card.title}</p>
            <h2 className="text-4xl font-bold mb-4">{card.value}</h2>
            <p className="text-xs opacity-80">{card.sub}</p>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-40 scale-[2.5]">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {secondaryCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm flex justify-between items-start">
            <div>
              <p className="text-sm text-slate-500 font-medium mb-4">{card.title}</p>
              <h2 className={`text-3xl font-bold ${card.valueColor || 'text-slate-800'}`}>{card.value}</h2>
              {card.sub && <p className="text-xs text-slate-400 mt-4">{card.sub}</p>}
            </div>
            <div className="scale-125">{card.icon}</div>
          </div>
        ))}
      </div>

      {/* Lead-wise Table Section */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Lead-wise Payout Report</h3>
          <span className="text-xs text-slate-400">Filtered by: <strong className="text-slate-600">All</strong></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs uppercase tracking-wider text-slate-500">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Lead ID</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Lead Status</th>
                <th className="px-4 py-3 font-semibold">Commission</th>
                <th className="px-4 py-3 font-semibold">Bonus</th>
                <th className="px-4 py-3 font-semibold">Deduction</th>
                <th className="px-4 py-3 font-semibold">Final Payout</th>
                <th className="px-4 py-3 font-semibold">Remark</th>
                <th className="px-4 py-3 font-semibold">Payout Status</th>
                <th className="px-4 py-3 font-semibold">Payout Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="border-b border-slate-50">
                  <td colSpan="11" className="px-4 py-12 text-center text-slate-400 normal-case italic">
                    Loading payouts...
                  </td>
                </tr>
              ) : payouts && payouts.length > 0 ? (
                payouts.map((payout, idx) => (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-slate-800 font-medium">{payout.leadId}</td>
                    <td className="px-4 py-3 text-slate-700">{payout.customerName}</td>
                    <td className="px-4 py-3 text-slate-700">{payout.product}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        payout.leadStatus === 'approved' ? 'bg-green-100 text-green-700' :
                        payout.leadStatus === 'rejected' ? 'bg-red-100 text-red-700' :
                        payout.leadStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {payout.leadStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{formatCurrency(payout.commission)}</td>
                    <td className="px-4 py-3   font-medium text-green-600">{formatCurrency(payout.bonus)}</td>
                    <td className="px-4 py-3 font-medium text-red-600">{formatCurrency(payout.deduction)}</td>
                    <td className="px-4 py-3 text-blue-800 font-bold ">{formatCurrency(payout.finalPayout)}</td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{payout.remark || '-'}</td>
                    <td className="px-4 py-3">
                      {getPayoutStatusBadge(payout.payoutStatus)}
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs">{payout.payoutDate ? new Date(payout.payoutDate).toLocaleDateString('en-IN') : '-'}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-b border-slate-50">
                  <td colSpan="11" className="px-4 py-12 text-center text-slate-400 normal-case italic">
                    No payout records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
};

export default PayoutDashboard;