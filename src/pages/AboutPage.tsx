
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Shield, Users, FileText, AlertTriangle, Database, Lock, Clock, Zap } from 'lucide-react';

const AboutPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-police-dark mb-4">About Civic Eye Guardian System</h1>
          <p className="text-xl text-gray-600">
            A modern approach to crime management and community safety
          </p>
        </div>
        
        {/* Mission & Vision */}
        <div className="bg-police text-white p-8 rounded-lg mb-12">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="mb-6">
              To create a transparent, efficient, and responsive crime management system that 
              empowers both law enforcement agencies and citizens to work together in building 
              safer communities.
            </p>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p>
              A world where technology bridges the gap between police and public, where 
              information flows freely and securely, and where everyone has the tools they 
              need to contribute to community safety.
            </p>
          </div>
        </div>
        
        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">Key System Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-police-light inline-flex p-3 rounded-full text-white mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">
                Different access levels for citizens, police officers, and administrators
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-police-light inline-flex p-3 rounded-full text-white mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Crime Records</h3>
              <p className="text-gray-600">
                Comprehensive database of crime incidents with detailed information
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-alert inline-flex p-3 rounded-full text-white mb-4">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Emergency SOS</h3>
              <p className="text-gray-600">
                One-click emergency alert system with location sharing
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="bg-police-light inline-flex p-3 rounded-full text-white mb-4">
                <Database className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Data Analytics</h3>
              <p className="text-gray-600">
                Crime statistics and trend analysis to help prevent future incidents
              </p>
            </div>
          </div>
        </div>
        
        {/* How It Works */}
        <div className="mb-16 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">How It Works</h2>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-police-light"></div>
            
            {/* Timeline entries */}
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-police-dark">User Registration</h3>
                  <p className="text-gray-600">Citizens and police officers register with appropriate credentials</p>
                </div>
                <div className="md:w-1/2 md:pl-8 relative">
                  <div className="absolute left-0 md:-left-4 top-0 w-8 h-8 rounded-full bg-police border-4 border-white"></div>
                  <div className="pl-10 md:pl-0">
                    <Lock className="h-8 w-8 text-police-dark md:mx-auto mb-2" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-8 hidden md:block"></div>
                <div className="md:w-1/2 md:pl-8 relative">
                  <div className="absolute left-0 md:-left-4 top-0 w-8 h-8 rounded-full bg-police border-4 border-white"></div>
                  <div className="pl-10 md:pl-0">
                    <h3 className="text-xl font-bold text-police-dark">Access System</h3>
                    <p className="text-gray-600">Users get access to features based on their role</p>
                    <FileText className="h-8 w-8 text-police-dark md:mx-auto my-2" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-8 md:text-right mb-4 md:mb-0">
                  <h3 className="text-xl font-bold text-police-dark">Crime Management</h3>
                  <p className="text-gray-600">Police officers manage crime records, citizens can view public information</p>
                </div>
                <div className="md:w-1/2 md:pl-8 relative">
                  <div className="absolute left-0 md:-left-4 top-0 w-8 h-8 rounded-full bg-police border-4 border-white"></div>
                  <div className="pl-10 md:pl-0">
                    <Clock className="h-8 w-8 text-police-dark md:mx-auto mb-2" />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-8 hidden md:block"></div>
                <div className="md:w-1/2 md:pl-8 relative">
                  <div className="absolute left-0 md:-left-4 top-0 w-8 h-8 rounded-full bg-police border-4 border-white"></div>
                  <div className="pl-10 md:pl-0">
                    <h3 className="text-xl font-bold text-police-dark">Emergency Response</h3>
                    <p className="text-gray-600">Quick access to emergency services when needed</p>
                    <Zap className="h-8 w-8 text-police-dark md:mx-auto my-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Technology Stack */}
        <div className="bg-gray-100 p-8 rounded-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
            <p className="mb-6 text-center text-gray-700">
              Built with modern technologies to ensure security, reliability, and scalability
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded shadow">
                <p className="font-bold">React</p>
                <p className="text-sm text-gray-500">Frontend</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="font-bold">TypeScript</p>
                <p className="text-sm text-gray-500">Language</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="font-bold">Tailwind CSS</p>
                <p className="text-sm text-gray-500">Styling</p>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <p className="font-bold">Authentication</p>
                <p className="text-sm text-gray-500">Security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
