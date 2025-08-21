import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const ManageSubscriptionPage = () => {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!currentUser) return;

    if (window.confirm("Are you sure you want to cancel your subscription? This action cannot be undone.")) {
      setLoading(true);
      setMessage('');
      setError('');
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          subscriptionStatus: 'canceled',
        });
        setMessage("Your subscription has been successfully canceled.");
        // We can reload to refresh the user's context and show the updated status
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error("Error canceling subscription: ", err);
        setError("Failed to cancel subscription. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const isCancellable = currentUser?.subscriptionStatus === 'active';

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Manage Your Subscription</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-gray-800">
        <h2 className="text-2xl font-bold mb-4">Your Current Plan</h2>
        <div className="bg-slate-100 p-4 rounded-lg">
          <p className="font-semibold text-lg capitalize">{currentUser?.role || 'User'} Plan</p>
          <p className="text-gray-600">
            Status: <span className={`font-semibold capitalize ${
              currentUser?.subscriptionStatus === 'active' || currentUser?.subscriptionStatus === 'trial' ? 'text-green-600' : 'text-red-600'
            }`}>{currentUser?.subscriptionStatus || 'N/A'}</span>
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
            If you cancel, you will lose access to premium features at the end of your current billing cycle.
          </p>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="font-bold text-red-800">No Refund Policy:</p>
            <p className="text-sm text-red-700">Please be aware that we do not offer refunds for cancellations or unused time on a subscription.</p>
          </div>
          <button
            onClick={handleCancel}
            disabled={!isCancellable || loading}
            className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Canceling...' : 'Cancel My Subscription'}
          </button>
          {message && <p className="text-center text-sm text-green-600 mt-4">{message}</p>}
          {error && <p className="text-center text-sm text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptionPage;
