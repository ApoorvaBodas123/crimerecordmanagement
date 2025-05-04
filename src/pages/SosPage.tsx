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
            <p className="text-xl text-gray-800">
              Quick access to emergency services when you need them most
            </p>
          </div>
          
          <Card className="mb-8 border-alert">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center py-8">
                <AlertTriangle className="h-16 w-16 text-alert mb-4" />
                <p className="text-lg font-medium mb-8 text-center text-gray-800">
                  Press the SOS button below only in case of a genuine emergency situation
                </p>
                <SosButton />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  How It Works
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 text-police mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Location Sharing</p>
                      <p className="text-gray-700">
                        Your current location is automatically shared with emergency services
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 text-alert mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Alert Dispatch</p>
                      <p className="text-gray-700">
                        An emergency alert is sent to the nearest police station
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Phone className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Response Confirmation</p>
                      <p className="text-gray-700">
                        You'll receive a confirmation when help is on the way
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  When To Use SOS
                </h2>
                <ul className="space-y-2">
                  <li className="pl-4 border-l-2 border-red-500 text-gray-800">
                    Immediate danger to yourself or others
                  </li>
                  <li className="pl-4 border-l-2 border-red-500 text-gray-800">
                    Witnessing a violent crime in progress
                  </li>
                  <li className="pl-4 border-l-2 border-red-500 text-gray-800">
                    Medical emergencies requiring immediate assistance
                  </li>
                  <li className="pl-4 border-l-2 border-red-500 text-gray-800">
                    Fire or other dangerous situations
                  </li>
                  <li className="pl-4 border-l-2 border-red-500 text-gray-800">
                    Traffic accidents with injuries
                  </li>
                </ul>
                <div className="mt-6 bg-amber-50 p-4 rounded-md">
                  <p className="text-amber-900 font-medium">Important Note</p>
                  <p className="text-amber-800 text-sm">
                    Misuse of the emergency SOS feature for non-emergency situations may result in penalties according to local regulations.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Alternative Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-gray-800">Emergency Services:</p>
                <p className="text-lg font-bold text-police-dark">911</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Police Non-Emergency:</p>
                <p className="text-lg font-bold text-police-dark">(555) 123-4567</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Poison Control:</p>
                <p className="text-lg font-bold text-police-dark">(800) 222-1222</p>
              </div>
              <div>
                <p className="font-medium text-gray-800">Crisis Hotline:</p>
                <p className="text-lg font-bold text-police-dark">(800) 273-8255</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SosPage;
