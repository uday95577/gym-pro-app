import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);

  // Close profile dropdown if clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuRef]);


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
          <div className="flex-shrink-0">
            <Link to="/" className="font-bold text-2xl text-sky-400">GymPro</Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks}
          </div>

          {/* --- NEW Profile Dropdown (Desktop) --- */}
          <div className="hidden md:block">
            {currentUser ? (
              <div className="relative" ref={profileMenuRef}>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-10 h-10 rounded-full overflow-hidden border-2 border-sky-400 focus:outline-none focus:ring-2 focus:ring-white">
                  <img
                    className="w-full h-full object-cover"
                    src={currentUser.photoURL || `https://i.pravatar.cc/150?u=${currentUser.uid}`}
                    alt="Profile"
                  />
                </button>
                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Manage Profile</Link>
                    <Link to="/manage-subscription" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Subscription</Link>
                    <button onClick={handleLogout} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                )}
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
            {/* ... (mobile button code remains the same) ... */}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 transform ... md:hidden`}>
        {/* ... (sidebar code remains mostly the same, but you'd add the new profile links here too) ... */}
      </div>
    </nav>
  );
};

export default Navbar;
