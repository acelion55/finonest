import React, { useState, useEffect } from "react";
import { Users, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { Link } from 'react-router-dom';

function keyperformanceindicator() {
  const [counts, setCounts] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
    inprogress: 0,
  });

  useEffect(() => {
    fetchApplicationCounts();
  }, []);

  const fetchApplicationCounts = async () => {
    try {
      const responses = await Promise.all([
        fetch('http://localhost:5000/api/creditcard-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/personal-loan-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/car-loan-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/offline-applications/all').catch(err => ({ ok: false, error: err })),
        fetch('http://localhost:5000/api/business-loan-applications/all').catch(err => ({ ok: false, error: err })),
      ]);

      let totalApps = 0;
      let approvedCount = 0;
      let rejectedCount = 0;
      let inprogressCount = 0;

      for (const response of responses) {
        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            data.data.forEach(app => {
              totalApps++;
              const status = (app.status || 'pending').toLowerCase();
              if (status === 'approved') approvedCount++;
              else if (status === 'rejected') rejectedCount++;
              else inprogressCount++;
            });
          }
        }
      }

      setCounts({
        total: totalApps,
        approved: approvedCount,
        rejected: rejectedCount,
        inprogress: inprogressCount,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-blue-600 p-1.5 rounded text-white">
          <TrendingUp size={18} />
        </div>
        <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to={"/keypurformance/totalleads"}>
          <KPICard
            color="blue"
            icon={<Users size={20} />}
            label="Total Leads"
            sub="All applications"
            count={counts.total.toString()}
          />
        </Link>
        <Link to={"/keypurformance/approved"}>
          <KPICard
            color="green"
            icon={<CheckCircle size={20} />}
            label="Approved"
            sub="Successfully processed"
            count={counts.approved.toString()}
          />
        </Link>
        <Link to={"/keypurformance/rejected"}>
          <KPICard
            color="red"
            icon={<XCircle size={20} />}
            label="Rejected"
            sub="Applications declined"
            count={counts.rejected.toString()}
          />
        </Link>
        <Link to={"/keypurformance/inprogress"}>
          <KPICard
            color="amber"
            icon={<Clock size={20} />}
            label="In Progress"
            sub="Under processing"
            count={counts.inprogress.toString()}
          />
        </Link>
      </div>
    </section>
  );
}

export default keyperformanceindicator;

const KPICard = ({ color, icon, label, sub, count }) => {
  const themes = {
    blue: "bg-blue-50 border-blue-100 text-blue-600",
    green: "bg-emerald-50 border-emerald-100 text-emerald-600",
    red: "bg-red-50 border-red-100 text-red-600",
    amber: "bg-amber-50 border-amber-100 text-amber-600",
  };

  return (
    <div
      className={`${themes[color]} border p-5 rounded-xl flex items-start gap-4`}
    >
      <div className="bg-white p-2 rounded-full shadow-sm">{icon}</div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800">{label}</h3>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <span className="text-2xl font-bold">{count}</span>
    </div>
  );
};
