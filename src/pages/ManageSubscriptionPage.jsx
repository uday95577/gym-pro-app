import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ManageSubscriptionPage = () => {
  const { currentUser } = useAuth();

  const handleCancel = () => {
    // In a real app, this would trigger a backend process to cancel the Stripe/Razorpay subscription.
    alert("Subscription cancellation functionality is not yet implemented.");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Manage Your Subscription</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Your Current Plan</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <p className="font-semibold text-lg capitalize">{currentUser?.role || 'User'} Plan</p>
          <p className="text-gray-600">
            Status: <span className="font-semibold text-green-600 capitalize">{currentUser?.subscriptionStatus || 'N/A'}</span>
          </p>
          {currentUser?.subscriptionStatus === 'trial' && (
            <p className="text-sm text-gray-500">
              Trial ends on: {currentUser.trialEndDate?.toDate().toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Change Plan</h3>
          <p className="text-gray-600 mb-4">
            Want to upgrade or change your plan? View all available options on our pricing page.
          </p>
          <Link to="/pricing" className="inline-block bg-sky-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-600 transition">
            View Pricing
          </Link>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-semibold mb-2 text-red-600">Cancel Subscription</h3>
          <p className="text-gray-600 mb-4">
            If you cancel your plan, you will lose access to all premium features at the end of your current billing cycle.
          </p>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="font-bold text-red-800">No Refund Policy:</p>
            <p className="text-sm text-red-700">Please be aware that we do not offer refunds for cancellations or unused time on a subscription.</p>
          </div>
          <button
            onClick={handleCancel}
            className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            Cancel My Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionPage;
