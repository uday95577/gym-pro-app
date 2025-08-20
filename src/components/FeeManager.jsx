import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

const FeeManager = ({ gymId }) => {
  const [fees, setFees] = useState({
    monthly: '',
    quarterly: '',
    halfYearly: '',
    yearly: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch existing fee data when the component loads
  useEffect(() => {
    if (!gymId) return;
    const gymDocRef = doc(db, 'gyms', gymId);
    const unsubscribe = onSnapshot(gymDocRef, (doc) => {
      if (doc.exists() && doc.data().fees) {
        setFees(doc.data().fees);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [gymId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFees(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const gymDocRef = doc(db, 'gyms', gymId);
    try {
      await updateDoc(gymDocRef, {
        fees: {
          monthly: Number(fees.monthly),
          quarterly: Number(fees.quarterly),
          halfYearly: Number(fees.halfYearly),
          yearly: Number(fees.yearly),
        }
      });
      setMessage('Fee plans updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error("Error updating fees: ", error);
      setMessage('Failed to update fees.');
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading fee manager...</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Manage Membership Fees (₹)</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="monthly" className="block text-sm font-medium text-gray-700">1 Month</label>
            <input type="number" name="monthly" value={fees.monthly} onChange={handleChange} placeholder="e.g., 150" className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900" />
          </div>
          <div>
            <label htmlFor="quarterly" className="block text-sm font-medium text-gray-700">3 Months</label>
            <input type="number" name="quarterly" value={fees.quarterly} onChange={handleChange} placeholder="e.g., 400" className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900" />
          </div>
          <div>
            <label htmlFor="halfYearly" className="block text-sm font-medium text-gray-700">6 Months</label>
            <input type="number" name="halfYearly" value={fees.halfYearly} onChange={handleChange} placeholder="e.g., 800" className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900" />
          </div>
          <div>
            <label htmlFor="yearly" className="block text-sm font-medium text-gray-700">12 Months</label>
            <input type="number" name="yearly" value={fees.yearly} onChange={handleChange} placeholder="e.g., 1500" className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900" />
          </div>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
          Save Fee Plans
        </button>
        {message && <p className="text-center text-sm text-gray-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

export default FeeManager;
