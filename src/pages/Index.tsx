
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SosButton from '@/components/SosButton';
import CrimeCard from '@/components/CrimeCard';
import SafetyTipCard from '@/components/SafetyTipCard';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, AlertTriangle, FileText, Users, Phone } from 'lucide-react';

const Index = () => {
  const { crimeRecords, safetyTips } = useData();
  const { user } = useAuth();
  
  // Get the most recent 3 crime records
  const recentCrimes = [...crimeRecords]
    .sort((a, b) => new Date(b.dateReported).getTime() - new Date(a.dateReported).getTime())
    .slice(0, 3);
  
  // Get the 3 most recent safety tips
  const recentTips = [...safetyTips]
    .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())
    .slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-police-gradient text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Civic Eye Guardian System
              </h1>
              <p className="text-lg mb-6">
                Strengthening communities through transparency, safety, and vigilance. Your partner in creating a safer environment.
              </p>
              <div className="flex flex-wrap gap-4">
                {!user && (
                  <Button asChild size="lg" className="bg-white text-police hover:bg-gray-100">
                    <Link to="/register">Register Now</Link>
                  </Button>
                )}
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-police">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="max-w-md">
                <SosButton />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-police-dark">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-police">
              <CardHeader>
                <Shield className="h-10 w-10 text-police mb-2" />
                <CardTitle>Crime Records</CardTitle>
                <CardDescription>Access and view the latest crime data in your area</CardDescription>
              </CardHeader>
              <CardContent>
                Police officers can add, update, and manage criminal records while citizens can stay informed about crime activity.
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/crimes">View Crime Records</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-t-4 border-t-police">
              <CardHeader>
                <Users className="h-10 w-10 text-police mb-2" />
                <CardTitle>Police Directory</CardTitle>
                <CardDescription>Connect with your local police force</CardDescription>
              </CardHeader>
              <CardContent>
                Find information about police stations and officers in your area, including contact details and specializations.
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/directory">Browse Directory</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border-t-4 border-t-alert">
              <CardHeader>
                <AlertTriangle className="h-10 w-10 text-alert mb-2" />
                <CardTitle>Emergency SOS</CardTitle>
                <CardDescription>One-click alert system for emergencies</CardDescription>
              </CardHeader>
              <CardContent>
                Send your location to nearby police stations with a single click in case of emergency situations.
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-alert hover:bg-alert-dark">
                  <Link to="/sos">Emergency SOS</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Cases & Safety Tips */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Recent Cases */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-police-dark">Recent Crime Reports</h2>
                <Button asChild variant="outline">
                  <Link to="/crimes">View All</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {recentCrimes.map((crime) => (
                  <CrimeCard key={crime.id} crime={crime} />
                ))}
              </div>
            </div>
            
            {/* Safety Tips */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-700">Safety Tips</h2>
                <Button asChild variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                  <Link to="/safety-tips">View All</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {recentTips.map((tip) => (
                  <SafetyTipCard key={tip.id} tip={tip} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to help make your community safer?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join the Civic Eye Guardian System to stay informed and contribute to the safety of your neighborhood.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user && (
              <Button asChild size="lg" className="bg-white text-police-dark hover:bg-gray-100">
                <Link to="/register">Register Now</Link>
              </Button>
            )}
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
