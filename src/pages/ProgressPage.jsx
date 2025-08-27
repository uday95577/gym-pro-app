import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, limit, getDocs } from 'firebase/firestore';
import { generateWorkoutPlan, generateDietPlan } from '../aiService';
import BMITracker from '../components/BMITracker';
import AiPlanDisplay from '../components/AiPlanDisplay';
import SubscriptionGate from '../components/SubscriptionGate';
import TrialBanner from '../components/TrialBanner';
import CalorieCounter from '../components/CalorieCounter';

const ProgressPage = () => {
  const { currentUser } = useAuth();
  const [exercise, setExercise] = useState('');
  const [weight, setWeight] = useState('');
  const [workouts, setWorkouts] = useState([]);
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const [workoutPlan, setWorkoutPlan] = useState('');
  const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
  const [dietPlan, setDietPlan] = useState('');
  const [isGeneratingDiet, setIsGeneratingDiet] = useState(false);
  const [latestBmi, setLatestBmi] = useState(null);
  const [dietPrefs, setDietPrefs] = useState({
    motive: 'general fitness',
    mealType: 'vegetarian',
    budget: 'medium',
    suggestions: '',
  });
  const [workoutPrefs, setWorkoutPrefs] = useState({
    motive: 'muscle gain',
    level: 'intermediate',
    suggestions: '',
  });

  const handleWorkoutSubmit = async (e) => { e.preventDefault(); if (!exercise || !weight) return; await addDoc(collection(db, 'workouts'), { userId: currentUser.uid, exercise, weight: Number(weight), createdAt: serverTimestamp(), }); setExercise(''); setWeight(''); };
  const handleGenerateWorkout = async () => { setIsGeneratingWorkout(true); setWorkoutPlan(''); const plan = await generateWorkoutPlan({ ...workoutPrefs, latestBmi }); setWorkoutPlan(plan); setIsGeneratingWorkout(false); };
  const handleGenerateDiet = async () => { setIsGeneratingDiet(true); setDietPlan(''); const plan = await generateDietPlan(dietPrefs); setDietPlan(plan); setIsGeneratingDiet(false); };

  useEffect(() => { if (!currentUser) return; const fetchLatestBmi = async () => { const recordsRef = collection(db, 'users', currentUser.uid, 'bmiRecords'); const q = query(recordsRef, orderBy('date', 'desc'), limit(1)); const querySnapshot = await getDocs(q); if (!querySnapshot.empty) { setLatestBmi(querySnapshot.docs[0].data()); } }; fetchLatestBmi(); }, [currentUser]);
  useEffect(() => { if (!currentUser) return; setLoadingWorkouts(true); const q = query(collection(db, 'workouts'), where('userId', '==', currentUser.uid), orderBy('createdAt', 'desc')); const unsubscribe = onSnapshot(q, (snapshot) => { setWorkouts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))); setLoadingWorkouts(false); }); return () => unsubscribe(); }, [currentUser]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">Your Fitness Hub</h1>
      
      <TrialBanner />

      <SubscriptionGate>
        <div className="space-y-8">
          <BMITracker />

          <CalorieCounter latestBmi={latestBmi} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
            {/* AI Nutritionist Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">AI Nutritionist</h2>
                <p className="mb-4 text-slate-600 text-sm">Get a personalized weekly diet plan.</p>
              </div>
              <div className="space-y-3">
                <select value={dietPrefs.motive} onChange={(e) => setDietPrefs({...dietPrefs, motive: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md text-gray-800"><option value="weight loss">Goal: Weight Loss</option><option value="muscle gain">Goal: Muscle Gain</option><option value="general fitness">Goal: General Fitness</option></select>
                <select value={dietPrefs.mealType} onChange={(e) => setDietPrefs({...dietPrefs, mealType: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md text-gray-800"><option value="vegetarian">Vegetarian</option><option value="non-vegetarian">Non-Vegetarian</option><option value="vegan">Vegan</option></select>
                <select value={dietPrefs.budget} onChange={(e) => setDietPrefs({...dietPrefs, budget: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md text-gray-800"><option value="low">Budget: Low</option><option value="medium">Budget: Medium</option><option value="high">Budget: High</option></select>
                <textarea value={dietPrefs.suggestions} onChange={(e) => setDietPrefs({...dietPrefs, suggestions: e.target.value})} placeholder="Specific requests (e.g., 'no dairy')" className="w-full p-2 border border-gray-300 rounded-md text-gray-800" rows="2" />
              </div>
              <button onClick={handleGenerateDiet} disabled={isGeneratingDiet} className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition disabled:bg-teal-300">{isGeneratingDiet ? 'Generating...' : 'Generate Diet Plan'}</button>
              {dietPlan && <AiPlanDisplay planText={dietPlan} planType="diet" />}
            </div>

            {/* AI Workout Coach Card */}
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col space-y-4">
              <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">AI Workout Coach</h2>
                <p className="mb-4 text-slate-600 text-sm">Get a structured weekly workout plan.</p>
              </div>
              <div className="space-y-3">
                <select value={workoutPrefs.motive} onChange={(e) => setWorkoutPrefs({...workoutPrefs, motive: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md text-gray-800"><option value="fat loss">Goal: Fat Loss</option><option value="muscle gain">Goal: Muscle Gain</option><option value="strength">Goal: Strength</option></select>
                <select value={workoutPrefs.level} onChange={(e) => setWorkoutPrefs({...workoutPrefs, level: e.target.value})} className="w-full p-2 border border-gray-300 rounded-md text-gray-800"><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option></select>
                <textarea value={workoutPrefs.suggestions} onChange={(e) => setWorkoutPrefs({...workoutPrefs, suggestions: e.target.value})} placeholder="Specific requests (e.g., 'focus on legs')" className="w-full p-2 border border-gray-300 rounded-md text-gray-800" rows="2" />
              </div>
              <button onClick={handleGenerateWorkout} disabled={isGeneratingWorkout} className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition disabled:bg-purple-300">{isGeneratingWorkout ? 'Generating...' : 'Generate Workout Plan'}</button>
              {workoutPlan && <AiPlanDisplay planText={workoutPlan} planType="workout" />}
            </div>
          </div>
        
          {/* Workout Logger */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Log a New Workout</h2>
            <form onSubmit={handleWorkoutSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" value={exercise} onChange={(e) => setExercise(e.target.value)} placeholder="Exercise Name" className="px-3 py-2 border border-gray-300 rounded-md text-gray-900" required />
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (in kg)" className="px-3 py-2 border border-gray-300 rounded-md text-gray-900" required />
              <button type="submit" className="bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600 transition">Save Workout</button>
            </form>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Your Workout History</h3>
              {loadingWorkouts ? <p className="text-gray-600">Loading history...</p> : 
               workouts.length === 0 ? <p className="text-gray-600">You haven't logged any workouts yet.</p> : (
                <ul> {workouts.map((w) => (
                  <li key={w.id} className="border-b last:border-b-0 py-3 flex justify-between items-center">
                    <div><p className="font-bold text-lg text-gray-800">{w.exercise}</p><p className="text-sm text-gray-500">{w.createdAt ? new Date(w.createdAt.toDate()).toLocaleString() : 'Just now'}</p></div>
                    <p className="text-xl font-semibold text-sky-600">{w.weight} kg</p>
                  </li>
                ))} </ul>
              )}
            </div>
          </div>
        </div>
      </SubscriptionGate>
    </div>
  );
};

export default ProgressPage;
