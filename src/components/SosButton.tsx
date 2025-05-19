import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useData } from '@/contexts/DataContext';

const SosButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmergencySent, setIsEmergencySent] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [manualLocation, setManualLocation] = useState('');
  const [locationError, setLocationError] = useState<string | null>(null);
  const { addEmergencyAlert } = useData();

  const handleSosClick = () => {
    setIsDialogOpen(true);
    setLocationError(null);
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationError(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          let errorMessage = "Unable to determine your location. ";
          
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Please enable location access in your browser settings.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
            default:
              errorMessage += "Please provide your location manually.";
          }
          
          setLocationError(errorMessage);
          toast.error(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      const errorMessage = "Geolocation is not supported by your browser. Please provide your location manually.";
      setLocationError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const confirmEmergency = () => {
    if (!location && !manualLocation) {
      toast.error("Please provide your location before sending the emergency alert.");
      return;
    }

    // Create emergency alert
    const alertLocation = location 
      ? `Latitude: ${location.lat.toFixed(6)}, Longitude: ${location.lng.toFixed(6)}`
      : manualLocation;

    addEmergencyAlert({
      title: 'Emergency SOS Alert',
      message: `Emergency alert from location: ${alertLocation}`,
      severity: 'Critical',
      affectedAreas: ['Immediate Area'],
      datePosted: new Date().toISOString()
    });

    // Simulate sending emergency alert
    setTimeout(() => {
      setIsEmergencySent(true);
      toast.success("Emergency alert sent to nearby police stations!");
      
      // Reset after 10 seconds
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsEmergencySent(false);
        setLocation(null);
        setManualLocation('');
        setLocationError(null);
      }, 10000);
    }, 1500);
  };

  return (
    <>
      <Button 
        onClick={handleSosClick}
        className="bg-alert hover:bg-alert-dark text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center justify-center space-x-2 animate-pulse"
        size="lg"
      >
        <AlertCircle className="h-5 w-5" />
        <span>EMERGENCY SOS</span>
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-alert">Emergency SOS Alert</DialogTitle>
            <DialogDescription asChild>
              {!isEmergencySent ? (
                <p>
                  This will send your current location to nearby police stations and dispatch emergency services. Only use in case of a real emergency.
                </p>
              ) : (
                <p className="text-green-600 font-medium">
                  Alert sent! Emergency services have been notified and are on their way.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {!isEmergencySent && (
            <>
              {location ? (
                <div className="py-4">
                  <p className="text-sm text-gray-500 mb-2">Your current location:</p>
                  <div className="bg-gray-100 p-3 rounded-md border border-gray-200">
                    <p className="text-sm font-medium text-gray-700">Latitude: {location.lat.toFixed(6)}</p>
                    <p className="text-sm font-medium text-gray-700">Longitude: {location.lng.toFixed(6)}</p>
                  </div>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-sm text-gray-500 mb-2">Please provide your location:</p>
                  <Input
                    type="text"
                    placeholder="e.g., 123 Main St, City, State"
                    value={manualLocation}
                    onChange={(e) => setManualLocation(e.target.value)}
                    className="w-full bg-white text-gray-900 placeholder:text-gray-500"
                  />
                  {locationError && (
                    <p className="text-sm text-red-500 mt-2">{locationError}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Please provide your exact address or location to help emergency services reach you quickly.
                  </p>
                </div>
              )}
            </>
          )}
          
          {!isEmergencySent && (
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                setLocation(null);
                setManualLocation('');
                setLocationError(null);
              }}>
                Cancel
              </Button>
              <Button 
                className="bg-alert hover:bg-alert-dark text-white" 
                onClick={confirmEmergency}
              >
                Send Emergency Alert
              </Button>
            </DialogFooter>
          )}
          
          {isEmergencySent && (
            <div className="text-center py-4">
              <div className="animate-pulse inline-block p-4 rounded-full bg-green-100">
                <AlertCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="mt-4 text-sm text-gray-500">Stay in a safe place if possible. Help is on the way.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SosButton;
