import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await sendEmailVerification(user);

      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 3);

      await setDoc(doc(db, 'users', user.uid), {
        name: name, // Full Name
        username: username, // Username
        email: user.email,
        phone: phone,
        role: 'user',
        createdAt: serverTimestamp(),
        subscriptionStatus: 'trial',
        trialEndDate: trialEndDate,
      });

      setSuccessMessage("Account created successfully! Please check your email to verify your account before logging in.");

    } catch (err) {
      console.error("Error signing up:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Create Your Account</h2>
        
        {successMessage ? (
          <div className="text-center">
            <p className="text-green-600 font-semibold">{successMessage}</p>
            <Link to="/login" className="text-sky-500 hover:underline font-medium mt-4 inline-block">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input id="name" type="text" placeholder="John Doe" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input id="username" type="text" placeholder="e.g., johndoe99" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>

            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input id="phone" type="tel" placeholder="e.g., 9876543210" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input id="email" type="email" placeholder="you@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input id="password" type="password" placeholder="Must be at least 6 characters" className="w-full px-3 py-2 border border-gray-300 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            
            <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition">Create Account</button>
            
            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-500 hover:underline font-medium">Login here</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
