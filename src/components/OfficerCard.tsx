import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PoliceOfficer } from '@/models/types';
import { Phone, Mail, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface OfficerCardProps {
  officer: PoliceOfficer;
}

const OfficerCard: React.FC<OfficerCardProps> = ({ officer }) => {
  // Get initials for the avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-police h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-police">
            <AvatarFallback className="bg-police-light text-white">
              {getInitials(officer.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-bold text-police-dark">{officer.name}</CardTitle>
            <CardDescription className="flex items-center text-white-600">
              <Shield className="h-4 w-4 mr-1 inline" />
              {officer.rank || 'Police Officer'} • Badge #{officer.badgeNumber}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <div className="flex flex-col space-y-2 text-sm text-white-700 mb-4">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-police" />
            <span>{officer.contact}</span>
          </div>
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-police" />
            <a href={`mailto:${officer.email}`} className="text-blue-600 hover:underline">
              {officer.email}
            </a>
          </div>
        </div>
        
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Department:</p>
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs">
              {officer.department}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfficerCard;
