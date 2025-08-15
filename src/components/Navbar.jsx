import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-slate-800 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-bold text-2xl text-sky-400">GymPro</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="py-2 px-3 rounded-md text-sm font-medium hover:bg-slate-700">Home</Link>
            <Link to="/browse-gyms" className="py-2 px-3 rounded-md text-sm font-medium hover:bg-slate-700">Find a Gym</Link>
            <Link to="/progress" className="py-2 px-3 rounded-md text-sm font-medium hover:bg-slate-700">My Progress</Link>
            <Link to="/75-hard" className="py-2 px-3 rounded-md text-sm font-medium hover:bg-slate-700">75 Hard</Link> {/* Add this link */}
            <Link to="/gym-owner" className="py-2 px-3 rounded-md text-sm font-medium hover:bg-slate-700">For Gym Owners</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {currentUser ? (
              <>
                <span className="text-sm text-gray-300">{currentUser.email}</span>
                <button
                  onClick={handleLogout}
                  className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg shadow-md transition duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="py-2 px-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg shadow-md transition duration-300">Login</Link>
                <Link to="/signup" className="py-2 px-3 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow-md transition duration-300">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
