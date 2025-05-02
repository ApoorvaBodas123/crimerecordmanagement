
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { toast } from 'sonner';
import { CrimeRecord, PoliceStation, PoliceOfficer, SafetyTip, EmergencyAlert } from '../models/types';
import { crimeRecords as initialCrimeRecords, policeStations, policeOfficers, safetyTips, emergencyAlerts } from '../services/mockData';

interface DataContextType {
  crimeRecords: CrimeRecord[];
  policeStations: PoliceStation[];
  policeOfficers: PoliceOfficer[];
  safetyTips: SafetyTip[];
  emergencyAlerts: EmergencyAlert[];
  addCrimeRecord: (record: Omit<CrimeRecord, 'id'>) => void;
  updateCrimeRecord: (record: CrimeRecord) => void;
  deleteCrimeRecord: (id: string) => void;
  addEmergencyAlert: (alert: Omit<EmergencyAlert, 'id'>) => void;
  deleteEmergencyAlert: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [crimeRecords, setCrimeRecords] = useState<CrimeRecord[]>(initialCrimeRecords);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(emergencyAlerts);

  const addCrimeRecord = (record: Omit<CrimeRecord, 'id'>) => {
    const newRecord = {
      ...record,
      id: `${Date.now()}`
    };
    
    setCrimeRecords([newRecord, ...crimeRecords]);
    toast.success('Crime record added successfully');
  };

  const updateCrimeRecord = (record: CrimeRecord) => {
    setCrimeRecords(crimeRecords.map(r => r.id === record.id ? record : r));
    toast.success('Crime record updated successfully');
  };

  const deleteCrimeRecord = (id: string) => {
    setCrimeRecords(crimeRecords.filter(r => r.id !== id));
    toast.success('Crime record deleted successfully');
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
        policeOfficers, 
        safetyTips, 
        emergencyAlerts: alerts,
        addCrimeRecord,
        updateCrimeRecord,
        deleteCrimeRecord,
        addEmergencyAlert,
        deleteEmergencyAlert
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
