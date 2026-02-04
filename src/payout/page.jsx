import React from 'react';
import { 
  Download, Wallet, Calendar, Hourglass, 
  BarChart3, PlusCircle, Coins, ChevronDown, Users, ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Nav from "../components/navbar"

const PayoutPage = () => {
  const navigate = useNavigate();

  const handleViewPayouts = () => {
    navigate('/payout/gotopayout');
  };
  return (<>
  <Nav/>
  <div className=\"p-3 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8 bg-slate-50 min-h-screen\">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Payout Summary</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-auto">
            <select className="appearance-none w-full bg-white border border-slate-200 px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm">
              <option>All Records</option>
              <option>This Month</option>
              <option>Last Month</option>
            </select>
            <ChevronDown className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" size={16} />
          </div>
          <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 whitespace-nowrap">
            <Download size={18} /> Download Report
          </button>
        </div>
      </div>

      {/* --- Section 1: Top Payout Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <PrimaryCard 
          label="Pending Payouts" 
          amount="₹0" 
          sub="Awaiting payment" 
          icon={<Hourglass size={32} />} 
          bgColor="bg-[#D4A017]" // Mustard/Yellowish color from screenshot
        />
        <PrimaryCard 
          label="Paid This Month" 
          amount="₹0" 
          sub="Current month earnings" 
          icon={<Calendar size={32} />} 
          bgColor="bg-[#28a745]" // Solid Green
        />
        <PrimaryCard 
          label="Total Paid Till Now" 
          amount="₹0" 
          sub="Lifetime earnings" 
          icon={<Wallet size={32} />} 
          bgColor="bg-[#2B7FFF]" // Bright Blue
        />
      </div>

      {/* --- Section 2: Middle Summary Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SecondaryCard 
          label="Last Month" 
          amount="₹0" 
          icon={<BarChart3 size={24} className="text-slate-400" />} 
        />
        <SecondaryCard 
          label="Accrued This Month" 
          amount="₹0" 
          icon={<PlusCircle size={24} className="text-purple-500" />} 
          amountColor="text-purple-600"
        />
        <SecondaryCard 
          label="Total Commission" 
          amount="₹0" 
          sub="Direct + Referral"
          icon={<Coins size={24} className="text-blue-400" />} 
          amountColor="text-blue-700"
        />
      </div>

      {/* --- Section: View Payouts Button --- */}
      <div className="flex justify-center">
        <button
          onClick={handleViewPayouts}
          className="flex items-center gap-2 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
        >
          View All Payouts
          <ArrowRight size={20} />
        </button>
      </div>

      {/* --- Section 3: Lead-wise Payout Report Table --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-3 md:p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="font-bold text-slate-700 text-sm md:text-base">Lead-wise Payout Report</h2>
          <span className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold">Filtered by: <span className="text-slate-600">All</span></span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Lead ID', 'Customer', 'Product', 'Lead Status', 'Commission', 'Bonus', 'Deduction', 'Final Payout', 'Status'].map((header) => (
                  <th key={header} className="px-3 md:px-4 py-2 md:py-3 text-[9px] md:text-[10px] font-bold text-slate-500 uppercase whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-50 last:border-0">
                <td colSpan="9" className="px-6 py-8 md:py-10 text-center text-slate-400 text-xs md:text-sm italic">
                  No data found in this section
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Section 4: Team Bonus Tracker (From Screenshot 185139) --- */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-6 text-lg">Team Bonus Tracker</h2>
        
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:gap-8 text-center">
            
            {/* Title & Icon */}
            <div className="w-full md:w-auto md:absolute md:top-4 md:left-6 flex items-center gap-2 md:gap-2">
               <div className="bg-blue-600 p-1.5 rounded text-white flex-shrink-0">
                 <Users size={16} />
               </div>
               <div className="text-left">
                 <p className="text-sm font-bold text-blue-900 leading-tight">Team Hierarchy Bonus</p>
                 <p className="text-[10px] text-blue-600 hidden md:block">Earn 5% bonus on your team's sales performance</p>
               </div>
            </div>

            {/* Metrics */}
            <div className="mt-4 md:mt-12">
              <h4 className="text-2xl md:text-3xl font-bold text-blue-700">0</h4>
              <p className="text-[10px] md:text-[11px] font-bold text-blue-400 uppercase tracking-wide mt-1">Team Members</p>
            </div>

            <div className="mt-4 md:mt-12">
              <h4 className="text-2xl md:text-3xl font-bold text-blue-700">₹0</h4>
              <p className="text-[10px] md:text-[11px] font-bold text-blue-400 uppercase tracking-wide mt-1">Team Sales</p>
            </div>

            <div className="mt-4 md:mt-12">
              <h4 className="text-2xl md:text-3xl font-bold text-blue-700">₹0</h4>
              <p className="text-[10px] md:text-[11px] font-bold text-blue-400 uppercase tracking-wide mt-1">Your Bonus (5%)</p>
            </div>

          </div>
        </div>
      </div>

    </div>
    </>
  );
};

// --- Helper Components ---

const PrimaryCard = ({ label, amount, sub, icon, bgColor }) => (
  <div className={`${bgColor} rounded-2xl p-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden`}>
    <div className="z-10">
      <p className="text-xs font-medium opacity-90 mb-1">{label}</p>
      <h3 className="text-4xl font-bold mb-1">{amount}</h3>
      <p className="text-[10px] opacity-80">{sub}</p>
    </div>
    <div className="opacity-25 scale-125">
      {icon}
    </div>
  </div>
);

const SecondaryCard = ({ label, amount, sub, icon, amountColor = "text-slate-800" }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex justify-between items-start">
    <div>
      <p className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-wider">{label}</p>
      <h3 className={`text-3xl font-bold ${amountColor}`}>{amount}</h3>
      {sub && <p className="text-[10px] text-slate-400 mt-2 font-medium italic">{sub}</p>}
    </div>
    <div className="p-1">
      {icon}
    </div>
  </div>
);

export default PayoutPage;