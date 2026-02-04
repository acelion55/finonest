import React, { useState } from 'react';
import { Network, Crown, CheckCircle2, AlertTriangle } from 'lucide-react';
import Nav from "../components/navbar";
import { Link } from "react-router-dom";

const PartnerProgram = () => {
  const [selected, setSelected] = useState(null);

  return (
    <>
    <Nav />
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-10 max-w-4xl w-full shadow-sm">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Choose Your Partner Program</h1>
          <p className="text-slate-500 mt-2 text-sm md:text-base">
            This is a <span className="text-red-600 font-bold italic">permanent choice</span>. You cannot change this later.
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Network Partner Card */}
          <div 
            onClick={() => setSelected('network')}
            className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
              selected === 'network' 
              ? 'bg-blue-50 border-blue-500 shadow-md scale-[1.02]' 
              : ' border-slate-100 hover:border-blue-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <Network size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Network Partner</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Build a large chain and earn small % from everyone
            </p>
            <ul className="space-y-3">
              <FeatureItem text="3 Levels: L1 (5%), L2 (2%), L3 (1%)" />
              <FeatureItem text="See entire team tree (masked)" />
              <FeatureItem text="Automatic calculation" />
              <FeatureItem text="Zero management overhead" />
            </ul>
            {/* Background Decorative Circle */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-100 rounded-full -mr-6 -mt-6 opacity-40 blur-xl"></div>
          </div>

          {/* Channel Partner Card */}
          <div 
            onClick={() => setSelected('channel')}
            className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
              selected === 'channel' 
              ? 'bg-purple-50 border-purple-500 shadow-md scale-[1.02]' 
              : 'bg-white border-slate-100 hover:border-purple-200 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-600 p-2 rounded-lg text-white">
                <Crown size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Channel Partner</h3>
            </div>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Be a Boss. Manage a direct team and keep high margins
            </p>
            <ul className="space-y-3">
              <FeatureItem text="1 Level Only: Direct referrals" color="text-purple-600" />
              <FeatureItem text="Set rates per advisor" color="text-purple-600" />
              <FeatureItem text="Keep the margin difference" color="text-purple-600" />
              <FeatureItem text="Active management required" color="text-purple-600" />
            </ul>
             {/* Background Decorative Circle */}
             <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 rounded-full -mr-6 -mt-6 opacity-40 blur-xl"></div>
          </div>

        </div>

        {/* Warning Box */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg mb-8 flex items-start gap-3">
          <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
          <p className="text-amber-800 text-sm">
            <span className="font-bold">Important:</span> This selection is permanent and cannot be changed later.
          </p>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Link to="/referal">
            <button 
              disabled={!selected}
              className={`px-10 py-3 rounded-xl font-bold text-white transition-all duration-300 shadow-lg ${
                selected 
                ? 'bg-blue-600 hover:bg-blue-700 active:scale-95' 
                : 'bg-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              Confirm Selection
            </button>
          </Link>
        </div>

      </div>
    </div>
    </>
  );
};

// Internal Helper for List Items
const FeatureItem = ({ text, color = "text-emerald-500" }) => (
  <li className="flex items-center gap-2 text-sm text-slate-600">
    <CheckCircle2 className={color} size={18} />
    {text}
  </li>
);

export default PartnerProgram;