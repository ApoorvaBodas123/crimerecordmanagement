
export type CrimeCategory = 'Theft' | 'Assault' | 'Fraud' | 'Vandalism' | 'Burglary' | 'Other';

export interface CrimeRecord {
  id: string;
  title: string;
  description: string;
  location: string;
  dateReported: string;
  dateOccurred: string;
  category: CrimeCategory;
  status: 'Open' | 'Under Investigation' | 'Closed' | 'Resolved';
  reportedBy: string;
  assignedOfficer?: string;
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
