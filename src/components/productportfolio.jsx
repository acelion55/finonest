import React, { useState, useEffect } from "react";
import { 
    Banknote, CreditCard, 
  Car, Briefcase,   
} from 'lucide-react';
 import  { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function productportfolio() {
  const [fieldCounts, setFieldCounts] = useState({
    creditcard: 0,
    personalloan: 0,
    carloan: 0,
    offline: 0,
    business: 0,
  });

  useEffect(() => {
    fetchProductCounts();
  }, []);

  const fetchProductCounts = async () => {
    try {
      const responses = await Promise.all([
        fetch(`${API_URL}/api/creditcards/all`).catch(err => ({ ok: false, error: err })),
        fetch(`${API_URL}/api/personal-loans/all`).catch(err => ({ ok: false, error: err })),
        fetch(`${API_URL}/api/car-loans/all`).catch(err => ({ ok: false, error: err })),
      ]);

      let creditcardCount = 0;
      let personalloanCount = 0;
      let carloanCount = 0;

      // Credit Cards
      if (responses[0].ok) {
        const data = await responses[0].json();
        creditcardCount = (data.data && data.data.length) ? data.data.length : 0;
      }

      // Personal Loans
      if (responses[1].ok) {
        const data = await responses[1].json();
        personalloanCount = (data.data && data.data.length) ? data.data.length : 0;
      }

      // Car Loans
      if (responses[2].ok) {
        const data = await responses[2].json();
        carloanCount = (data.data && data.data.length) ? data.data.length : 0;
      }

      setFieldCounts({
        creditcard: creditcardCount,
        personalloan: personalloanCount,
        carloan: carloanCount,
        offline: 0,
        business: 0,
      });
    } catch (error) {
      console.error('Error fetching product counts:', error);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-purple-600 p-1.5 rounded text-white">
          <Briefcase size={18} />
        </div>
        <h2 className="text-xl font-semibold">Product Portfolio</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link to={"/productportfolio/creditcard"}><>
        <StatCard
          color="blue"
          icon={<CreditCard size={20} />}
          label="Credit Cards"
          sub="Premium cards"
          count={fieldCounts.creditcard.toString()}
        />
        </>
        </Link>
        <Link to={"/productportfolio/persnolloan"}>
        <>
        <StatCard
          color="green"
          icon={<Banknote size={20} />}
          label="Personal Loans"
          sub="Quick loans"
          count={fieldCounts.personalloan.toString()}
        />
        </>
        </Link>
        <Link to={"/productportfolio/carloan"}>
        <>
        <StatCard
          color="orange"
          icon={<Car size={20} />}
          label="Car Loans"
          sub="Auto financing"
          count={fieldCounts.carloan.toString()}
        />
        </>
        </Link>
        <Link to={"/productportfolio/offline"}>
        <>
        <StatCard
          color="indigo"
          icon={<Banknote size={20} />}
          label="Offline Personal Loan"
          sub="Direct processing"
          count="0"
        /></>
        </Link>
        <Link to={"/productportfolio/bussiness"}>
        <>
        <StatCard
          color="teal"
          icon={<Briefcase size={20} />}
          label="Business Loan"
          sub="Business growth"
          count="0"
        /></>
        </Link>
      </div>
    </section>
  );
}

export default productportfolio;

const StatCard = ({ color, icon, label, sub, count }) => {
  const themes = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    green: "bg-emerald-50 border-emerald-100 text-emerald-600",
    orange: "bg-orange-50 border-orange-100 text-orange-600",
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-600",
    teal: "bg-teal-50 border-teal-100 text-teal-600"
  };

  return (
    <div className={`${themes[color]} border p-5 rounded-xl relative transition-transform hover:scale-105 cursor-pointer`}>
      <div className="flex flex-col gap-1">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-current mb-2`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="font-bold text-sm leading-tight text-slate-800">{label}</h3>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <div className="absolute top-4 right-5 text-3xl font-bold opacity-80">{count}</div>
    </div>
  );
};