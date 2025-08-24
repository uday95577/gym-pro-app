import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddMemberForm = ({ gymId, gymName }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  // Add state for joining date, defaulting to today
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !phone || !joiningDate) {
      return setError('Please fill out all fields.');
    }

    const fullPhoneNumber = `+91${phone}`;

    try {
      const membersCollectionRef = collection(db, 'gyms', gymId, 'members');
      
      // Use the selected joining date to calculate the first due date
      const joinDate = new Date(joiningDate);
      const feeDueDate = new Date(joinDate);
      feeDueDate.setMonth(feeDueDate.getMonth() + 1);

      await addDoc(membersCollectionRef, {
        name: name,
        email: email,
        phone: fullPhoneNumber,
        joinDate: joinDate, // Save the selected joining date
        feeDueDate: feeDueDate,
        gymName: gymName,
      });
      
      setSuccess(`Successfully added ${name}!`);
      
      // Reset the form fields
      setName('');
      setEmail('');
      setPhone('');
      setJoiningDate(new Date().toISOString().slice(0, 10));
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
          <input id="memberName" type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" placeholder="John Doe" required />
        </div>
        
        {/* New Joining Date Field */}
        <div>
          <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-700 mb-1">Joining Date</label>
          <input id="joiningDate" type="date" value={joiningDate} onChange={(e) => setJoiningDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" required />
        </div>

        <div>
          <label htmlFor="memberEmail" className="block text-sm font-medium text-gray-700 mb-1">Member Email</label>
          <input id="memberEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900" placeholder="john.doe@example.com" required />
        </div>
        <div>
          <label htmlFor="memberPhone" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number (10 digits)</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
            <input id="memberPhone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-r-md text-gray-900" placeholder="9876543210" pattern="[0-9]{10}" title="Please enter a valid 10-digit phone number" required />
          </div>
        </div>
        <button type="submit" className="w-full bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition">Add Member</button>
      </form>
    </div>
  );
};

export default AddMemberForm;
