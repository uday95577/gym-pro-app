// Filename: src/components/EditMemberModal.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EditMemberModal = ({ isOpen, onClose, member, gymId }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // When the 'member' prop changes, update the form fields
  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
    }
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member) return;

    const memberDocRef = doc(db, 'gyms', gymId, 'members', member.id);
    try {
      await updateDoc(memberDocRef, {
        name: name,
        email: email,
      });
      onClose(); // Close the modal on success
    } catch (error) {
      console.error("Error updating member: ", error);
    }
  };

  if (!isOpen) return null;

  return (
    // Modal Backdrop
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
      {/* Modal Content */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50">
        <h2 className="text-xl font-bold mb-4">Edit Member</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="edit-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMemberModal;