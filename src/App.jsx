import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

// Auth Pages
import Signup from './auth/signup';
import Login from './auth/login';

// Dashboard
import Dashboard from './Dashboard';

// Pages
import Leads from './leads/page';
import Payout from './payout/page';
import Profile from './profile/page';
import GoToRefer from './gotorefer/page';
import Referal from './referal/page';

// Product Portfolio Pages
import CreditCard from './productportfolio/creditcard/page';
import CreditCardApply from './productportfolio/creditcard/creditapply/[id]/page';
import PersonalLoan from './productportfolio/persnolloan/page';
import PersonalLoanApply from './productportfolio/persnolloan/apply/[id]/page';
import CarLoan from './productportfolio/carloan/page';
import CarLoanApply from './productportfolio/carloan/apply/[id]/page';
import Offline from './productportfolio/offline/page';
import Business from './productportfolio/bussiness/page';

// Key Performance Pages
import TotalLeads from './keypurformance/totalleads/page';
import Approved from './keypurformance/approved/page';
import Rejected from './keypurformance/rejected/page';
import InProgress from './keypurformance/inprogress/page';

// Product Link Generation
import GenerateLink from './generatelink/page';
import MyLinks from './generatelink/mylinks/page';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes - No Authentication Required */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes - Authentication Required */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/leads" 
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payout" 
          element={
            <ProtectedRoute>
              <Payout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/gotorefer" 
          element={
            <ProtectedRoute>
              <GoToRefer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/referal" 
          element={
            <ProtectedRoute>
              <Referal />
            </ProtectedRoute>
          } 
        />
        
        {/* Product Portfolio Routes - Protected */}
        <Route 
          path="/productportfolio/creditcard" 
          element={
            <ProtectedRoute>
              <CreditCard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productportfolio/creditcard/creditapply/:id" 
          element={
            <ProtectedRoute>
              <CreditCardApply />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productportfolio/persnolloan" 
          element={
            <ProtectedRoute>
              <PersonalLoan />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productportfolio/persnolloan/apply/:id" 
          element={
            <ProtectedRoute>
              <PersonalLoanApply />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productportfolio/carloan" 
          element={
            <ProtectedRoute>
              <CarLoan />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productportfolio/carloan/apply/:id" 
          element={
            <ProtectedRoute>
              <CarLoanApply />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productportfolio/offline" 
          element={
            <ProtectedRoute>
              <Offline />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/productportfolio/bussiness" 
          element={
            <ProtectedRoute>
              <Business />
            </ProtectedRoute>
          } 
        />
        
        {/* Key Performance Routes - Protected */}
        <Route 
          path="/keypurformance/totalleads" 
          element={
            <ProtectedRoute>
              <TotalLeads />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/keypurformance/approved" 
          element={
            <ProtectedRoute>
              <Approved />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/keypurformance/rejected" 
          element={
            <ProtectedRoute>
              <Rejected />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/keypurformance/inprogress" 
          element={
            <ProtectedRoute>
              <InProgress />
            </ProtectedRoute>
          } 
        />

        {/* Product Link Generation Routes - Protected */}
        <Route 
          path="/generatelink" 
          element={
            <ProtectedRoute>
              <GenerateLink />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/generatelink/mylinks" 
          element={
            <ProtectedRoute>
              <MyLinks />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
};

export default App;