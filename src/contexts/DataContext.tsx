import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { CrimeRecord, PoliceStation, PoliceOfficer, SafetyTip, EmergencyAlert } from '../models/types';
import { policeStations, policeOfficers, safetyTips, emergencyAlerts } from '../services/mockData';
import axios from 'axios';
import { useAuth } from './AuthContext';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include auth token in requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

interface DataContextType {
  crimeRecords: CrimeRecord[];
  policeStations: PoliceStation[];
  policeOfficers: PoliceOfficer[];
  safetyTips: SafetyTip[];
  emergencyAlerts: EmergencyAlert[];
  addCrimeRecord: (record: Omit<CrimeRecord, 'id'>) => Promise<void>;
  updateCrimeRecord: (record: CrimeRecord) => Promise<void>;
  deleteCrimeRecord: (id: string) => Promise<void>;
  addEmergencyAlert: (alert: Omit<EmergencyAlert, 'id'>) => void;
  deleteEmergencyAlert: (id: string) => void;
  isLoading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [crimeRecords, setCrimeRecords] = useState<CrimeRecord[]>([]);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(emergencyAlerts);
  const [officers, setOfficers] = useState<PoliceOfficer[]>(policeOfficers);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

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
      const response = await api.get('/crimes');
      const records = Array.isArray(response.data) ? response.data : [];
      setCrimeRecords(records);
    } catch (error) {
      console.error('Error fetching crime records:', error);
      toast.error('Failed to fetch crime records');
      setCrimeRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addCrimeRecord = async (record: Omit<CrimeRecord, 'id'>) => {
    try {
      console.log('Starting addCrimeRecord function');
      console.log('Record to be added:', record);
      
      // Validate the record before sending
      if (!record.title || !record.description || !record.type || !record.location || 
          !record.severity || !record.victim || !record.toolUsed || !record.timeOfOccurrence) {
        console.error('Missing required fields:', {
          title: !record.title,
          description: !record.description,
          type: !record.type,
          location: !record.location,
          severity: !record.severity,
          victim: !record.victim,
          toolUsed: !record.toolUsed,
          timeOfOccurrence: !record.timeOfOccurrence
        });
        throw new Error('Missing required fields');
      }

      console.log('Sending POST request to /crimes');
      const response = await api.post('/crimes', record);
      console.log('API response:', response.data);
      
      if (!response.data) {
        console.error('No data received from server');
        throw new Error('No data received from server');
      }

      console.log('Updating local state with new record');
      setCrimeRecords([response.data, ...crimeRecords]);
      toast.success('Crime record added successfully');
    } catch (error: any) {
      console.error('Error in addCrimeRecord:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      const message = error.response?.data?.message || error.message || 'Failed to add crime record';
      toast.error(message);
      throw error;
    }
  };

  const updateCrimeRecord = async (record: CrimeRecord) => {
    try {
      const response = await api.put(`/crimes/${record.id}`, record);
      setCrimeRecords(crimeRecords.map(r => r.id === record.id ? response.data : r));
      toast.success('Crime record updated successfully');
    } catch (error) {
      console.error('Error updating crime record:', error);
      toast.error('Failed to update crime record');
    }
  };

  const deleteCrimeRecord = async (id: string) => {
    try {
      await api.delete(`/crimes/${id}`);
      setCrimeRecords(crimeRecords.filter(r => r.id !== id));
      toast.success('Crime record deleted successfully');
    } catch (error) {
      console.error('Error deleting crime record:', error);
      toast.error('Failed to delete crime record');
    }
  };

  const addEmergencyAlert = (alert: Omit<EmergencyAlert, 'id'>) => {
    const newAlert = {
      ...alert,
      id: `${Date.now()}`
    };
    
    setAlerts([newAlert, ...alerts]);
    toast.success('Emergency alert added successfully');
  };

  const deleteEmergencyAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    toast.success('Emergency alert deleted successfully');
  };

  return (
    <DataContext.Provider 
      value={{ 
        crimeRecords, 
        policeStations, 
        policeOfficers: officers, 
        safetyTips, 
        emergencyAlerts: alerts,
        addCrimeRecord,
        updateCrimeRecord,
        deleteCrimeRecord,
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
