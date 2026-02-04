import React from 'react';
import { Gift, Rocket, Users, ArrowRight,  ChevronDown, Copy } from 'lucide-react';
import  { Link } from 'react-router-dom';
import ProductLinkFilter from './productlinkfilter';

const ReferAndLink = () => {
  return (
    <div className="space-y-8 w-full max-w-7xl mx-auto p-4">
      
      

      {/* --- Refer and Earn Section --- */}
      <section>
        <div className=" flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">Refer and Earn</h2>
          <button className="text-blue-600 flex items-center gap-1 text-sm font-semibold hover:underline">
            View Details <ArrowRight size={16} />
          </button>
        </div>

        <div className="relative overflow-hidden bg-linear-to-r from-orange-50 to-purple-50 border border-orange-100 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          {/* Content */}
          <div className="z-10 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2 text-orange-600">
              <Gift size={24} />
              <h3 className="text-xl font-bold text-slate-900">Start Earning with Your Team!</h3>
            </div>
            <p className="text-slate-600 text-sm md:text-base max-w-lg">
              Choose your partner program and start building your referral network. Earn from your team's success!
            </p>
            <Link to="/gotorefer">
            <button className="mt-6 bg-linear-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95 mx-auto md:mx-0">
              <Rocket size={18} /> Get Started
             </button>
            </Link>
      
          </div>


          {/* Large Circle Icon */}
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-linear-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center shadow-inner">
              <Users size={48} className="text-white opacity-90" />
            </div>
            {/* Decorative background shapes */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-200 rounded-full blur-2xl opacity-50"></div>
          </div>
        </div>
      </section>
 

    </div>
  );
};

export default ReferAndLink;