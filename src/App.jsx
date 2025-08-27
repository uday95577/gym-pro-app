import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function App() {
  const backgroundImageUrl = 'https://wallpapercave.com/wp/wp2333032.jpg';
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const appStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div style={appStyle} className="min-h-screen">
      <div className="bg-black bg-opacity-70 min-h-screen">
        <Navbar onChatbotToggle={() => setIsChatbotOpen(prev => !prev)} />
        <main className="max-w-7xl mx-auto py-6 px-4 text-slate-100">
          <Outlet />
        </main>
        
        {/* The Chatbot window, controlled by the App's state */}
        <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

        {/* --- NEW: Floating Chat Button for Desktop --- */}
        {/* This button is hidden on small screens (md:flex) to avoid collision */}
        <button
          onClick={() => setIsChatbotOpen(true)}
          className="hidden md:flex fixed bottom-6 right-6 bg-sky-600 text-white w-14 h-14 rounded-full shadow-lg items-center justify-center transform hover:scale-110 transition-transform z-40"
        >
          <svg xmlns="http://www.w.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default App;
