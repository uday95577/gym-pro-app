import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SubscriptionGate = ({ children }) => {
  const { currentUser } = useAuth();

  // Default to true if loading or no user, so we don't flash the locked message.
  let isTrialActive = true; 
  let trialDaysLeft = 0;

  if (currentUser?.subscriptionStatus === 'trial') {
    const now = new Date();
    // The trialEndDate from Firestore is a Timestamp object, so we need to convert it
    const trialEndDate = currentUser.trialEndDate?.toDate(); 
    
    if (trialEndDate && trialEndDate > now) {
      isTrialActive = true;
      const diffTime = Math.abs(trialEndDate - now);
      trialDaysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } else {
      isTrialActive = false;
    }
  } else if (currentUser?.subscriptionStatus === 'active') {
    isTrialActive = true; // A paid user always has access
  }

  // If the trial is expired, show the locked message
  if (!isTrialActive) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Your Free Trial Has Expired</h2>
        <p className="text-gray-700 mb-6">
          Please choose a subscription plan to continue accessing our premium features, including AI coaching and progress tracking.
        </p>
        <Link
          to="/pricing"
          className="inline-block bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-emerald-600 transition"
        >
          View Plans
        </Link>
      </div>
    );
  }

  // If the trial is active, show the actual content
  return (
    <div>
      {/* Optional: Display a banner showing trial days left */}
      {currentUser?.subscriptionStatus === 'trial' && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md mb-6" role="alert">
          <p className="font-bold">Welcome to your free trial!</p>
          <p>You have <span className="font-bold">{trialDaysLeft}</span> day{trialDaysLeft !== 1 ? 's' : ''} left to explore all features.</p>
        </div>
      )}
      {children}
    </div>
  );
};

export default SubscriptionGate;
