import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import ClassList from '../components/ClassList';

const GymDetailPage = () => {
  const { gymId } = useParams();
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGym = async () => {
      if (!gymId) return;
      setLoading(true);
      try {
        const gymDocRef = doc(db, 'gyms', gymId);
        const gymDoc = await getDoc(gymDocRef);
        if (gymDoc.exists()) {
          setGym({ ...gymDoc.data(), id: gymDoc.id });
        }
      } catch (error) {
        console.error("Error fetching gym details: ", error);
      }
      setLoading(false);
    };
    fetchGym();
  }, [gymId]);

  if (loading) {
    return <p className="text-slate-300">Loading gym details...</p>;
  }

  if (!gym) {
    return <p className="text-slate-300">Gym not found.</p>;
  }

  // Prepare fee plans for display, filtering out any that haven't been set
  const feePlans = gym.fees ? [
    { duration: '1 Month', price: gym.fees.monthly },
    { duration: '3 Months', price: gym.fees.quarterly },
    { duration: '6 Months', price: gym.fees.halfYearly },
    { duration: '12 Months', price: gym.fees.yearly },
  ].filter(plan => plan.price > 0) : [];

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
        <h1 className="text-4xl font-bold text-slate-900">{gym.gymName}</h1>
        <p className="text-lg text-slate-600 mt-2">{gym.address}</p>
      </div>

      {/* New Membership Plans Section */}
      {feePlans.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Membership Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {feePlans.map((plan) => (
              <div key={plan.duration} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow flex flex-col">
                <h3 className="font-semibold text-gray-700">{plan.duration}</h3>
                <p className="text-3xl font-bold text-sky-600 my-2">₹{plan.price}</p>
                <button className="mt-auto w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">
                  Request to Join
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Gallery Section */}
      {gym.images && gym.images.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {gym.images.map((url, index) => (
              <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                <img 
                  src={url} 
                  alt={`Gym gallery image ${index + 1}`} 
                  className="rounded-lg object-cover w-full h-48 transform hover:scale-105 transition-transform duration-300" 
                />
              </a>
            ))}
          </div>
        </div>
      )}

      <ClassList gymId={gym.id} />
    </div>
  );
};

export default GymDetailPage;
