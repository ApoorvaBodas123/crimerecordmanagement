import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CrimeRecord, Location } from '@/models/types';

const CrimeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crimes, deleteCrimeRecord } = useData();
  const { user } = useAuth();

  const crime = crimes.find(c => c.id === id);
  const isPoliceOrAdmin = user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin');
  const canDelete = isPoliceOrAdmin || crime?.reportedBy === user?.id;

  const getLocationDisplay = (location: Location | string): string => {
    if (typeof location === 'string') {
      return location;
    }
    return location.address;
  };

  const downloadReport = () => {
    if (!crime) return;

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

  const handleDelete = async () => {
    if (!crime) return;
    try {
      await deleteCrimeRecord(crime.id);
      toast.success('Crime record deleted successfully');
      navigate('/crimes');
    } catch (error) {
      console.error('Error deleting crime:', error);
      toast.error('Failed to delete crime record');
    }
  };

  if (!crime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Crime Record Not Found</h1>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/crimes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Crimes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/crimes')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Crimes
        </Button>
        <div className="flex space-x-2">
          {isPoliceOrAdmin && (
            <Button
              variant="outline"
              onClick={downloadReport}
              className="text-police-dark hover:bg-police-light"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          )}
          {canDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{crime.title}</CardTitle>
          <div className="flex items-center space-x-2 mt-2">
            <span className={`px-2 py-1 text-xs rounded-full ${
              crime.status === 'resolved' ? 'bg-green-100 text-green-800' :
              crime.status === 'under_investigation' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {crime.status.replace('_', ' ')}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              crime.severity === 'critical' ? 'bg-red-100 text-red-800' :
              crime.severity === 'high' ? 'bg-orange-100 text-orange-800' :
              crime.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {crime.severity}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Details</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Type:</span> {crime.type}</p>
                <p><span className="font-medium">Location:</span> {getLocationDisplay(crime.location)}</p>
                <p><span className="font-medium">Time of Occurrence:</span> {new Date(crime.timeOfOccurrence).toLocaleString()}</p>
                <p><span className="font-medium">Reported by:</span> {crime.reporterName}</p>
                <p><span className="font-medium">Date Reported:</span> {new Date(crime.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Tool Used:</span> {crime.toolUsed}</p>
                {crime.assignedTo && (
                  <p><span className="font-medium">Assigned to:</span> {crime.assignedTo}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Victim Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Name:</span> {crime.victim.name}</p>
                <p><span className="font-medium">Contact:</span> {crime.victim.contact}</p>
                <p><span className="font-medium">Description:</span> {crime.victim.description}</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700">{crime.description}</p>
          </div>
          {crime.additionalNotes && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Additional Notes</h3>
              <p className="text-gray-700">{crime.additionalNotes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CrimeDetailsPage; 