import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsSidebarOpen(false); // Close sidebar on logout
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const navLinks = (
    <>
      <Link to="/" onClick={() => setIsSidebarOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Home</Link>
      <Link to="/browse-gyms" onClick={() => setIsSidebarOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Find a Gym</Link>
      <Link to="/progress" onClick={() => setIsSidebarOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">My Progress</Link>
      <Link to="/75-hard" onClick={() => setIsSidebarOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">75 Hard</Link>
      <Link to="/gym-owner" onClick={() => setIsSidebarOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">For Gym Owners</Link>
    </>
  );

  return (
    <nav className="bg-slate-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-2xl text-sky-400">GymPro</Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-300">{currentUser.email}</span>
                <button onClick={handleLogout} className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md transition">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow-md transition">Login</Link>
                <Link to="/signup" className="py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md transition">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isSidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative w-64 h-full bg-slate-800 p-4 space-y-4">
          <h2 className="text-white font-bold text-xl">Menu</h2>
          {navLinks}
          <div className="border-t border-slate-700 pt-4 space-y-3">
            {currentUser ? (
              <>
                <p className="px-3 text-sm text-gray-400">{currentUser.email}</p>
                <button onClick={handleLogout} className="w-full text-left block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsSidebarOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Login</Link>
                <Link to="/signup" onClick={() => setIsSidebarOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
