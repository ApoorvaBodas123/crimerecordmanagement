import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CrimeRecord, Location } from '@/models/types';
import { FileDown, Trash2 } from 'lucide-react';

interface CrimeCardProps {
  crime: CrimeRecord;
  onDelete: (id: string) => void;
}

const CrimeCard: React.FC<CrimeCardProps> = ({ crime, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isPoliceOrAdmin = user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin');
  const canDelete = isPoliceOrAdmin || crime.reportedBy === user?.id;

  const getLocationDisplay = (location: Location | string): string => {
    if (typeof location === 'string') {
      return location;
    }
    return location.address;
  };

  const downloadReport = () => {
    // Create a formatted report
    const report = `
      CRIME REPORT
      ============
      
      Case ID: ${crime.id}
      Title: ${crime.title}
      Type: ${crime.type}
      Location: ${getLocationDisplay(crime.location)}
      Severity: ${crime.severity}
      Status: ${crime.status}
      Date Reported: ${new Date(crime.createdAt).toLocaleDateString()}
      Time of Occurrence: ${new Date(crime.timeOfOccurrence).toLocaleString()}
      
      Description:
      ${crime.description}
      
      Victim Information:
      Name: ${crime.victim.name}
      Contact: ${crime.victim.contact}
      Description: ${crime.victim.description}
      
      Tool Used: ${crime.toolUsed}
      Additional Notes: ${crime.additionalNotes || 'N/A'}
      
      Reported by: ${crime.reporterName}
      Assigned to: ${crime.assignedTo || 'Not assigned'}
    `;

    // Create a blob and download link
    const blob = new Blob([report], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crime_report_${crime.id}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (!crime) {
    return null;
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{crime.title}</span>
          <div className="flex space-x-2">
            {isPoliceOrAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={downloadReport}
                className="text-police-dark hover:bg-police-light"
              >
                <FileDown className="h-4 w-4 mr-1" />
                Download Report
              </Button>
            )}
            {canDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(crime.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Type: {crime.type}</p>
            <p className="text-sm text-gray-600">
              Location: {getLocationDisplay(crime.location)}
            </p>
            <p className="text-sm text-gray-600">Severity: {crime.severity}</p>
            <p className="text-sm text-gray-600">Status: {crime.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reported by: {crime.reporterName}</p>
            <p className="text-sm text-gray-600">
              Date: {new Date(crime.createdAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              Time of Occurrence: {new Date(crime.timeOfOccurrence).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Description:</p>
          <p className="text-sm">{crime.description}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t">
        <div className="flex justify-end w-full">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(`/crimes/${crime.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CrimeCard;
