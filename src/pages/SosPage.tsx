
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import SosButton from '@/components/SosButton';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, MapPin, Phone, Info, CheckCircle } from 'lucide-react';

const SosPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-police-dark mb-4">Emergency SOS</h1>
            <p className="text-xl text-gray-600">
              Quick access to emergency services when you need them most
            </p>
          </div>
          
          <Card className="mb-8 border-alert">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center py-8">
                <AlertTriangle className="h-16 w-16 text-alert mb-4" />
                <p className="text-lg font-medium mb-8 text-center">
                  Press the SOS button below only in case of a genuine emergency situation
                </p>
                <SosButton />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  How It Works
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-police mt-0.5" />
                    <div>
                      <p className="font-medium">Location Sharing</p>
                      <p className="text-gray-600">
                        Your current location is automatically shared with emergency services
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 text-alert mt-0.5" />
                    <div>
                      <p className="font-medium">Alert Dispatch</p>
                      <p className="text-gray-600">
                        An emergency alert is sent to the nearest police station
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Response Confirmation</p>
                      <p className="text-gray-600">
                        You'll receive a confirmation when help is on the way
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  When To Use SOS
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li className="pl-4 border-l-2 border-red-500">
                    Immediate danger to yourself or others
                  </li>
                  <li className="pl-4 border-l-2 border-red-500">
                    Witnessing a violent crime in progress
                  </li>
                  <li className="pl-4 border-l-2 border-red-500">
                    Medical emergencies requiring immediate assistance
                  </li>
                  <li className="pl-4 border-l-2 border-red-500">
                    Fire or other dangerous situations
                  </li>
                  <li className="pl-4 border-l-2 border-red-500">
                    Traffic accidents with injuries
                  </li>
                </ul>
                <div className="mt-6 bg-amber-50 p-4 rounded-md">
                  <p className="text-amber-800 font-medium">Important Note</p>
                  <p className="text-amber-700 text-sm">
                    Misuse of the emergency SOS feature for non-emergency situations may result in penalties according to local regulations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Alternative Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Emergency Services:</p>
                <p className="text-lg font-bold">911</p>
              </div>
              <div>
                <p className="font-medium">Police Non-Emergency:</p>
                <p className="text-lg font-bold">(555) 123-4567</p>
              </div>
              <div>
                <p className="font-medium">Poison Control:</p>
                <p className="text-lg font-bold">(800) 222-1222</p>
              </div>
              <div>
                <p className="font-medium">Crisis Hotline:</p>
                <p className="text-lg font-bold">(800) 273-8255</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SosPage;
