import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const BrowseGymsPage = () => {
  const [allGyms, setAllGyms] = useState([]); // Stores the original list of all gyms
  const [filteredGyms, setFilteredGyms] = useState([]); // Stores the gyms to be displayed
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all gyms once when the component loads
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

        setAllGyms(gymsData);
        setFilteredGyms(gymsData); // Initially, show all gyms
      } catch (error) {
        console.error("Error fetching gyms: ", error);
      }
      setLoading(false);
    };

    fetchGyms();
  }, []);

  // Filter gyms whenever the search term changes
  useEffect(() => {
    const results = allGyms.filter(gym =>
      gym.gymName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gym.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGyms(results);
  }, [searchTerm, allGyms]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Browse Gyms</h1>
        <div className="mt-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by gym name or address..."
            className="w-full max-w-lg p-3 rounded-lg border border-gray-300 text-gray-800"
          />
        </div>
      </div>
      
      {loading ? (
        <p className="text-slate-300">Finding gyms...</p>
      ) : filteredGyms.length === 0 ? (
        <p className="text-slate-300">No gyms found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGyms.map((gym) => {
            const imageUrl = gym.images && gym.images.length > 0 
              ? gym.images[0] 
              : 'https://placehold.co/600x400/2d3748/ffffff?text=No+Image';

            return (
              <div key={gym.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
                <img src={imageUrl} alt={gym.gymName} className="w-full h-48 object-cover" />
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-slate-900">{gym.gymName}</h2>
                  <p className="text-slate-600 mt-2 flex-grow">{gym.address}</p>
                  <Link
                    to={`/gym/${gym.id}`}
                    className="mt-4 block w-full text-center bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition"
                  >
                    View Details & Join
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseGymsPage;
