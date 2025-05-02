
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AlertBanner from '@/components/AlertBanner';
import { useData } from '@/contexts/DataContext';
import { Toaster } from "@/components/ui/sonner";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { emergencyAlerts } = useData();
  
  return (
    <div className="flex flex-col min-h-screen">
      {emergencyAlerts.length > 0 && <AlertBanner alerts={emergencyAlerts} />}
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default MainLayout;
