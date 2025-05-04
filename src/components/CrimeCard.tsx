import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CrimeRecord, CrimeStatus, CrimeCategory } from '@/models/types';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, AlertCircle, Trash2 } from 'lucide-react';

interface CrimeCardProps {
  crime: CrimeRecord;
  onDelete?: (id: string) => void;
}

const getStatusColor = (status: CrimeStatus) => {
  switch (status) {
    case 'reported':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'under_investigation':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getCategoryColor = (type: CrimeCategory) => {
  switch (type) {
    case 'theft':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'assault':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'fraud':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'vandalism':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'burglary':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'other':
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const CrimeCard: React.FC<CrimeCardProps> = ({ crime, onDelete }) => {
  const { user } = useAuth();
  const isPoliceOrAdmin = user && (user.role === 'police' || user.role === 'admin');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-police h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-police-dark">{crime.title}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getCategoryColor(crime.type)}>{crime.type}</Badge>
            <Badge className={getStatusColor(crime.status)}>{crime.status}</Badge>
          </div>
        </div>
        <CardDescription className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1 inline" />
          {crime.location.address}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-700 mb-4">{crime.description}</p>
        <div className="flex flex-col space-y-1 text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Reported: {formatDate(crime.createdAt)}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Occurred: {formatDate(crime.timeOfOccurrence)}</span>
          </div>
          {crime.assignedTo && (
            <div className="flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              <span>Officer Assigned</span>
            </div>
          )}
        </div>
      </CardContent>
      {isPoliceOrAdmin && onDelete && (
        <CardFooter className="pt-0 border-t">
          <div className="flex justify-end w-full">
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onDelete(crime.id)}
              className="flex items-center"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CrimeCard;
