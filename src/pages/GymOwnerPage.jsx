// Filename: src/pages/GymOwnerPage.jsx

import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

import GymRegistrationForm from '../components/GymRegistrationForm';
import OwnerDashboard from '../components/OwnerDashboard';
import BecomeOwner from '../components/BecomeOwner';

const GymOwnerPage = () => {
  const { currentUser } = useAuth();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  // We wrap fetchGymData in useCallback.
  // This ensures the function itself doesn't change on every render,
  // unless its own dependency (currentUser) changes.
  const fetchGymData = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'gym-owner') {
      setLoading(false);
      return;
    }
    setLoading(true);
    const q = query(collection(db, 'gyms'), where('ownerId', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const gymDoc = querySnapshot.docs[0];
      setGym({ id: gymDoc.id, ...gymDoc.data() });
    } else {
      setGym(null);
    }
    setLoading(false);
  }, [currentUser]); // The function depends on currentUser

  // Now, we can safely add fetchGymData to the dependency array of useEffect.
  useEffect(() => {
    fetchGymData();
  }, [fetchGymData]); // The effect now correctly depends on the memoized function.

  const renderContent = () => {
    if (loading) {
      return <p className="mt-4">Loading your dashboard...</p>;
    }

    // We can only check for role if a user is logged in
    if (!currentUser) {
        return <p>Please log in to continue.</p>;
    }

    if (currentUser.role === 'gym-owner') {
      return gym ? (
        <OwnerDashboard gymData={gym} />
      ) : (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Register Your Gym</h2>
          <p className="mb-4 text-slate-600">Welcome, owner! Please register your gym to continue.</p>
          <GymRegistrationForm onGymRegistered={fetchGymData} />
        </div>
      );
    } else {
      return <BecomeOwner />;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800">Gym Owner Portal</h1>
      {renderContent()}
    </div>
  );
};

export default GymOwnerPage;