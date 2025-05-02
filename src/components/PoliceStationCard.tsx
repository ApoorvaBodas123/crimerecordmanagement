
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PoliceStation } from '@/models/types';
import { MapPin, Phone, Mail, Police } from 'lucide-react';

interface PoliceStationCardProps {
  station: PoliceStation;
}

const PoliceStationCard: React.FC<PoliceStationCardProps> = ({ station }) => {
  return (
    <Card className="overflow-hidden border-t-4 border-t-police h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-police-dark">{station.name}</CardTitle>
        </div>
        <CardDescription className="flex items-center text-gray-600">
          <Police className="h-4 w-4 mr-1 inline" />
          {station.jurisdiction}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-col space-y-2 text-gray-700">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-police" />
            <span>{station.address}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-police" />
            <span>{station.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-police" />
            <a href={`mailto:${station.email}`} className="text-blue-600 hover:underline">
              {station.email}
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <Button variant="outline" className="w-full border-police text-police hover:bg-police hover:text-white">
          View Officers
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PoliceStationCard;
