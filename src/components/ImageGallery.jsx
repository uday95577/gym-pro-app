import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';

const ImageGallery = ({ gymId }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen for real-time updates to the gym's images array
  useEffect(() => {
    if (!gymId) return;
    const gymDocRef = doc(db, 'gyms', gymId);
    const unsubscribe = onSnapshot(gymDocRef, (doc) => {
      if (doc.exists() && doc.data().images) {
        setImages(doc.data().images);
      } else {
        setImages([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [gymId]);

  const handleDelete = async (imageUrl) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const gymDocRef = doc(db, 'gyms', gymId);
      try {
        // Use arrayRemove to delete the specific URL from the 'images' array
        await updateDoc(gymDocRef, {
          images: arrayRemove(imageUrl)
        });
      } catch (error) {
        console.error("Error deleting image: ", error);
        alert("Failed to delete image.");
      }
    }
  };

  if (loading) {
    return <p className="text-sm text-gray-500">Loading gallery...</p>;
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold mb-4 text-gray-700">Your Gallery</h4>
      {images.length === 0 ? (
        <p className="text-sm text-gray-500">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img src={url} alt={`Gym photo ${index + 1}`} className="rounded-lg object-cover w-full h-24" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(url)}
                  className="text-white bg-red-600 rounded-full h-8 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  X
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
