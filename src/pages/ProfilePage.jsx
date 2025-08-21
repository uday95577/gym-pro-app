import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [name, setName] = useState(currentUser?.name || '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (!currentUser) {
      setError("You must be logged in to update your profile.");
      setLoading(false);
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        name: name,
      });
      await updateProfile(auth.currentUser, { displayName: name });

      setMessage('Profile updated successfully!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      console.error("Error updating profile: ", err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !currentUser) return;

    setUploadingPhoto(true);
    setError('');
    setMessage('');

    const formData = new FormData();
    formData.append('image', file);

    try {
      // FIX: Use the full URL for local development, and a relative path for production
      const apiUrl = import.meta.env.DEV
        ? 'http://localhost:5173/api/uploadImage'
        : '/api/uploadImage';

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Image upload failed');
      
      const data = await response.json();
      const newPhotoUrl = data.secure_url;

      await updateProfile(auth.currentUser, { photoURL: newPhotoUrl });
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, { photoURL: newPhotoUrl });
      
      setMessage("Profile picture updated!");
      setTimeout(() => window.location.reload(), 1500);

    } catch (err) {
      console.error("Error uploading photo: ", err);
      setError("Failed to upload photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoChangeClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-100 mb-6">Manage Your Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md text-gray-800">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
          <img
            src={currentUser?.photoURL || `https://api.dicebear.com/8.x/initials/svg?seed=${currentUser?.name || currentUser?.email}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-sky-300"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold">{currentUser?.name || 'User'}</h2>
            <p className="text-gray-500">{currentUser?.email}</p>
            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            <button onClick={handlePhotoChangeClick} disabled={uploadingPhoto} className="text-sm text-sky-600 hover:underline mt-1 disabled:text-gray-400">
              {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
            </button>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full p-2 border border-gray-300 rounded-md text-gray-900" />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address (Cannot be changed)</label>
            <input id="email" type="email" value={currentUser?.email || ''} disabled className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed text-gray-500" />
          </div>
          <button type="submit" disabled={loading || uploadingPhoto} className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-300">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          {message && <p className="text-center text-sm text-green-600 mt-4">{message}</p>}
          {error && <p className="text-center text-sm text-red-600 mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
