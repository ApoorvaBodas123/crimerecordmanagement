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
      <div className="sticky top-0 z-50">
        {emergencyAlerts.length > 0 && <AlertBanner alerts={emergencyAlerts} />}
        <Navbar />
      </div>
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
      <Toaster position="top-center" />
    </div>
  );
};

export default MainLayout;
