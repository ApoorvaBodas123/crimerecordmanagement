import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import CrimesPage from '@/pages/CrimesPage';
import DirectoryPage from '@/pages/DirectoryPage';
import AboutPage from '@/pages/AboutPage';
import SosPage from '@/pages/SosPage';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import { Toaster } from 'sonner';

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/crimes" element={<CrimesPage />} />
            <Route path="/directory" element={<DirectoryPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/sos" element={<SosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
