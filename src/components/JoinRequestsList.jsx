// Filename: src/components/JoinRequestsList.jsx

import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, doc, runTransaction, serverTimestamp } from 'firebase/firestore';

const JoinRequestsList = ({ gymId }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const requestsRef = collection(db, 'gyms', gymId, 'joinRequests');
    const q = query(requestsRef, where('status', '==', 'pending'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [gymId]);

  const handleRequest = async (requestId, requestingUser, action) => {
    const requestDocRef = doc(db, 'gyms', gymId, 'joinRequests', requestId);

    try {
      if (action === 'approve') {
        // Use a transaction to ensure both operations succeed or fail together
        await runTransaction(db, async (transaction) => {
          // 1. Create a new member document
          const newMemberRef = doc(collection(db, 'gyms', gymId, 'members'));
          transaction.set(newMemberRef, {
            name: requestingUser.userName,
            email: requestingUser.userEmail,
            userId: requestingUser.userId,
            joinDate: serverTimestamp(),
          });

          // 2. Delete the join request document
          transaction.delete(requestDocRef);
        });
        console.log("User approved and added as member!");
      } else { // 'deny' action
        await runTransaction(db, async (transaction) => {
          transaction.delete(requestDocRef);
        });
        console.log("Request denied.");
      }
    } catch (error) {
      console.error("Transaction failed: ", error);
      alert("Failed to process request. Please try again.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Membership Requests ({requests.length})</h3>
      {loading ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p>No pending membership requests.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {requests.map((req) => (
            <li key={req.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="font-medium text-gray-800">{req.userName}</p>
                <p className="text-sm text-gray-500">{req.userEmail}</p>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0">
                <button
                  onClick={() => handleRequest(req.id, req, 'approve')}
                  className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-md hover:bg-green-200"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleRequest(req.id, req, 'deny')}
                  className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200"
                >
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default JoinRequestsList;