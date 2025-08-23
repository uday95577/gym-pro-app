import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

// A custom dumbbell icon for the mobile menu
const DumbbellIcon = () => (
  <svg className="w-8 h-8 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    <path d="M12 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" />
    <path d="M6 6h-2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
    <path d="M18 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" />
  </svg>
);


const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const mobileProfileMenuRef = useRef(null);

  // Close profile dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target) &&
          mobileProfileMenuRef.current && !mobileProfileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef, mobileProfileMenuRef]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsSidebarOpen(false);
      setIsProfileOpen(false);
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Reusable nav links with animated underline for desktop
  const navLinks = (
    <>
      <Link to="/" onClick={() => setIsSidebarOpen(false)} className="relative block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white transition-colors group">
        Home
        <span className="absolute bottom-0 left-0 block w-full h-0.5 bg-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span>
      </Link>
      <Link to="/browse-gyms" onClick={() => setIsSidebarOpen(false)} className="relative block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white transition-colors group">Find a Gym<span className="absolute bottom-0 left-0 block w-full h-0.5 bg-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span></Link>
      <Link to="/progress" onClick={() => setIsSidebarOpen(false)} className="relative block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white transition-colors group">My Progress<span className="absolute bottom-0 left-0 block w-full h-0.5 bg-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span></Link>
      <Link to="/75-hard" onClick={() => setIsSidebarOpen(false)} className="relative block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white transition-colors group">75 Hard<span className="absolute bottom-0 left-0 block w-full h-0.5 bg-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span></Link>
      <Link to="/gym-owner" onClick={() => setIsSidebarOpen(false)} className="relative block py-2 px-3 rounded-md text-base font-medium text-gray-300 hover:text-white transition-colors group">For Gym Owners<span className="absolute bottom-0 left-0 block w-full h-0.5 bg-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-in-out"></span></Link>
    </>
  );

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="font-bold text-2xl text-sky-400 font-exo" style={{textShadow: '0 1px 2px rgba(0,0,0,0.5)'}}>GymPro</Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks}
            </div>

            {/* Desktop Profile Button */}
            <div className="hidden md:flex items-center">
              {currentUser ? (
                <div className="relative" ref={profileMenuRef}>
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-12 h-12 rounded-full overflow-hidden border-2 border-sky-400 focus:outline-none focus:ring-2 focus:ring-white transform hover:scale-110 transition-transform">
                    <img className="w-full h-full object-cover" src={currentUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.username || currentUser.email}`} alt="Profile" />
                  </button>
                  <div className={`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out transform ${isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="px-4 py-2 border-b"><p className="text-sm text-gray-700">Signed in as</p><p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p></div>
                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Profile</Link>
                    <Link to="/manage-subscription" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Subscription</Link>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link to="/login" className="py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow-md transition">Login</Link>
                  <Link to="/signup" className="py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md transition">Sign Up</Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none">
                <DumbbellIcon />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSidebarOpen(false)}></div>
        <div className="relative w-64 h-full bg-slate-800 p-4 space-y-4">
          <h2 className="text-white font-bold text-2xl font-exo">Menu</h2>
          <div className="border-t border-slate-700"></div>
          {navLinks}
        </div>
      </div>

      {/* Floating Profile Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40" ref={mobileProfileMenuRef}>
        {currentUser ? (
          <div className="relative">
            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-14 h-14 rounded-full overflow-hidden border-2 border-sky-400 focus:outline-none focus:ring-2 focus:ring-white shadow-lg transform hover:scale-110 transition-transform">
              <img className="w-full h-full object-cover" src={currentUser.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser.username || currentUser.email}`} alt="Profile" />
            </button>
            <div className={`origin-bottom-right absolute right-0 bottom-16 mb-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out transform ${isProfileOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <div className="px-4 py-2 border-b"><p className="text-sm text-gray-700">Signed in as</p><p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p></div>
              <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Profile</Link>
              <Link to="/manage-subscription" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Subscription</Link>
              <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Navbar;
      