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
  id?: string;
  _id?: string;
  title: string;
  description: string;
  type: CrimeCategory;
  location: Location | string;
  severity: string;
  status: 'reported' | 'under_investigation' | 'resolved' | 'closed';
  createdAt: string;
  timeOfOccurrence: string;
  victim: {
    name: string;
    contact: string;
    description?: string;
  } | string;
  toolUsed: string;
  additionalNotes?: string;
  reporterName?: string;
  reportedBy: string | PoliceOfficer;
  assignedTo?: string | PoliceOfficer;
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
  _id: string;
  name: string;
  badgeNumber: string;
  department: string;
  rank?: string;
  contact?: string;
  email?: string;
}

export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
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
  _id: string;
  name: string;
  email: string;
  role: 'police' | 'admin';
  badgeNumber: string;
  department: string;
  phoneNumber: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}
