import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const GymDetailPage = () => {
  const { gymId } = useParams();
  const { currentUser } = useAuth();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null);

  const handleJoinRequest = async (plan) => {
    if (!currentUser) return alert('Please log in to join a gym.');
    
    setRequestStatus('sending');
    try {
      const joinRequestRef = collection(db, 'gyms', gymId, 'joinRequests');
      await addDoc(joinRequestRef, {
        userId: currentUser.uid,
        userName: currentUser.name || currentUser.email,
        userEmail: currentUser.email,
        status: 'pending',
        requestDate: serverTimestamp(),
        planDuration: plan.duration,
        planPrice: plan.price,
      });
      setRequestStatus('sent');
      alert(`Your request to join with the ${plan.duration} plan has been sent!`);
    } catch (error)
    {
      console.error("Error sending join request: ", error);
      setRequestStatus(null);
    }
  };

  useEffect(() => {
    const fetchGymAndStatus = async () => {
      if (!gymId || !currentUser) return;
      setLoading(true);
      try {
        const gymDocRef = doc(db, 'gyms', gymId);
        const gymDoc = await getDoc(gymDocRef);
        if (gymDoc.exists()) {
          setGym({ ...gymDoc.data(), id: gymDoc.id });
        }

        const q = query(
          collection(db, 'gyms', gymId, 'joinRequests'),
          where('userId', '==', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setRequestStatus('sent');
        }
      } catch (error) {
        console.error("Error fetching gym details: ", error);
      }
      setLoading(false);
    };
    fetchGymAndStatus();
  }, [gymId, currentUser]);

  if (loading) {
    return <p className="text-slate-300 text-center">Loading gym details...</p>;
  }

  if (!gym) {
    return <p className="text-slate-300 text-center">Gym not found.</p>;
  }

  const feePlans = gym.fees ? [
    { duration: '1 Month', price: gym.fees.monthly },
    { duration: '3 Months', price: gym.fees.quarterly },
    { duration: '6 Months', price: gym.fees.halfYearly },
    { duration: '12 Months', price: gym.fees.yearly },
  ].filter(plan => plan.price > 0) : [];

  return (
    <div className="space-y-8">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">{gym.gymName}</h1>
        <p className="text-lg text-slate-300 mt-2">{gym.address}</p>
      </div>

      {feePlans.length > 0 && (
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Membership Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {feePlans.map((plan) => (
              <div key={plan.duration} className="bg-slate-800 bg-opacity-50 border border-slate-700 rounded-lg p-6 text-center hover:bg-slate-700 transition-colors flex flex-col">
                <h3 className="font-semibold text-sky-400 text-lg">{plan.duration}</h3>
                <p className="text-4xl font-bold text-white my-4">₹{plan.price}</p>
                <button
                  onClick={() => handleJoinRequest(plan)}
                  disabled={!!requestStatus}
                  className="mt-auto w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition disabled:bg-gray-500 disabled:cursor-not-allowed font-semibold"
                >
                  {requestStatus === 'sent' ? 'Request Sent' : 'Request to Join'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {gym.images && gym.images.length > 0 && (
        <div className="bg-white bg-opacity-10 backdrop-blur-lg p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gym.images.map((url, index) => (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                <img 
                  src={url} 
                  alt={`Gym gallery image ${index + 1}`} 
                  className="rounded-lg object-cover w-full h-56 transform hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-2xl" 
                />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GymDetailPage;
