import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { CrimeRecord, PoliceStation, PoliceOfficer, SafetyTip, EmergencyAlert } from '../models/types';
import { policeStations, policeOfficers, safetyTips, emergencyAlerts } from '../services/mockData';
import api from '@/lib/api';
import { useAuth } from './AuthContext';

interface DataContextType {
  crimes: CrimeRecord[];
  loading: boolean;
  error: string | null;
  addCrimeRecord: (crime: Omit<CrimeRecord, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  deleteCrimeRecord: (id: string) => Promise<void>;
  fetchCrimeRecords: () => Promise<void>;
  updateCrimeStatus: (id: string, status: 'reported' | 'under_investigation' | 'resolved' | 'closed') => Promise<void>;
  policeStations: PoliceStation[];
  policeOfficers: PoliceOfficer[];
  safetyTips: SafetyTip[];
  emergencyAlerts: EmergencyAlert[];
  addEmergencyAlert: (alert: Omit<EmergencyAlert, 'id'>) => void;
  deleteEmergencyAlert: (id: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialSafetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Home Security Basics',
    content: 'Always lock your doors and windows, even when you\'re home. Install a security system and keep it maintained. Consider motion-sensor lights around your property.',
    category: 'Home Safety',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Online Safety',
    content: 'Use strong, unique passwords for all accounts. Enable two-factor authentication. Be cautious of suspicious emails and links. Never share personal information online.',
    category: 'Digital Safety',
    priority: 'high',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Personal Safety',
    content: 'Stay aware of your surroundings. Walk with confidence. Keep your phone charged and accessible. Share your location with trusted contacts when traveling.',
    category: 'Personal Safety',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    title: 'Vehicle Security',
    content: 'Always lock your vehicle. Park in well-lit areas. Don\'t leave valuables visible. Consider installing a car alarm or tracking device.',
    category: 'Vehicle Safety',
    priority: 'medium',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    title: 'Emergency Preparedness',
    content: 'Keep emergency numbers saved in your phone. Have a first-aid kit at home and in your car. Know your local emergency services and evacuation routes.',
    category: 'Emergency',
    priority: 'high',
    createdAt: new Date().toISOString()
  }
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [crimes, setCrimes] = useState<CrimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [officers, setOfficers] = useState<PoliceOfficer[]>(policeOfficers);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [safetyTips] = useState<SafetyTip[]>(initialSafetyTips);

  useEffect(() => {
    if (user) {
      fetchCrimeRecords();
      fetchPoliceOfficers();
    }
  }, [user]);

  const fetchPoliceOfficers = async () => {
    try {
      const response = await api.get('/officers');
      const officers = Array.isArray(response.data) ? response.data : [];
      setOfficers(officers);
    } catch (error) {
      console.error('Error fetching police officers:', error);
      toast.error('Failed to fetch police officers');
      setOfficers(policeOfficers); // Fallback to mock data
    }
  };

  const fetchCrimeRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/crimes');
      console.log('Fetched crime records:', response.data);
      const records = Array.isArray(response.data) ? response.data : [];
      
      // Map _id to id for each record
      const mappedRecords = records.map(record => ({
        ...record,
        id: record._id || record.id
      }));
      
      console.log('Mapped crime records:', mappedRecords);
      setCrimes(mappedRecords);
      setError(null);
    } catch (err) {
      console.error('Error fetching crimes:', err);
      setError('Failed to fetch crime records');
      setCrimes([]);
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  const addCrimeRecord = async (crime: Omit<CrimeRecord, 'id' | 'createdAt' | 'status'>) => {
    try {
      console.log('Starting addCrimeRecord function');
      console.log('Record to be added:', crime);
      
      // Validate the record before sending
      if (!crime.title || !crime.description || !crime.type || !crime.location || 
          !crime.severity || !crime.victim || !crime.toolUsed || !crime.timeOfOccurrence) {
        console.error('Missing required fields:', {
          title: !crime.title,
          description: !crime.description,
          type: !crime.type,
          location: !crime.location,
          severity: !crime.severity,
          victim: !crime.victim,
          toolUsed: !crime.toolUsed,
          timeOfOccurrence: !crime.timeOfOccurrence
        });
        throw new Error('Missing required fields');
      }

      console.log('Sending POST request to /crimes');
      const response = await api.post('/crimes', crime);
      console.log('API response:', response.data);
      
      if (!response.data) {
        console.error('No data received from server');
        throw new Error('No data received from server');
      }

      console.log('Updating local state with new record');
      setCrimes(prev => [response.data, ...prev]);
      toast.success('Crime record added successfully');
    } catch (err) {
      console.error('Error adding crime:', err);
      throw new Error('Failed to add crime record');
    }
  };

  const deleteCrimeRecord = async (id: string) => {
    if (!id) {
      console.error('Cannot delete crime record: ID is undefined');
      toast.error('Cannot delete crime record: Invalid ID');
      return;
    }
    try {
      await api.delete(`/crimes/${id}`);
      setCrimes(prev => prev.filter(crime => (crime._id || crime.id) !== id));
      toast.success('Crime record deleted successfully');
    } catch (err) {
      console.error('Error deleting crime:', err);
      throw new Error('Failed to delete crime record');
    }
  };

  const updateCrimeStatus = async (id: string, status: 'reported' | 'under_investigation' | 'resolved' | 'closed') => {
    try {
      await api.put(`/crimes/${id}`, { status });
      setCrimes(prev => prev.map(crime => 
        (crime._id || crime.id) === id ? { ...crime, status } : crime
      ));
      toast.success(`Case status updated to ${status}`);
    } catch (err) {
      console.error('Error updating crime status:', err);
      toast.error('Failed to update case status');
    }
  };

  const addEmergencyAlert = (alert: Omit<EmergencyAlert, 'id'>) => {
    const newAlert = {
      ...alert,
      id: `${Date.now()}`,
      datePosted: new Date().toISOString()
    };
    
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
    toast.success('Emergency alert added successfully');
  };

  const deleteEmergencyAlert = (id: string) => {
    setAlerts(prevAlerts => prevAlerts.filter(a => a.id !== id));
    toast.success('Emergency alert deleted successfully');
  };

  return (
    <DataContext.Provider 
      value={{ 
        crimes, 
        loading, 
        error,
        addCrimeRecord,
        deleteCrimeRecord,
        fetchCrimeRecords,
        updateCrimeStatus,
        policeStations, 
        policeOfficers: officers, 
        safetyTips, 
        emergencyAlerts: alerts,
        addEmergencyAlert,
        deleteEmergencyAlert,
        isLoading
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
