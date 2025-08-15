// Filename: src/components/AddClassForm.jsx

import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddClassForm = ({ gymId }) => {
  const [className, setClassName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!className || !instructor || !dateTime) {
      return setError('Please fill out all fields.');
    }

    try {
      const classesCollectionRef = collection(db, 'gyms', gymId, 'classes');
      await addDoc(classesCollectionRef, {
        name: className,
        instructor: instructor,
        // Convert the local datetime string to a JavaScript Date object for Firestore
        dateTime: new Date(dateTime), 
      });

      setSuccess(`Successfully scheduled ${className}!`);
      setClassName('');
      setInstructor('');
      setDateTime('');
    } catch (err) {
      console.error("Error scheduling class: ", err);
      setError('Failed to schedule class. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4">Schedule a New Class</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <input
          type="text" value={className} onChange={(e) => setClassName(e.target.value)}
          placeholder="Class Name (e.g., Yoga, HIIT)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)}
          placeholder="Instructor Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500"
        />
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition">
          Schedule Class
        </button>
      </form>
    </div>
  );
};

export default AddClassForm;