import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';

const FeeDashboard = ({ gymId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!gymId) return;
    const membersRef = collection(db, 'gyms', gymId, 'members');
    const q = query(membersRef, orderBy('feeDueDate', 'asc')); // Order by due date
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [gymId]);

  const handleMarkAsPaid = async (memberId, currentDueDate) => {
    const memberDocRef = doc(db, 'gyms', gymId, 'members', memberId);
    const newDueDate = new Date(currentDueDate.toDate());
    newDueDate.setMonth(newDueDate.getMonth() + 1); // Set new due date to next month

    try {
      await updateDoc(memberDocRef, {
        feeDueDate: newDueDate,
      });
    } catch (error) {
      console.error("Error updating due date: ", error);
      alert("Failed to update payment status.");
    }
  };

  const today = new Date();
  const upcomingMembers = members.filter(m => m.feeDueDate && m.feeDueDate.toDate() >= today);
  const overdueMembers = members.filter(m => m.feeDueDate && m.feeDueDate.toDate() < today);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Fee Status Dashboard</h3>
      
      {/* Overdue Members */}
      <div className="mb-6">
        <h4 className="font-bold text-red-700 mb-2">Overdue Payments ({overdueMembers.length})</h4>
        {loading ? <p className="text-sm text-gray-500">Loading...</p> :
         overdueMembers.length > 0 ? (
          <ul className="divide-y divide-red-200">
            {overdueMembers.map(member => (
              <li key={member.id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">Due: {member.feeDueDate.toDate().toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleMarkAsPaid(member.id, member.feeDueDate)} className="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-600">Mark Paid</button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">No overdue payments. Great job!</p>}
      </div>

      {/* Upcoming Payments */}
      <div>
        <h4 className="font-bold text-blue-700 mb-2">Upcoming Payments ({upcomingMembers.length})</h4>
        {loading ? <p className="text-sm text-gray-500">Loading...</p> :
         upcomingMembers.length > 0 ? (
          <ul className="divide-y divide-blue-200">
            {upcomingMembers.map(member => (
              <li key={member.id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-sm text-gray-500">Due: {member.feeDueDate.toDate().toLocaleDateString()}</p>
                </div>
                 <button onClick={() => handleMarkAsPaid(member.id, member.feeDueDate)} className="bg-green-500 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-600">Mark Paid</button>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-gray-500">No upcoming payments found.</p>}
      </div>
    </div>
  );
};

export default FeeDashboard;
