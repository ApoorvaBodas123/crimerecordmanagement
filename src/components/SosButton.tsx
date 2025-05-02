
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

const SosButton = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmergencySent, setIsEmergencySent] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleSosClick = () => {
    setIsDialogOpen(true);
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Unable to determine your location. Please provide it manually if possible.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const confirmEmergency = () => {
    // Simulate sending emergency alert
    setTimeout(() => {
      setIsEmergencySent(true);
      toast.success("Emergency alert sent to nearby police stations!");
      
      // Reset after 10 seconds
      setTimeout(() => {
        setIsDialogOpen(false);
        setIsEmergencySent(false);
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
            <DialogDescription>
              {!isEmergencySent ? (
                "This will send your current location to nearby police stations and dispatch emergency services. Only use in case of a real emergency."
              ) : (
                <div className="text-green-600 font-medium">
                  Alert sent! Emergency services have been notified and are on their way.
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          {location && !isEmergencySent && (
            <div className="py-4">
              <p className="text-sm text-gray-500 mb-2">Your current location:</p>
              <div className="bg-gray-100 p-2 rounded-md">
                <p className="text-xs">Latitude: {location.lat.toFixed(6)}</p>
                <p className="text-xs">Longitude: {location.lng.toFixed(6)}</p>
              </div>
            </div>
          )}
          
          {!isEmergencySent && (
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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
