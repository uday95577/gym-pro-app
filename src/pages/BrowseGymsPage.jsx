import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom'; // Import Link for navigation

const BrowseGymsPage = () => {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGyms = async () => {
      setLoading(true);
      try {
        const gymsCollectionRef = collection(db, 'gyms');
        const q = query(gymsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const gymsData = [];
        querySnapshot.forEach((doc) => {
          gymsData.push({ ...doc.data(), id: doc.id });
        });

        setGyms(gymsData);
      } catch (error) {
        console.error("Error fetching gyms: ", error);
      }
      setLoading(false);
    };

    fetchGyms();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Browse Gyms</h1>
      {loading ? (
        <p>Finding gyms near you...</p>
      ) : gyms.length === 0 ? (
        <p>No gyms have registered on the platform yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <div key={gym.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex flex-col">
              <div className="flex-grow">
                <h2 className="text-xl font-bold text-slate-900">{gym.gymName}</h2>
                <p className="text-slate-600 mt-2">{gym.address}</p>
              </div>
              {/* This Link navigates to the dynamic gym detail page */}
              <Link
                to={`/gym/${gym.id}`}
                className="mt-4 block w-full text-center bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition"
              >
                View Details & Join
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseGymsPage;