import React, { useState } from 'react';
import { 
  Gift, Rocket, Users, ArrowRight, Copy, CheckCircle2, Info, 
  MousePointer2, UserPlus, Banknote, Calendar, 
  Percent, Clock 
} from 'lucide-react';
import ProductLinkFilter from './productlinkfilter';

const ReferralDashboard = () => {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://cards.finonest.com/signup.php?ref=REF42685B&referrer=harsh+vardhan";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4 md:p-6 bg-slate-50 min-h-screen">
      
      {/* --- Section 1: Product Link Filter --- */}
      <section>
        <ProductLinkFilter />
      </section>

      {/* --- Section 2: Your Referral Link --- */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Your Referral Link</h2>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative">
            <div className="absolute top-6 right-6 text-green-500">
                <CheckCircle2 size={24} />
            </div>
          
          <h3 className="text-2xl font-bold text-slate-800 mb-1">Share This Link to Refer Others</h3>
          <p className="text-slate-500 text-sm mb-6">Copy and share this link with friends to build your team</p>

          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <input 
              readOnly
              value={referralLink}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600 focus:outline-none"
            />
            <button 
              onClick={handleCopy}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors min-w-30"
            >
              {copied ? <CheckCircle2 size={18}/> : <Copy size={18} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="flex justify-between items-center text-slate-500 text-sm border-b pb-4 mb-4">
            <div className="flex items-center gap-1">
              <MousePointer2 size={14} /> Clicks: <span className="font-bold text-slate-800 ml-1">0</span>
            </div>
            <div className="flex items-center gap-1">
              <UserPlus size={14} /> Signups: <span className="font-bold text-slate-800 ml-1">0</span>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg flex items-start gap-3">
            <Info size={18} className="text-blue-600 mt-0.5" />
            <p className="text-blue-800 text-sm">
              <span className="font-bold">Tip:</span> Share this link via WhatsApp, SMS, or email. When someone signs up using your link, they'll join your team!
            </p>
          </div>
        </div>
      </section>

      {/* --- Section 3: Payout Summary --- */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Payout Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <PayoutCard 
            color="green" 
            icon={<Banknote size={20}/>} 
            label="Total Earned" 
            sub="Lifetime commission" 
            amount="₹0" 
          />
          <PayoutCard 
            color="blue" 
            icon={<Calendar size={20}/>} 
            label="This Month" 
            sub="Current earnings" 
            amount="₹0" 
          />
          <PayoutCard 
            color="slate" 
            icon={<Percent size={20}/>} 
            label="Margin Earned" 
            sub="Additional income" 
            amount="₹0" 
          />
          <PayoutCard 
            color="amber" 
            icon={<Clock size={20}/>} 
            label="Pending" 
            sub="Awaiting approval" 
            amount="₹0" 
          />
        </div>
      </section>

    </div>
  );
};

// Internal Sub-component for Payout Cards
const PayoutCard = ({ color, icon, label, sub, amount }) => {
  const themes = {
    green: "bg-emerald-50 border-emerald-100 text-emerald-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    slate: "bg-slate-50 border-slate-200 text-slate-500",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
  };

  return (
    <div className={`${themes[color]} border p-4 rounded-xl flex items-start justify-between shadow-sm`}>
      <div className="flex flex-col h-full justify-between">
        <div className={`p-2 rounded-lg bg-white w-fit shadow-sm mb-3`}>
          {icon}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm leading-tight">{label}</h4>
          <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>
        </div>
      </div>
      <div className="text-xl font-bold">{amount}</div>
    </div>
  );
};

export default ReferralDashboard;