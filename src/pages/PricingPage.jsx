import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const PricingPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // More robust check for the user's current active plan, including trial expiration
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
    { name: 'Standard User', priceMonthly: 100, priceYearly: null, description: 'For individuals who want to track their progress and get AI-powered coaching.', features: ['Workout Logging', 'BMI Tracking', 'AI Workout Plans', 'AI Diet Plans'], buttonText: isStandardActive ? 'Current Plan' : 'Choose User Plan', color: 'sky', disabled: isStandardActive, amount: 10000 },
    { name: 'Gym Owner', priceMonthly: 500, priceYearly: 5000, description: 'For gym owners who need a complete management solution.', features: ['All User Features', 'Member Management', 'Class Scheduling', 'Attendance Tracking', 'Join Request Management'], buttonText: isOwnerActive ? 'Current Plan' : 'Upgrade to Owner', color: 'emerald', disabled: isOwnerActive, amount: 50000 },
  ];

  const handleSubscribe = async (plan) => {
    if (!currentUser) return alert("Please log in to subscribe.");
    
    try {
      // 1. Call our Vercel Serverless Function to create a Razorpay order
      const response = await fetch('/api/createRazorpayOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: plan.amount,
          currency: 'INR',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }
      
      const order = await response.json();

      // 2. Configure and open the Razorpay payment modal
      const options = {
        key: "rzp_test_R7Ik8O5up9G2lX", // IMPORTANT: Replace with your Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: "GymPro Subscription",
        description: `Payment for ${plan.name} Plan`,
        order_id: order.id,
        // eslint-disable-next-line no-unused-vars
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
        theme: {
          color: "#3399cc"
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment failed: ", error);
      alert("There was an error processing your payment. Please try again.");
    }
  };

  // Helper object to provide full, static class names for Tailwind
  const planStyles = {
    sky: {
      border: 'border-sky-500',
      text: 'text-sky-500',
      bg: 'bg-sky-500',
      hoverBg: 'hover:bg-sky-600',
    },
    emerald: {
      border: 'border-emerald-500',
      text: 'text-emerald-500',
      bg: 'bg-emerald-500',
      hoverBg: 'hover:bg-emerald-600',
    }
  };

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
              <button onClick={() => handleSubscribe(plan)} disabled={plan.disabled} className={`w-full mt-auto text-white py-3 rounded-md transition text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed ${styles.bg} ${styles.hoverBg}`}>{plan.buttonText}</button>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default PricingPage;
