
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PoliceStation } from '@/models/types';
import { MapPin, Phone, Mail, Shield } from 'lucide-react';

interface PoliceStationCardProps {
  station: PoliceStation;
}

const PoliceStationCard: React.FC<PoliceStationCardProps> = ({ station }) => {
  return (
    <Card className="overflow-hidden border-t-4 border-t-blue-700 h-full flex flex-col bg-[#2d3748] border-gray-700">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-blue-300">{station.name}</CardTitle>
        </div>
        <CardDescription className="flex items-center text-gray-300">
          <Shield className="h-4 w-4 mr-1 inline text-blue-400" />
          {station.jurisdiction}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-col space-y-2 text-gray-200">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-400" />
            <span>{station.address}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-blue-400" />
            <span>{station.phone}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-blue-400" />
            <a href={`mailto:${station.email}`} className="text-blue-400 hover:underline">
              {station.email}
            </a>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t border-gray-700">
        <Button variant="police" className="w-full">
          View Officers
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PoliceStationCard;
