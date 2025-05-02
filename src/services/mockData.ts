
import { CrimeRecord, PoliceStation, PoliceOfficer, SafetyTip, EmergencyAlert } from '../models/types';

// Mock Crime Records
export const crimeRecords: CrimeRecord[] = [
  {
    id: '1',
    title: 'Convenience Store Robbery',
    description: 'Armed individual robbed the Quick Stop convenience store',
    location: '123 Main St, Downtown',
    dateReported: '2025-04-28',
    dateOccurred: '2025-04-27',
    category: 'Theft',
    status: 'Under Investigation',
    reportedBy: 'Store Owner',
    assignedOfficer: '2'
  },
  {
    id: '2',
    title: 'Vehicle Break-in',
    description: 'Car window smashed and valuables stolen from vehicle',
    location: 'City Park Parking Lot',
    dateReported: '2025-04-25',
    dateOccurred: '2025-04-24',
    category: 'Theft',
    status: 'Open',
    reportedBy: 'Vehicle Owner'
  },
  {
    id: '3',
    title: 'Identity Theft Report',
    description: 'Victim reported unauthorized use of their credit card information',
    location: 'Online',
    dateReported: '2025-04-22',
    dateOccurred: '2025-04-20',
    category: 'Fraud',
    status: 'Open',
    reportedBy: 'Victim',
    assignedOfficer: '3'
  },
  {
    id: '4',
    title: 'Park Vandalism',
    description: 'Graffiti found on playground equipment',
    location: 'Riverside Park',
    dateReported: '2025-04-21',
    dateOccurred: '2025-04-20',
    category: 'Vandalism',
    status: 'Closed',
    reportedBy: 'Park Visitor',
    assignedOfficer: '1'
  },
  {
    id: '5',
    title: 'Residential Burglary',
    description: 'Home broken into while residents were away, electronics stolen',
    location: '456 Oak Avenue, Westside',
    dateReported: '2025-04-18',
    dateOccurred: '2025-04-18',
    category: 'Burglary',
    status: 'Under Investigation',
    reportedBy: 'Homeowner',
    assignedOfficer: '4'
  }
];

// Mock Police Stations
export const policeStations: PoliceStation[] = [
  {
    id: '1',
    name: 'Central Police Station',
    address: '100 Police Plaza, Downtown',
    phone: '(555) 123-4567',
    email: 'central@policedept.gov',
    jurisdiction: 'Downtown, Business District',
    coordinates: { lat: 34.0522, lng: -118.2437 }
  },
  {
    id: '2',
    name: 'Westside Police Station',
    address: '200 Westwood Blvd, Westside',
    phone: '(555) 234-5678',
    email: 'westside@policedept.gov',
    jurisdiction: 'Westside, Residential Areas',
    coordinates: { lat: 34.0633, lng: -118.4478 }
  },
  {
    id: '3',
    name: 'Eastside Police Station',
    address: '300 East Main St, Eastside',
    phone: '(555) 345-6789',
    email: 'eastside@policedept.gov',
    jurisdiction: 'Eastside, Industrial Zone',
    coordinates: { lat: 34.0453, lng: -118.1872 }
  }
];

// Mock Police Officers
export const policeOfficers: PoliceOfficer[] = [
  {
    id: '1',
    name: 'Officer John Smith',
    badge: 'B12345',
    rank: 'Sergeant',
    stationId: '1',
    phone: '(555) 111-2222',
    email: 'jsmith@policedept.gov',
    specialization: ['Homicide', 'Violent Crimes']
  },
  {
    id: '2',
    name: 'Officer Jane Doe',
    badge: 'B23456',
    rank: 'Detective',
    stationId: '1',
    phone: '(555) 222-3333',
    email: 'jdoe@policedept.gov',
    specialization: ['Fraud', 'White Collar Crimes']
  },
  {
    id: '3',
    name: 'Officer Robert Chen',
    badge: 'B34567',
    rank: 'Patrol Officer',
    stationId: '2',
    phone: '(555) 333-4444',
    email: 'rchen@policedept.gov',
    specialization: ['Traffic', 'DUI Enforcement']
  },
  {
    id: '4',
    name: 'Officer Maria Rodriguez',
    badge: 'B45678',
    rank: 'Detective',
    stationId: '3',
    phone: '(555) 444-5555',
    email: 'mrodriguez@policedept.gov',
    specialization: ['Narcotics', 'Gang Activity']
  }
];

// Mock Safety Tips
export const safetyTips: SafetyTip[] = [
  {
    id: '1',
    title: 'Home Security Tips',
    content: 'Always lock doors and windows when leaving your home. Install motion-sensor lights around entry points.',
    category: 'Home Safety',
    datePosted: '2025-04-25'
  },
  {
    id: '2',
    title: 'Online Shopping Safety',
    content: 'Only make purchases on secure websites. Look for "https" in the URL and a padlock icon in your browser.',
    category: 'Cybersecurity',
    datePosted: '2025-04-20'
  },
  {
    id: '3',
    title: 'Public Transportation Awareness',
    content: 'Stay alert and aware of your surroundings when using public transportation. Keep valuables secure and out of sight.',
    category: 'Personal Safety',
    datePosted: '2025-04-15'
  }
];

// Mock Emergency Alerts
export const emergencyAlerts: EmergencyAlert[] = [
  {
    id: '1',
    title: 'Missing Child Alert',
    message: '10-year-old Jane Smith was last seen at Central Park at 3:00 PM today. She was wearing a blue jacket and jeans.',
    severity: 'Critical',
    datePosted: '2025-04-29',
    affectedAreas: ['Downtown', 'Central Park Area']
  },
  {
    id: '2',
    title: 'Road Closure Due to Police Activity',
    message: 'Main Street between 5th and 7th Avenue is closed due to ongoing police investigation. Please use alternate routes.',
    severity: 'Medium',
    datePosted: '2025-04-28',
    affectedAreas: ['Downtown', 'Business District']
  }
];
