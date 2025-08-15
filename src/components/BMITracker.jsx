import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

const BMITracker = () => {
  const { currentUser } = useAuth();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmiHistory, setBmiHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch BMI history in real-time
  useEffect(() => {
    if (!currentUser) return;
    const recordsRef = collection(db, 'users', currentUser.uid, 'bmiRecords');
    const q = query(recordsRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBmiHistory(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!height || !weight) return;

    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    const recordsRef = collection(db, 'users', currentUser.uid, 'bmiRecords');
    await addDoc(recordsRef, {
      height: Number(height),
      weight: Number(weight),
      bmi: Number(bmi),
      date: serverTimestamp(),
    });

    setHeight('');
    setWeight('');
  };

  // Helper function to get the style and tag for a BMI value
  const getBmiInfo = (bmi) => {
    if (bmi < 18.5) {
      return { tag: 'Underweight', color: 'text-blue-500' };
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return { tag: 'Normal', color: 'text-green-500' };
    } else if (bmi >= 25 && bmi < 29.9) {
      return { tag: 'Overweight', color: 'text-yellow-600' };
    } else {
      return { tag: 'Obese', color: 'text-red-500' };
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">BMI Tracker</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="number" value={height} onChange={(e) => setHeight(e.target.value)}
          placeholder="Height (in cm)"
          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900" required
        />
        <input
          type="number" value={weight} onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight (in kg)"
          className="px-3 py-2 border border-gray-300 rounded-md text-gray-900" required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
          Log BMI
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2 text-gray-800">Your History</h3>
      {loading ? <p className="text-gray-600">Loading history...</p> :
       bmiHistory.length === 0 ? <p className="text-gray-600">No entries yet. Log your BMI above to start!</p> : (
        <ul className="divide-y divide-gray-200">
          {bmiHistory.map(record => {
            const bmiInfo = getBmiInfo(record.bmi);
            return (
              <li key={record.id} className="py-2 grid grid-cols-4 gap-4 text-center items-center">
                <span className="text-gray-600">{record.date ? new Date(record.date.toDate()).toLocaleDateString() : '...'}</span>
                <span className="text-gray-800">{record.weight} kg</span>
                <span className={`font-bold ${bmiInfo.color}`}>{record.bmi} BMI</span>
                <span className={`text-sm font-medium ${bmiInfo.color}`}>{bmiInfo.tag}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BMITracker;
