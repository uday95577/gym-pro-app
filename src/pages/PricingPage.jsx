import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore'; // Import setDoc instead of updateDoc

const PricingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Logic to check if the user's trial is active
  let isTrialActive = false;
  if (currentUser?.subscriptionStatus === 'trial') {
    const trialEndDate = currentUser.trialEndDate?.toDate();
    if (trialEndDate && trialEndDate > new Date()) {
      isTrialActive = true;
    }
  }

  const isStandardActive = currentUser?.role === 'user' && (currentUser?.subscriptionStatus === 'active' || isTrialActive);
  const isOwnerActive = currentUser?.role === 'gym-owner';

  const plans = [
    { name: 'Standard User', priceMonthly: '₹100', priceYearly: null, description: 'For individuals...', features: ['Workout Logging', 'BMI Tracking', 'AI Workout Plans', 'AI Diet Plans'], buttonText: isStandardActive ? 'Current Plan' : 'Choose User Plan', color: 'sky', disabled: isStandardActive },
    { name: 'Gym Owner', priceMonthly: '₹500', priceYearly: '₹5000', description: 'For gym owners...', features: ['All User Features', 'Member Management', 'Class Scheduling', 'Attendance Tracking', 'Join Request Management'], buttonText: isOwnerActive ? 'Current Plan' : 'Upgrade to Owner', color: 'emerald', disabled: isOwnerActive },
  ];

  const handleSubscribe = async (planName) => {
    if (!currentUser) return alert("Please log in to subscribe.");

    alert(`You have successfully subscribed to the ${planName} plan! (This is a simulation). Your account will now be updated.`);
    
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      let dataToSet = {};

      if (planName === 'Gym Owner') {
        dataToSet = {
          role: 'gym-owner',
          subscriptionStatus: 'active',
        };
        // Use setDoc with merge:true to create or update the document
        await setDoc(userDocRef, dataToSet, { merge: true });
        console.log("User role updated to gym-owner!");
        navigate('/gym-owner');
      } else if (planName === 'Standard User') {
        dataToSet = {
          subscriptionStatus: 'active',
        };
        await setDoc(userDocRef, dataToSet, { merge: true });
        console.log("User subscription activated for Standard Plan!");
        navigate('/progress');
      }
    } catch (error) {
      console.error("Error updating user subscription: ", error);
      alert("There was an error updating your account.");
    }
  };

  const planStyles = { sky: { border: 'border-sky-500', text: 'text-sky-500', bg: 'bg-sky-500', hoverBg: 'hover:bg-sky-600' }, emerald: { border: 'border-emerald-500', text: 'text-emerald-500', bg: 'bg-emerald-500', hoverBg: 'hover:bg-emerald-600' } };

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-slate-100 mb-4">Choose Your Plan</h1>
      <p className="text-lg text-center text-slate-300 mb-12">Every new account starts with a 3-day free trial.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map(plan => {
          const styles = planStyles[plan.color];
          return (
            <div key={plan.name} className={`bg-white rounded-lg shadow-lg p-8 flex flex-col border-t-4 ${styles.border}`}>
              <h2 className={`text-2xl font-bold text-gray-800 ${styles.text}`}>{plan.name}</h2>
              <p className="text-gray-600 mt-2 flex-grow">{plan.description}</p>
              <div className="my-6"><span className="text-5xl font-extrabold text-gray-900">₹{plan.priceMonthly}</span><span className="text-gray-500">/month</span></div>
              {plan.priceYearly && (<p className="text-gray-600 mb-6">Or <span className="font-bold">₹{plan.priceYearly}</span> per year</p>)}
              <ul className="space-y-3 mb-8">
                {plan.features.map(feature => (<li key={feature} className="flex items-center text-gray-700"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{feature}</li>))}
              </ul>
              <button onClick={() => handleSubscribe(plan.name)} disabled={plan.disabled} className={`w-full mt-auto text-white py-3 rounded-md transition text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed ${styles.bg} ${styles.hoverBg}`}>{plan.buttonText}</button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default PricingPage;
