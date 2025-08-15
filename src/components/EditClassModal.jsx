// Filename: src/components/EditClassModal.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Helper function to format Firestore Timestamp to a string for datetime-local input
const formatDateTimeForInput = (timestamp) => {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  // Pad single digit month/day/hour/minute with a leading zero
  const pad = (num) => num.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const EditClassModal = ({ isOpen, onClose, classData, gymId }) => {
  const [name, setName] = useState('');
  const [instructor, setInstructor] = useState('');
  const [dateTime, setDateTime] = useState('');

  useEffect(() => {
    if (classData) {
      setName(classData.name);
      setInstructor(classData.instructor);
      setDateTime(formatDateTimeForInput(classData.dateTime));
    }
  }, [classData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!classData) return;

    const classDocRef = doc(db, 'gyms', gymId, 'classes', classData.id);
    try {
      await updateDoc(classDocRef, {
        name: name,
        instructor: instructor,
        dateTime: new Date(dateTime),
      });
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error updating class: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50">
        <h2 className="text-xl font-bold mb-4">Edit Class</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Class Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Instructor</label>
            <input type="text" value={instructor} onChange={(e) => setInstructor(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
            <input type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500" />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClassModal;