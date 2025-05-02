
import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import PoliceStationCard from '@/components/PoliceStationCard';
import OfficerCard from '@/components/OfficerCard';
import { useData } from '@/contexts/DataContext';
import { Search, MapPin, Users } from 'lucide-react';

const DirectoryPage = () => {
  const { policeStations, policeOfficers } = useData();
  const [stationSearchTerm, setStationSearchTerm] = useState('');
  const [officerSearchTerm, setOfficerSearchTerm] = useState('');
  
  // Filter stations based on search term
  const filteredStations = policeStations.filter(station => 
    stationSearchTerm === '' || 
    station.name.toLowerCase().includes(stationSearchTerm.toLowerCase()) ||
    station.address.toLowerCase().includes(stationSearchTerm.toLowerCase()) ||
    station.jurisdiction.toLowerCase().includes(stationSearchTerm.toLowerCase())
  );
  
  // Filter officers based on search term
  const filteredOfficers = policeOfficers.filter(officer => 
    officerSearchTerm === '' || 
    officer.name.toLowerCase().includes(officerSearchTerm.toLowerCase()) ||
    officer.rank.toLowerCase().includes(officerSearchTerm.toLowerCase()) ||
    officer.specialization.some(spec => 
      spec.toLowerCase().includes(officerSearchTerm.toLowerCase())
    )
  );

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-police-dark mb-2">Police Directory</h1>
        <p className="text-gray-600 mb-8">
          Find information about police stations and officers in your area.
        </p>
        
        <Tabs defaultValue="stations" className="w-full">
          <TabsList className="w-full max-w-md mb-8 grid grid-cols-2">
            <TabsTrigger value="stations" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Police Stations
            </TabsTrigger>
            <TabsTrigger value="officers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Officers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="stations" className="w-full">
            <div className="mb-6 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search stations by name, address, or jurisdiction..."
                className="pl-10"
                value={stationSearchTerm}
                onChange={e => setStationSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredStations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStations.map(station => (
                  <PoliceStationCard key={station.id} station={station} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Police Stations Found</h3>
                <p className="text-gray-500">
                  No police stations match your search criteria. Try adjusting your search.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="officers" className="w-full">
            <div className="mb-6 relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search officers by name, rank, or specialization..."
                className="pl-10"
                value={officerSearchTerm}
                onChange={e => setOfficerSearchTerm(e.target.value)}
              />
            </div>
            
            {filteredOfficers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOfficers.map(officer => (
                  <OfficerCard key={officer.id} officer={officer} />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Officers Found</h3>
                <p className="text-gray-500">
                  No officers match your search criteria. Try adjusting your search.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DirectoryPage;
