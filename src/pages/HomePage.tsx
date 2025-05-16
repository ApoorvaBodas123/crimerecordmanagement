import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Users, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // If loading, show nothing
  if (isLoading) {
    return null;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-police-dark mb-6">
            Welcome to Civic Eye Guardian
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A comprehensive crime management system designed to enhance public safety and streamline law enforcement operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button onClick={() => navigate('/crimes')}>
                View Crime Records
              </Button>
            ) : (
              <>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/about">Learn More</Link>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <Shield className="h-12 w-12 text-police mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-black">Crime Management</h3>
            <p className="text-gray-600">
              Efficiently manage and track crime records in your jurisdiction.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <AlertTriangle className="h-12 w-12 text-police mb-4" />
            <h3 className="text-xl font-semibold text-black">Emergency Alerts</h3>
            <p className="text-gray-600">
              Receive and respond to emergency alerts in real-time.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <Users className="h-12 w-12 text-police mb-4" />
            <h3 className="text-xl font-semibold text-black">Police Directory</h3>
            <p className="text-gray-600">
              Access contact information for law enforcement personnel.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <FileText className="h-12 w-12 text-police mb-4" />
            <h3 className="text-xl font-semibold text-black">Reports & Analytics</h3>
            <p className="text-gray-600">
              Generate detailed reports and analyze crime patterns.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage; 