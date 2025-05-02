
import React, { useState, useEffect } from 'react';
import { EmergencyAlert } from '@/models/types';
import { AlertTriangle, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertBannerProps {
  alerts: EmergencyAlert[];
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts }) => {
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // Automatically cycle through alerts
  useEffect(() => {
    if (!alerts || alerts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
    }, 8000); // Change alert every 8 seconds
    
    return () => clearInterval(interval);
  }, [alerts]);

  if (!isVisible || !alerts || alerts.length === 0) return null;

  const currentAlert = alerts[currentAlertIndex];
  
  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'animate-pulse bg-red-600';
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-amber-500';
      default:
        return 'bg-yellow-400';
    }
  };

  return (
    <div className={`w-full py-2 ${getSeverityClass(currentAlert.severity)} text-white`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/20 h-7 w-7"
          onClick={() => setCurrentAlertIndex((prev) => (prev - 1 + alerts.length) % alerts.length)}
          disabled={alerts.length <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="flex-1 mx-2 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm">{currentAlert.title}</div>
            <p className="text-xs line-clamp-1">{currentAlert.message}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 h-7 w-7"
            onClick={() => setCurrentAlertIndex((prev) => (prev + 1) % alerts.length)}
            disabled={alerts.length <= 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:bg-white/20 h-7 w-7"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
