// Filename: src/components/ClassList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, orderBy, doc, deleteDoc } from 'firebase/firestore';
import EditClassModal from './EditClassModal'; // Import the modal

const ClassList = ({ gymId }) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  useEffect(() => {
    setLoading(true);
    const classesCollectionRef = collection(db, 'gyms', gymId, 'classes');
    const q = query(classesCollectionRef, orderBy('dateTime', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const classesData = [];
      querySnapshot.forEach((doc) => {
        classesData.push({ ...doc.data(), id: doc.id });
      });
      setClasses(classesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gymId]);

  const handleDelete = async (classId) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteDoc(doc(db, 'gyms', gymId, 'classes', classId));
      } catch (error) {
        console.error("Error deleting class: ", error);
        alert("Failed to delete class.");
      }
    }
  };

  const handleEdit = (cls) => {
    setEditingClass(cls);
    setIsModalOpen(true);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.toDate()).toLocaleString([], {
      weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Upcoming Classes ({classes.length})</h3>
        {loading ? (
          <p>Loading classes...</p>
        ) : classes.length === 0 ? (
          <p>No classes scheduled. Add one using the form above.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {classes.map((cls) => (
              <li key={cls.id} className="py-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{cls.name}</p>
                    <p className="text-sm text-gray-600">Instructor: {cls.instructor}</p>
                  </div>
                  <p className="text-sm text-purple-700 font-semibold whitespace-nowrap">{formatDate(cls.dateTime)}</p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button onClick={() => handleEdit(cls)} className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cls.id)} className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <EditClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        classData={editingClass}
        gymId={gymId}
      />
    </>
  );
};

export default ClassList;