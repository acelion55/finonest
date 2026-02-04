import React from 'react'
import { 
  LayoutDashboard, Users, Banknote, CreditCard, 
  Car, Briefcase, CheckCircle, XCircle, Clock, 
  TrendingUp, Calendar, ChevronDown 
} from 'lucide-react'; 

function performancecard() {
  return (
      <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-600 p-1.5 rounded text-white"><Calendar size={18}/></div>
            <h2 className="text-xl font-semibold">Monthly Performance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PerformanceCard icon={<Calendar size={20}/>} label="This Month" count="0" />
            <PerformanceCard icon={<Clock size={20}/>} label="Last Month" count="0" />
            <div className="bg-green-50 border border-green-100 p-5 rounded-xl flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center text-white">
                    <TrendingUp size={24} />
                  </div>
                  <span className="font-semibold text-emerald-700">Growth</span>
               </div>
               <span className="text-2xl font-bold text-emerald-600">+0.0%</span>
            </div>
          </div>
        </section>
  )
}

export default performancecard


const PerformanceCard = ({ icon, label, count }) => (
  <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl flex items-center justify-between">
    <div className="flex items-center gap-4 text-blue-600">
      <div className="bg-blue-600 p-2 rounded text-white">{icon}</div>
      <span className="font-semibold text-slate-800">{label}</span>
    </div>
    <span className="text-2xl font-bold text-blue-600">{count}</span>
  </div>
);