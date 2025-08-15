import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgcb4QO68wrT6cKruaMO70lejV3_6fpC8",
  authDomain: "gympro-app-uday.firebaseapp.com",
  projectId: "gympro-app-uday",
  storageBucket: "gympro-app-uday.firebasestorage.app",
  messagingSenderId: "741570898980",
  appId: "1:741570898980:web:3c482fce50191bc682bcb1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app }; // Add this line to export the app instance
