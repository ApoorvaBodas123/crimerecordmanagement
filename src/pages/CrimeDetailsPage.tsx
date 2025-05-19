import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CrimeRecord, Location } from '@/models/types';
import { 
  MapPin, 
  Calendar, 
  User, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CrimeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crimes, deleteCrimeRecord, updateCrimeStatus } = useData();
  const { user } = useAuth();

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Invalid Crime ID</h1>
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

  const crime = crimes.find(c => (c._id === id || c.id === id));
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
      ${typeof crime.victim === 'string' 
        ? `Details: ${crime.victim}`
        : `Name: ${crime.victim.name}
           Contact: ${crime.victim.contact}
           Description: ${crime.victim.description || 'N/A'}`
      }
      
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
    if (!crime || !crime.id) return;
    try {
      await deleteCrimeRecord(crime.id);
      toast.success('Crime record deleted successfully');
      navigate('/crimes');
    } catch (error) {
      console.error('Error deleting crime:', error);
      toast.error('Failed to delete crime record');
    }
  };

  const handleStatusChange = async (newStatus: 'reported' | 'under_investigation' | 'resolved' | 'closed') => {
    if (!crime || !crime.id) return;
    await updateCrimeStatus(crime.id, newStatus);
  };

  if (!crime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Crime Record Not Found</h1>
          <Button onClick={() => navigate('/crimes')}>Back to Crimes List</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-police-dark">{crime.title}</h1>
          <div className="flex gap-4">
            <Select
              value={crime.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reported">Reported</SelectItem>
                <SelectItem value="under_investigation">Under Investigation</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => navigate('/crimes')}>Back to List</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-500">Description</h3>
                  <p className="mt-1">{crime.description}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Type</h3>
                  <p className="mt-1">{crime.type}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Severity</h3>
                  <p className="mt-1">{crime.severity}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-500">Status</h3>
                  <p className="mt-1">{crime.status}</p>
                </div>
                {crime.victim && (
                  <div>
                    <h3 className="font-medium text-gray-500">Victim Information</h3>
                    <p className="mt-1">
                      {typeof crime.victim === 'string' 
                        ? crime.victim 
                        : `${crime.victim.name} - ${crime.victim.contact}`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location & Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-police mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-500">Location</h3>
                    <p className="mt-1">{getLocationDisplay(crime.location)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-police mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-500">Time of Occurrence</h3>
                    <p className="mt-1">{new Date(crime.timeOfOccurrence).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="h-5 w-5 text-police mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-500">Reported By</h3>
                    <p className="mt-1">
                      {typeof crime.reportedBy === 'string' 
                        ? crime.reportedBy 
                        : crime.reportedBy?.name || 'Anonymous'}
                    </p>
                  </div>
                </div>
                {crime.assignedTo && (
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-police mr-2 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-gray-500">Assigned To</h3>
                      <p className="mt-1">
                        {typeof crime.assignedTo === 'string' 
                          ? crime.assignedTo 
                          : crime.assignedTo?.name || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CrimeDetailsPage; 