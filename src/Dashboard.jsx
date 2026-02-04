import React from 'react';
import KPICard from './components/keyperformanceindicator';
import ProductPortfolio from './components/productportfolio';
import PerformanceCard from './components/performancecard';
import Nav from './components/navbar';
import Refer from './components/refer';
import Referal from './components/referal';

const Dashboard = () => {
  return (
    <>
      <Nav />
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <ProductPortfolio />
        <KPICard />
        <Refer />
        <Referal/>
      </div>
    </>
  );
};

export default Dashboard;
