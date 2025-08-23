import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';

const FeeDashboard = ({ gymId, gymName }) => { // Accept gymName as a prop
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!gymId) return;
    const membersRef = collection(db, 'gyms', gymId, 'members');
    const q = query(membersRef, orderBy('feeDueDate', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [gymId]);

  const handleMarkAsPaid = async (memberId, currentDueDate) => {
    const memberDocRef = doc(db, 'gyms', gymId, 'members', memberId);
    const newDueDate = new Date(currentDueDate.toDate());
    newDueDate.setMonth(newDueDate.getMonth() + 1);

    try {
      await updateDoc(memberDocRef, {
        feeDueDate: newDueDate,
      });
    } catch (error) {
      console.error("Error updating due date: ", error);
      alert("Failed to update payment status.");
    }
  };

  // --- NEW: Function to send reminders ---
  const handleSendReminders = async () => {
    setSending(true);
    setMessage('');
    try {
      const response = await fetch('/api/sendManualReminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gymId, gymName }),
      });
      const data = await response.json();
      setMessage(data.message || 'Reminders sent!');
    } catch (error) {
      console.error("Error sending reminders:", error);
      setMessage('Failed to send reminders.');
    } finally {
      setSending(false);
      setTimeout(() => setMessage(''), 5000); // Clear message after 5 seconds
    }
  };

  const today = new Date();
  const upcomingMembers = members.filter(m => m.feeDueDate && m.feeDueDate.toDate() >= today);
  const overdueMembers = members.filter(m => m.feeDueDate && m.feeDueDate.toDate() < today);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Fee Status Dashboard</h3>
        <button
          onClick={handleSendReminders}
          disabled={sending}
          className="bg-orange-500 text-white text-xs font-bold py-2 px-3 rounded-md hover:bg-orange-600 transition disabled:bg-gray-400"
        >
          {sending ? 'Sending...' : 'Send All Reminders'}
        </button>
      </div>
      {message && <p className="text-center text-sm text-gray-600 mb-4">{message}</p>}
      
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
