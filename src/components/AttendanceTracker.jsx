import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

const AttendanceTracker = ({ gymId }) => {
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Get today's date in YYYY-MM-DD format, which is a great ID for our daily attendance doc
  const today = new Date().toISOString().split('T')[0];

  // 1. Fetch the list of all members
  useEffect(() => {
    const membersRef = collection(db, 'gyms', gymId, 'members');
    const q = query(membersRef, orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, snapshot => {
      setMembers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  }, [gymId]);

  // 2. Fetch today's attendance record if it exists
  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      const attendanceDocRef = doc(db, 'gyms', gymId, 'attendance', today);
      const docSnap = await getDoc(attendanceDocRef);
      if (docSnap.exists()) {
        setAttendance(docSnap.data().members || {});
      } else {
        setAttendance({});
      }
      setLoading(false);
    };
    fetchAttendance();
  }, [gymId, today]);

  const handleCheckboxChange = (memberId) => {
    setAttendance(prev => ({
      ...prev,
      [memberId]: !prev[memberId] // Toggle true/false
    }));
  };

  const handleSaveAttendance = async () => {
    setMessage('');
    try {
      const attendanceDocRef = doc(db, 'gyms', gymId, 'attendance', today);
      await setDoc(attendanceDocRef, {
        date: serverTimestamp(),
        members: attendance
      }, { merge: true }); // Use merge to avoid overwriting other fields
      setMessage('Attendance saved successfully!');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
    } catch (error) {
      console.error("Error saving attendance: ", error);
      setMessage('Failed to save attendance.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Attendance - {new Date(today).toLocaleDateString()}</h3>
      {loading ? <p className="text-gray-600">Loading...</p> : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {members.map(member => (
            <label key={member.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition">
              <span className="text-gray-700">{member.name}</span>
              <input
                type="checkbox"
                checked={!!attendance[member.id]} // Use !! to ensure it's a boolean
                onChange={() => handleCheckboxChange(member.id)}
                className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500"
              />
            </label>
          ))}
        </div>
      )}
      <button
        onClick={handleSaveAttendance}
        className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
      >
        Save Attendance
      </button>
      {message && <p className="text-center text-sm text-gray-600 mt-3">{message}</p>}
    </div>
  );
};

export default AttendanceTracker;
