import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const PricingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State to manage which tier is selected for each plan
  const [selectedTiers, setSelectedTiers] = useState({
    'Standard User': 0, // Default to the first tier (monthly)
    'Gym Owner': 0,
  });

  let isTrialActive = false;
  if (currentUser?.subscriptionStatus === 'trial') {
    const trialEndDate = currentUser.trialEndDate?.toDate();
    if (trialEndDate && trialEndDate > new Date()) isTrialActive = true;
  }
  const isStandardActive = currentUser?.role === 'user' && (currentUser?.subscriptionStatus === 'active' || isTrialActive);
  const isOwnerActive = currentUser?.role === 'gym-owner';

  const plans = [
    { 
      name: 'Standard User', 
      description: 'For individuals who want to track their progress and get AI-powered coaching.', 
      features: ['Workout Logging', 'BMI Tracking', 'AI Workout Plans', 'AI Diet Plans'], 
      color: 'sky', 
      disabled: isStandardActive,
      tiers: [
        { duration: '1 Month', price: 150, amount: 15000 },
        { duration: '3 Months', price: 400, amount: 40000 },
        { duration: '6 Months', price: 800, amount: 80000 },
        { duration: '12 Months', price: 1500, amount: 150000 },
      ]
    },
    { 
      name: 'Gym Owner', 
      description: 'For gym owners who need a complete management solution.', 
      features: ['All User Features', 'Member Management', 'Class Scheduling', 'Attendance Tracking', 'Join Request Management'], 
      color: 'emerald', 
      disabled: isOwnerActive,
      tiers: [
        { duration: '1 Month', price: 600, amount: 60000 },
        { duration: '3 Months', price: 1700, amount: 170000 },
        { duration: '6 Months', price: 3400, amount: 340000 },
        { duration: '12 Months', price: 6000, amount: 600000 },
      ]
    },
  ];

  const handleTierChange = (planName, tierIndex) => {
    setSelectedTiers(prev => ({ ...prev, [planName]: tierIndex }));
  };

  const handleSubscribe = async (plan, tierIndex) => {
    if (!currentUser) return alert("Please log in to subscribe.");
    
    const selectedTier = plan.tiers[tierIndex];

    try {
      const response = await fetch('/api/createRazorpayOrder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedTier.amount,
          currency: 'INR',
          planName: `${plan.name} - ${selectedTier.duration}`,
          userId: currentUser.uid,
        }),
      });

      if (!response.ok) throw new Error('Failed to create order');
      
      const order = await response.json();

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: order.currency,
        name: "GymPro Subscription",
        description: `Payment for ${plan.name} - ${selectedTier.duration}`,
        order_id: order.id,
        handler: async function (res) {
          alert("Payment Successful! Your account is being updated.");
          
          const userDocRef = doc(db, 'users', currentUser.uid);
          if (plan.name === 'Gym Owner') {
            await updateDoc(userDocRef, { role: 'gym-owner', subscriptionStatus: 'active' });
            navigate('/gym-owner');
          } else {
            await updateDoc(userDocRef, { subscriptionStatus: 'active' });
            navigate('/progress');
          }
        },
        prefill: {
          name: currentUser.name || "GymPro User",
          email: currentUser.email,
        },
        theme: { color: "#3399cc" }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment failed: ", error);
      alert("There was an error processing your payment. Please try again.");
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
          const selectedTierIndex = selectedTiers[plan.name];
          const currentTier = plan.tiers[selectedTierIndex];
          const buttonText = plan.disabled ? 'Current Plan' : `Subscribe for ${currentTier.duration}`;

          return (
            <div key={plan.name} className={`bg-white rounded-lg shadow-lg p-8 flex flex-col border-t-4 ${styles.border}`}>
              <h2 className={`text-2xl font-bold text-gray-800 ${styles.text}`}>{plan.name}</h2>
              <p className="text-gray-600 mt-2">{plan.description}</p>
              
              <div className="my-4">
                <div className="flex justify-center space-x-2 bg-slate-100 p-1 rounded-lg">
                  {plan.tiers.map((tier, index) => (
                    <button
                      key={index}
                      onClick={() => handleTierChange(plan.name, index)}
                      className={`w-full text-xs font-semibold py-2 rounded-md transition ${selectedTierIndex === index ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:bg-slate-200'}`}
                    >
                      {tier.duration}
                    </button>
                  ))}
                </div>
              </div>

              <div className="my-4 text-center">
                <span className="text-5xl font-extrabold text-gray-900">₹{currentTier.price}</span>
                <span className="text-gray-500">/{currentTier.duration.split(' ')[1]}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map(feature => (<li key={feature} className="flex items-center text-gray-700"><svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>{feature}</li>))}
              </ul>
              <button onClick={() => handleSubscribe(plan, selectedTierIndex)} disabled={plan.disabled} className={`w-full mt-auto text-white py-3 rounded-md transition text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed ${styles.bg} ${styles.hoverBg}`}>{buttonText}</button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default PricingPage;
