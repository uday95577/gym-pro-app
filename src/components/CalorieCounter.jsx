import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const CalorieCounter = ({ latestBmi }) => {
  const { currentUser } = useAuth();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState(1.375); // Default to Lightly Active

  const calorieData = useMemo(() => {
    if (!latestBmi || !age || !gender) {
      return null;
    }

    const { weight, height } = latestBmi;
    
    // Calculate BMR using the Mifflin-St Jeor equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = bmr * activityLevel;
    
    return {
      maintenance: Math.round(tdee),
      mildLoss: Math.round(tdee - 250),
      weightLoss: Math.round(tdee - 500),
      mildGain: Math.round(tdee + 250),
      weightGain: Math.round(tdee + 500),
    };
  }, [latestBmi, age, gender, activityLevel]);

  if (!latestBmi) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
        <h2 className="text-xl font-semibold mb-2">Daily Calorie Goal</h2>
        <p className="text-gray-600">Please log your height and weight in the BMI Tracker above to calculate your personalized calorie recommendations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-gray-800">
      <h2 className="text-xl font-semibold mb-4">Daily Calorie Goal Calculator</h2>
      
      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Your Age"
          className="p-2 border border-gray-300 rounded-md"
        />
        <select value={gender} onChange={(e) => setGender(e.target.value)} className="p-2 border border-gray-300 rounded-md">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select value={activityLevel} onChange={(e) => setActivityLevel(Number(e.target.value))} className="p-2 border border-gray-300 rounded-md">
          <option value={1.2}>Sedentary</option>
          <option value={1.375}>Lightly Active</option>
          <option value={1.55}>Moderately Active</option>
          <option value={1.725}>Very Active</option>
          <option value={1.9}>Extra Active</option>
        </select>
      </div>

      {/* Results Display */}
      {calorieData && (
        <div className="space-y-3">
          <h3 className="font-bold text-lg">Your Recommended Daily Intake:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <p className="font-semibold text-yellow-800">Weight Loss</p>
              <p className="text-2xl font-bold text-yellow-900">{calorieData.weightLoss}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <p className="font-semibold text-green-800">Maintenance</p>
              <p className="text-2xl font-bold text-green-900">{calorieData.maintenance}</p>
            </div>
            <div className="bg-sky-100 p-3 rounded-lg">
              <p className="font-semibold text-sky-800">Weight Gain</p>
              <p className="text-2xl font-bold text-sky-900">{calorieData.weightGain}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalorieCounter;
