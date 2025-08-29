import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const BrowseGymsPage = () => {
  const [allGyms, setAllGyms] = useState([]);
  const [filteredGyms, setFilteredGyms] = useState([]);
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
        setFilteredGyms(gymsData);
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
            className="w-full max-w-lg p-3 rounded-lg border border-gray-300 text-gray-800 bg-white bg-opacity-90 focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>
      
      {loading ? (
        <p className="text-slate-300">Finding gyms...</p>
      ) : filteredGyms.length === 0 ? (
        <p className="text-slate-300">No gyms found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGyms.map((gym) => {
            const imageUrl = gym.images && gym.images.length > 0 
              ? gym.images[0] 
              : 'https://placehold.co/600x400/1a202c/ffffff?text=GymPro';

            return (
              <Link to={`/gym/${gym.id}`} key={gym.id} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg overflow-hidden group transform hover:-translate-y-2 transition-transform duration-300">
                <div className="relative">
                  <img src={imageUrl} alt={gym.gymName} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70"></div>
                  <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white" style={{textShadow: '0 2px 4px rgba(0,0,0,0.8)'}}>{gym.gymName}</h2>
                </div>
                <div className="p-6">
                  <p className="text-slate-300">{gym.address}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BrowseGymsPage;
