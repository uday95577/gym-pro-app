import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TrialBanner = () => {
  const { currentUser } = useAuth();
  const [hoursLeft, setHoursLeft] = useState(0);

  useEffect(() => {
    if (currentUser?.subscriptionStatus === 'trial') {
      const trialEndDate = currentUser.trialEndDate?.toDate();
      if (trialEndDate) {
        const now = new Date();
        const diffMs = trialEndDate - now;
        
        if (diffMs > 0) {
          const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
          setHoursLeft(diffHours);
        }
      }
    }
  }, [currentUser]);

  // Only render the banner if the user is in a trial and there's time left
  if (currentUser?.subscriptionStatus !== 'trial' || hoursLeft <= 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white p-4 rounded-lg shadow-md mb-8 text-center">
      <p className="font-bold text-lg">
        You have {hoursLeft} hours left in your free trial!
      </p>
      <p className="text-sm mt-1">
        Ready to commit?{' '}
        <Link to="/pricing" className="font-bold underline hover:text-sky-200">
          Choose a Plan
        </Link>
      </p>
    </div>
  );
};

export default TrialBanner;
