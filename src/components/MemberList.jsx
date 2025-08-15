import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import EditMemberModal from './EditMemberModal'; // Import the modal

const MemberList = ({ gymId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    if (!gymId) return; // Don't run the query if gymId isn't available yet

    setLoading(true);
    const membersCollectionRef = collection(db, 'gyms', gymId, 'members');
    const q = query(membersCollectionRef, orderBy('joinDate', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const membersData = [];
      querySnapshot.forEach((doc) => {
        membersData.push({ ...doc.data(), id: doc.id });
      });
      setMembers(membersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching members: ", error);
      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [gymId]);

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const memberDocRef = doc(db, 'gyms', gymId, 'members', memberId);
        await deleteDoc(memberDocRef);
      } catch (error) {
        console.error("Error deleting member: ", error);
        alert("Failed to delete member.");
      }
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Members ({members.length})</h3>
        {loading ? (
          <p>Loading members...</p>
        ) : members.length === 0 ? (
          <p>No members found. Add one using the form above.</p>
        ) : (
          <div className="overflow-x-auto">
            <ul className="min-w-full divide-y divide-gray-200">
              {members.map((member) => (
                <li key={member.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-2 sm:mb-0">
                    <p className="font-medium text-gray-800">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <p className="text-sm text-gray-500 hidden md:block">
                      Joined: {member.joinDate ? new Date(member.joinDate.toDate()).toLocaleDateString() : 'N/A'}
                    </p>
                    <button
                      onClick={() => handleEdit(member)}
                      className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <EditMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={editingMember}
        gymId={gymId}
      />
    </>
  );
};

export default MemberList;