import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const AddMemberForm = ({ gymId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email) {
      return setError('Please fill out all fields.');
    }

    try {
      const membersCollectionRef = collection(db, 'gyms', gymId, 'members');
      
      // Set the first due date to one month from today
      const joinDate = new Date();
      const feeDueDate = new Date(joinDate);
      feeDueDate.setMonth(feeDueDate.getMonth() + 1);

      await addDoc(membersCollectionRef, {
        name: name,
        email: email,
        joinDate: serverTimestamp(),
        feeDueDate: feeDueDate, // Add the due date
      });
      
      setSuccess(`Successfully added ${name}!`);
      setName('');
      setEmail('');
    } catch (err) {
      console.error("Error adding member: ", err);
      setError('Failed to add member. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Add a New Member</h3>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        <div>
          <label htmlFor="memberName" className="block text-sm font-medium text-gray-700 mb-1">Member Full Name</label>
          <input
            id="memberName" type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 mb-1">Member Email</label>
          <input
            id="memberEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
            placeholder="john.doe@example.com"
          />
        </div>
        <button type="submit" className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition">
          Add Member
        </button>
      </form>
    </div>
  );
};

export default AddMemberForm;
