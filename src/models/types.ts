export type CrimeCategory = 'theft' | 'assault' | 'burglary' | 'vandalism' | 'fraud' | 'other';
export type CrimeStatus = 'reported' | 'under_investigation' | 'resolved' | 'closed';
export type CrimeSeverity = 'low' | 'medium' | 'high' | 'critical';
export type CrimeTool = 'weapon' | 'vehicle' | 'tool' | 'chemical' | 'electronic' | 'other';

export interface Location {
  type: 'Point';
  coordinates: [number, number];
  address: string;
}

export interface CrimeRecord {
  _id?: string;
  id: string;
  title: string;
  description: string;
  type: CrimeCategory;
  location: Location;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'investigating' | 'closed';
  createdAt: string;
  timeOfOccurrence: string;
  victim: {
    name: string;
    contact: string;
    description: string;
  };
  toolUsed: CrimeTool;
  additionalNotes?: string;
  reporterName: string;
  assignedTo?: string;
  reportedBy?: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  jurisdiction: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PoliceOfficer {
  id: string;
  name: string;
  badge: string;
  rank: string;
  stationId: string;
  phone: string;
  email: string;
  specialization: string[];
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: string;
  datePosted: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  message: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  datePosted: string;
  affectedAreas: string[];
}

export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'admin' | 'police' | 'citizen';
  badgeNumber?: string;
  department?: string;
}
