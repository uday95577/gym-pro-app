import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import GymOwnerPage from './pages/GymOwnerPage.jsx';
import BrowseGymsPage from './pages/BrowseGymsPage.jsx';
import GymDetailPage from './pages/GymDetailPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import Hard75Page from './pages/Hard75Page.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ManageSubscriptionPage from './pages/ManageSubscriptionPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      {
        path: '/progress',
        element: (
          <ProtectedRoute>
            <ProgressPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gym-owner',
        element: (
          <ProtectedRoute>
            <GymOwnerPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/browse-gyms',
        element: (
          <ProtectedRoute>
            <BrowseGymsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gym/:gymId',
        element: (
          <ProtectedRoute>
            <GymDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/gym/:gymId/attendance',
        element: (
          <ProtectedRoute>
            <AttendancePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/pricing',
        element: (
          <ProtectedRoute>
            <PricingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/75-hard',
        element: (
          <ProtectedRoute>
            <Hard75Page />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/manage-subscription',
        element: (
          <ProtectedRoute>
            <ManageSubscriptionPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
