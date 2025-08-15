import React from 'react';
import { Link } from 'react-router-dom'; // Import Link

const BecomeOwner = () => {
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Register as a Gym Owner</h2>
      <p className="mb-4 text-slate-600">
        Upgrade your account to a "Gym Owner" account to access gym management features.
      </p>
      {/* This button now links to the pricing page */}
      <Link
        to="/pricing"
        className="block text-center bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition"
      >
        View Subscription Plans
      </Link>
    </div>
  );
};

export default BecomeOwner;
