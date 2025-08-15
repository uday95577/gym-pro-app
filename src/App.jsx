import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

function App() {
  // --- IMPORTANT ---
  // This now uses the image link you provided.
  const backgroundImageUrl = 'https://wallpapercave.com/wp/wp2333032.jpg';

  const appStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed', // This creates a nice stationary background effect on scroll
  };

  return (
    // This main container has the background image style applied
    <div style={appStyle} className="min-h-screen">
      {/* This overlay darkens the background slightly to make sure text is always readable */}
      <div className="bg-black bg-opacity-70 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4">
          <Outlet /> {/* Your page content (HomePage, ProgressPage, etc.) will be rendered here */}
        </main>
      </div>
    </div>
  );
}

export default App;
