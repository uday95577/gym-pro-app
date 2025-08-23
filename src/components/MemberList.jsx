import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import EditMemberModal from './EditMemberModal';

const MemberList = ({ gymId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    if (!gymId) return;
    const membersCollectionRef = collection(db, 'gyms', gymId, 'members');
    const q = query(membersCollectionRef, orderBy('joinDate', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const membersData = [];
      querySnapshot.forEach((doc) => {
        membersData.push({ ...doc.data(), id: doc.id });
      });
      setMembers(membersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gymId]);

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        const memberDocRef = doc(db, 'gyms', gymId, 'members', memberId);
        await deleteDoc(memberDocRef);
      } catch (error) {
        console.error("Error deleting member: ", error);
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
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Current Members ({members.length})</h3>
        {loading ? ( <p>Loading members...</p> ) : 
         members.length === 0 ? ( <p>No members found. Add one using the form above.</p> ) : (
          <ul className="divide-y divide-gray-200">
            {members.map((member) => {
              // Check if the fee is overdue
              const isOverdue = member.feeDueDate && member.feeDueDate.toDate() < new Date();
              return (
                <li key={member.id} className={`py-3 flex justify-between items-center ${isOverdue ? 'bg-red-50 rounded-md px-2' : ''}`}>
                  <div>
                    <p className={`font-medium ${isOverdue ? 'text-red-800' : 'text-gray-800'}`}>{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                    {isOverdue && <p className="text-xs font-bold text-red-600">FEE OVERDUE</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-500 hidden sm:block">
                      Due: {member.feeDueDate ? member.feeDueDate.toDate().toLocaleDateString() : 'N/A'}
                    </p>
                    <button onClick={() => handleEdit(member)} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(member.id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200">
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
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
