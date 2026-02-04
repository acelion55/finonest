import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, Users, Briefcase, ChevronDown, Menu, X, UserCircle 
} from 'lucide-react';  
import  { Link } from 'react-router-dom';

const Navbar = () => {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false); // New state add karein
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true); // Component load hone ke baad true hoga
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
  };

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Leads', href: '/leads', icon: <Users size={18} /> },
    { name: 'Payouts', href: '/payout', icon: <Briefcase size={18} /> },
    { name: 'Profile', href: '/profile', icon: <UserCircle size={18} /> },
  ];

  return (
    <nav className="bg-white w-full  z-50 border-b px-4 py-3 sticky top-0 shadow-sm">
      <div className="max-w-[100vw] mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/lgo.jpg" alt="Logo" className="h-8 w-auto" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium">
         <div className="text-gray-400 font-mono text-sm border-r pr-6">
            {mounted ? formatTime(time) : "00:00:00 AM"}
          </div>
          
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.icon} {link.name}
            </Link>
          ))}

          {/* User Profile */}
          <div className="flex items-center gap-2 border-l pl-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              H
            </div>
            <span className="text-sm text-slate-700 hidden lg:block">harsh vardhan</span>
            <ChevronDown size={16} className="text-slate-400" />
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b p-4 space-y-4 shadow-xl">
          <div className="text-gray-500 text-center border-b pb-2">
            {formatTime(time)}
          </div>
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 text-slate-700 p-2 hover:bg-blue-50 rounded-lg"
            >
              {link.icon} {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

export default Navbar;