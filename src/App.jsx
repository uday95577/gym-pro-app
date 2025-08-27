import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';

function App() {
  const backgroundImageUrl = 'https://wallpapercave.com/wp/wp2333032.jpg';

  const appStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
  };

  return (
    <div style={appStyle} className="min-h-screen">
      <div className="bg-black bg-opacity-70 min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 text-slate-100">
          <Outlet />
        </main>
        {/* Add the Chatbot component here */}
        <Chatbot />
      </div>
    </div>
  );
}

export default App;
