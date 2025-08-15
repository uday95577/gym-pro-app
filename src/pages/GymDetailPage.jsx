// Filename: src/pages/GymDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import ClassList from '../components/ClassList';

const GymDetailPage = () => {
  const { gymId } = useParams();
  const { currentUser } = useAuth(); // Get current user info
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null); // 'sent', 'member', null

  // This function handles the join request logic
  const handleJoinRequest = async () => {
    if (!currentUser) return alert('Please log in to join a gym.');

    setRequestStatus('sending'); // Disable button immediately
    try {
      const joinRequestRef = collection(db, 'gyms', gymId, 'joinRequests');
      await addDoc(joinRequestRef, {
        userId: currentUser.uid,
        userName: currentUser.name || currentUser.email, // Use name if available
        userEmail: currentUser.email,
        status: 'pending',
        requestDate: serverTimestamp(),
      });
      setRequestStatus('sent');
    } catch (error) {
      console.error("Error sending join request: ", error);
      setRequestStatus(null); // Re-enable button on error
    }
  };

  useEffect(() => {
    // Fetch gym details
    const fetchGym = async () => {
      try {
        const gymDocRef = doc(db, 'gyms', gymId);
        const gymDoc = await getDoc(gymDocRef);
        if (gymDoc.exists()) setGym({ ...gymDoc.data(), id: gymDoc.id });
      } catch (error) { console.error("Error fetching gym: ", error); }
    };

    // Check if user has already sent a request
    const checkRequestStatus = async () => {
      const q = query(
        collection(db, 'gyms', gymId, 'joinRequests'),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setRequestStatus('sent');
      }
    };

    if (gymId && currentUser) {
      Promise.all([fetchGym(), checkRequestStatus()]).finally(() => setLoading(false));
    }
  }, [gymId, currentUser]);

  if (loading) return <p>Loading gym details...</p>;
  if (!gym) return <p>Gym not found.</p>;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-slate-900">{gym.gymName}</h1>
        <p className="text-lg text-slate-600 mt-2">{gym.address}</p>
        <button
          onClick={handleJoinRequest}
          disabled={!!requestStatus} // Disable button if status is 'sending' or 'sent'
          className="mt-6 w-full md:w-auto bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 transition text-lg disabled:bg-gray-400"
        >
          {requestStatus === 'sent' ? 'Request Sent' : 'Request to Join'}
        </button>
      </div>
      <ClassList gymId={gym.id} />
    </div>
  );
};

export default GymDetailPage;