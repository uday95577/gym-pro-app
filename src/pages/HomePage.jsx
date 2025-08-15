import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Icon components for the features section
const BarChartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const BrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;


const HomePage = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    const elements = document.querySelectorAll('.fade-in-element');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.remove('opacity-0', 'translate-y-4');
      }, index * 200);
    });
  }, []);

  const features = [
    {
      icon: <BarChartIcon />,
      title: 'Track Your Progress',
      description: 'Log every workout and BMI measurement. Visualize your journey with our easy-to-use tracking tools.',
      color: 'from-sky-500 to-blue-600'
    },
    {
      icon: <BrainIcon />,
      title: 'AI-Powered Coaching',
      description: 'Get personalized workout and diet plans from our advanced AI, tailored to your goals, preferences, and budget.',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: <BuildingIcon />,
      title: 'Full Gym Management',
      description: 'For owners, a complete suite to manage members, class schedules, and membership requests in one place.',
      color: 'from-emerald-500 to-green-600'
    }
  ];

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white text-center py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight transition-all duration-700 opacity-0 translate-y-4 fade-in-element">
            Your Ultimate Fitness Partner
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-slate-300 transition-all duration-700 opacity-0 translate-y-4 fade-in-element">
            Whether you're an individual tracking progress or a gym owner managing your facility, we have the tools you need to succeed.
          </p>
          <Link
            to={currentUser ? "/progress" : "/signup"}
            className="mt-8 inline-block bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg text-lg transform hover:scale-105 transition-all duration-700 opacity-0 translate-y-4 fade-in-element"
          >
            {currentUser ? "Go to Your Hub" : "Get Started for Free"}
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything You Need, All in One Place
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Powerful features designed for peak performance.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 opacity-0 translate-y-4 fade-in-element">
                <div className={`p-6 bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="mt-3 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} GymPro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
