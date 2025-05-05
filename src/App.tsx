import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import MainLayout from '@/layouts/MainLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CrimesPage from '@/pages/CrimesPage';
import AddCrimePage from '@/pages/AddCrimePage';
import CrimeDetailsPage from '@/pages/CrimeDetailsPage';
import { useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import HomePage from '@/pages/HomePage';
import DirectoryPage from '@/pages/DirectoryPage';
import AboutPage from '@/pages/AboutPage';
import SosPage from '@/pages/SosPage';
import PoliceDashboard from '@/pages/PoliceDashboard';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-police-dark mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sos" element={<SosPage />} />
            <Route
              path="/crimes"
              element={
                <PrivateRoute>
                  <CrimesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/crimes/add"
              element={
                <PrivateRoute>
                  <AddCrimePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/crimes/:id"
              element={
                <PrivateRoute>
                  <CrimeDetailsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <PoliceDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
