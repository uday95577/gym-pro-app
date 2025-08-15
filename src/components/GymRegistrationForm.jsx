// Filename: src/components/GymRegistrationForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const GymRegistrationForm = ({ onGymRegistered }) => {
  const { currentUser } = useAuth();
  const [gymName, setGymName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!gymName || !address) {
      return setError('Please fill out all fields.');
    }

    try {
      await addDoc(collection(db, 'gyms'), {
        ownerId: currentUser.uid,
        gymName: gymName,
        address: address,
        createdAt: serverTimestamp(),
      });
      // Call the callback function passed from the parent to signal success
      if (onGymRegistered) {
        onGymRegistered();
      }
    } catch (err) {
      console.error("Error creating gym: ", err);
      setError('Failed to register gym. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="gymName" className="block text-sm font-medium text-gray-700 mb-1">
          Gym Name
        </label>
        <input
          id="gymName" type="text" value={gymName} onChange={(e) => setGymName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-sky-500"
          placeholder="Your Gym's Name"
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <input
          id="address" type="text" value={address} onChange={(e) => setAddress(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-sky-500"
          placeholder="123 Fitness St, Workout City"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Register My Gym
      </button>
    </form>
  );
};

export default GymRegistrationForm;