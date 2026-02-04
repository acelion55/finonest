import React, { useState, useEffect, useContext } from "react";
import { 
  LayoutDashboard, Users, Briefcase, ChevronDown, Menu, X, UserCircle, Link as LinkIcon, LogOut
} from 'lucide-react'; 
import "../index.css"
import  { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, token, logout } = useContext(AuthContext);
  
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Leads', href: '/leads', icon: <Users size={18} /> }, 
    { name: 'Payouts', href: '/payout', icon: <Briefcase size={18} /> },
    { name: 'Profile', href: '/profile', icon: <UserCircle size={18} /> },
  ];

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'H';

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
          
          {token && navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.href}
              className="flex items-center gap-1 text-slate-600 hover:text-blue-600 transition-colors"
            >
              {link.icon} {link.name}
            </Link>
          ))}

          {/* User Profile or Login/Signup */}
          {token ? (
            <div className="flex items-center gap-4 border-l pl-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {userInitial}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-slate-700 font-semibold">{user?.fullName || user?.email?.split('@')[0]}</span>
                  <span className="text-xs text-slate-500">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 border-l pl-6">
              <Link to="/login" className="text-slate-600 hover:text-blue-600 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
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
          {token && navLinks.map((link) => (
            <Link 
              key={link.name}
              to={link.href}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600  "
            >
              {link.icon} {link.name}
            </Link>
          ))}

          {token ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 bg-red-400 text-red-600 rounded-lg hover:bg-red-100  "
            >
              <LogOut size={16} />
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="block w-full text-center text-slate-600 hover:text-blue-600 transition-colors py-2">
                Login
              </Link>
              <Link to="/signup" className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
              