import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const Hard75Page = () => {
  const { currentUser } = useAuth();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  // The 7 daily tasks for the challenge
  const tasks = [
    { id: 'workout1', label: '45-minute workout' },
    { id: 'workout2', label: '45-minute outdoor workout' },
    { id: 'diet', label: 'Follow a diet' },
    { id: 'noAlcohol', label: 'No alcohol or cheat meals' },
    { id: 'progressPhoto', label: 'Take a progress photo' },
    { id: 'water', label: 'Drink 1 gallon of water' },
    { id: 'read', label: 'Read 10 pages of a book' },
  ];

  // Fetch the user's challenge data
  useEffect(() => {
    if (!currentUser) return;
    const challengeDocRef = doc(db, 'users', currentUser.uid, '75hard', 'challengeData');
    const fetchData = async () => {
      setLoading(true);
      const docSnap = await getDoc(challengeDocRef);
      if (docSnap.exists()) {
        setChallenge(docSnap.data());
      } else {
        setChallenge(null); // No active challenge
      }
      setLoading(false);
    };
    fetchData();
  }, [currentUser]);

  const startChallenge = async () => {
    if (!currentUser) return;
    const challengeDocRef = doc(db, 'users', currentUser.uid, '75hard', 'challengeData');
    const startDate = new Date();
    const newChallenge = {
      isActive: true,
      startDate: startDate,
      progress: {}, // An object to store daily progress
      lastCompletedDay: 0,
    };
    await setDoc(challengeDocRef, newChallenge);
    setChallenge(newChallenge);
  };

  const handleRestart = async () => {
    if (window.confirm("Are you sure you want to restart the challenge? All your current progress will be lost.")) {
      if (!currentUser) return;
      const challengeDocRef = doc(db, 'users', currentUser.uid, '75hard', 'challengeData');
      await deleteDoc(challengeDocRef);
      setChallenge(null); // This will cause the UI to show the "Start Challenge" screen
    }
  };

  const handleTaskToggle = async (day, task) => {
    if (!challenge) return;
    const challengeDocRef = doc(db, 'users', currentUser.uid, '75hard', 'challengeData');
    
    const newProgress = JSON.parse(JSON.stringify(challenge.progress));
    
    if (!newProgress[day]) {
      newProgress[day] = {};
    }
    
    newProgress[day][task] = !newProgress[day][task];

    const allTasksComplete = tasks.every(t => newProgress[day][t.id]);
    
    let updateData = {
      progress: newProgress,
      lastCompletedDay: allTasksComplete && day > (challenge.lastCompletedDay || 0) ? day : challenge.lastCompletedDay,
    };

    await updateDoc(challengeDocRef, updateData);
    setChallenge(prev => ({...prev, ...updateData}));
  };

  if (loading) {
    return <p className="text-center text-slate-300">Loading Challenge...</p>;
  }

  // View for users who have NOT started the challenge
  if (!challenge || !challenge.isActive) {
    return (
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">The 75 Hard Challenge</h1>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto text-gray-800">
          <h2 className="text-2xl font-bold mb-4">Are you ready to change your life?</h2>
          <p className="mb-6">
            75 Hard is a transformative mental toughness program. For the next 75 days, you will follow these rules with zero compromise.
          </p>
          <ul className="text-left space-y-2 mb-8 list-disc list-inside">
            {tasks.map(task => <li key={task.id}>{task.label}</li>)}
          </ul>
          <button
            onClick={startChallenge}
            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-green-700 transition"
          >
            Start My 75 Day Challenge
          </button>
        </div>
      </div>
    );
  }

  // View for users with an ACTIVE challenge
  const startDate = challenge.startDate.toDate ? challenge.startDate.toDate() : challenge.startDate;
  const currentDay = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const progressPercentage = Math.floor(((challenge.lastCompletedDay || 0) / 75) * 100);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2">75 Hard Challenge: Day {currentDay}</h1>
          <p className="text-slate-300">You've got this. Stick to the plan.</p>
        </div>
        <button
          onClick={handleRestart}
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition self-start sm:self-center"
        >
          Restart Challenge
        </button>
      </div>

      <div className="bg-white rounded-full shadow-md p-1 mb-8">
        <div 
          className="bg-sky-500 text-xs font-medium text-blue-100 text-center p-1 leading-none rounded-full transition-all duration-500" 
          style={{ width: `${progressPercentage}%` }}
        >
          {progressPercentage > 0 ? `${progressPercentage}% Complete` : ''}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Today's Tasks (Day {currentDay})</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <label key={task.id} className="flex items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition cursor-pointer">
              <input
                type="checkbox"
                checked={challenge.progress[currentDay]?.[task.id] || false}
                onChange={() => handleTaskToggle(currentDay, task.id)}
                className="h-6 w-6 rounded text-sky-600 focus:ring-sky-500 border-gray-300"
              />
              <span className="ml-4 text-lg text-gray-700">{task.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hard75Page;
