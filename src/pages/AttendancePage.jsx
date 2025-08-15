import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, setDoc, where } from 'firebase/firestore';

const AttendancePage = () => {
  const { gymId } = useParams();
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // --- Step 1: Fetch Data ---
  useEffect(() => {
    if (!gymId) return;

    // Fetch member list
    const membersRef = collection(db, 'gyms', gymId, 'members');
    const qMembers = query(membersRef, orderBy('name', 'asc'));
    const unsubscribeMembers = onSnapshot(qMembers, snapshot => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch attendance for the current month
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const startOfMonth = `${year}-${month}-01`;
    const endOfMonth = `${year}-${month}-31`; // Firestore handles date strings correctly

    const attendanceRef = collection(db, 'gyms', gymId, 'attendance');
    const qAttendance = query(attendanceRef, where('__name__', '>=', startOfMonth), where('__name__', '<=', endOfMonth));
    
    const unsubscribeAttendance = onSnapshot(qAttendance, snapshot => {
      const attendanceData = {};
      snapshot.forEach(doc => {
        attendanceData[doc.id] = doc.data().members;
      });
      setAttendance(attendanceData);
      setLoading(false);
    });

    return () => {
      unsubscribeMembers();
      unsubscribeAttendance();
    };
  }, [gymId, currentMonth]);

  // --- Step 2: UI Logic & Handlers ---
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleMonthChange = (offset) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + offset);
      return newDate;
    });
  };

  const handleCheckboxChange = async (memberId, day) => {
    const dateString = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    const attendanceDocRef = doc(db, 'gyms', gymId, 'attendance', dateString);
    
    const currentStatus = attendance[dateString]?.[memberId] || false;
    
    // Use dot notation for field paths to update a specific member
    await setDoc(attendanceDocRef, {
      members: {
        [memberId]: !currentStatus
      }
    }, { merge: true });
  };

  const memberAttendanceCount = useMemo(() => {
    const counts = {};
    members.forEach(member => {
      let count = 0;
      Object.values(attendance).forEach(dailyRecord => {
        if (dailyRecord[member.id]) {
          count++;
        }
      });
      counts[member.id] = count;
    });
    return counts;
  }, [attendance, members]);

  // --- Step 3: Render the Grid ---
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-100">Monthly Attendance</h1>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-lg shadow-md">
          <button onClick={() => handleMonthChange(-1)} className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300">‹ Prev</button>
          <span className="font-semibold text-lg text-gray-800 w-32 text-center">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => handleMonthChange(1)} className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300">Next ›</button>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        {loading ? <p className="text-gray-800">Loading attendance...</p> : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10">Member</th>
                {monthDays.map(day => <th key={day} className="px-3 py-3 text-center text-xs font-medium text-gray-500">{day}</th>)}
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {members.map(member => (
                <tr key={member.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">{member.name}</td>
                  {monthDays.map(day => {
                    const dateString = `${currentMonth.getFullYear()}-${(currentMonth.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const isPresent = attendance[dateString]?.[member.id] || false;
                    return (
                      <td key={day} className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isPresent}
                          onChange={() => handleCheckboxChange(member.id, day)}
                          className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                    );
                  })}
                  <td className="px-4 py-3 text-center text-sm font-bold text-blue-600">{memberAttendanceCount[member.id] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
