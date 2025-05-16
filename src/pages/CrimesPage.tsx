import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import CrimeCard from '@/components/CrimeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { CrimeRecord, CrimeCategory, CrimeTool } from '@/models/types';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const CrimesPage = () => {
  const navigate = useNavigate();
  const { crimes, loading, error, deleteCrimeRecord } = useData();
  const { user } = useAuth();

  // Filter states
  const [selectedLocation, setSelectedLocation] = React.useState('');
  const [selectedTool, setSelectedTool] = React.useState('all');
  const [selectedType, setSelectedType] = React.useState('all');
  const [selectedTime, setSelectedTime] = React.useState('all');
  const [open, setOpen] = React.useState(false);

  // Get values for filters from type definitions
  const tools: CrimeTool[] = ['weapon', 'vehicle', 'tool', 'chemical', 'electronic', 'other'];
  const types: CrimeCategory[] = ['theft', 'assault', 'burglary', 'vandalism', 'fraud', 'other'];

  // Get unique locations from crimes
  const locations = [...new Set(crimes.map(crime => crime.location.address))];

  const handleDelete = async (id: string) => {
    try {
      await deleteCrimeRecord(id);
      toast.success('Crime record deleted successfully');
    } catch (error) {
      console.error('Error deleting crime:', error);
      toast.error('Failed to delete crime record');
    }
  };

  // Filter crimes based on search criteria
  const filteredCrimes = crimes.filter(crime => {
    const matchesLocation = !selectedLocation || crime.location.address.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesTool = selectedTool === 'all' || crime.toolUsed === selectedTool;
    const matchesType = selectedType === 'all' || crime.type === selectedType;
    const matchesTime = selectedTime === 'all' || (() => {
      const crimeDate = new Date(crime.timeOfOccurrence);
      const now = new Date();
      switch (selectedTime) {
        case 'today':
          return crimeDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return crimeDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return crimeDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesLocation && matchesTool && matchesType && matchesTime;
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-police-dark">Crime Records</h1>
        <Button
          onClick={() => navigate('/crimes/add')}
          className="bg-police-dark text-white hover:bg-police"
        >
          <Plus className="h-4 w-4 mr-2" />
          Report New Crime
        </Button>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedLocation || "Search location..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput 
                  placeholder="Search location..." 
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                />
                <CommandEmpty>No location found.</CommandEmpty>
                <CommandGroup>
                  {locations
                    .filter(location => 
                      location.toLowerCase().includes(selectedLocation.toLowerCase())
                    )
                    .map((location) => (
                      <CommandItem
                        key={location}
                        value={location}
                        onSelect={() => {
                          setSelectedLocation(location);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedLocation === location ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {location}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger>
              <SelectValue placeholder="Tool Used" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tools</SelectItem>
              {tools.map(tool => (
                <SelectItem key={tool} value={tool}>
                  {tool.charAt(0).toUpperCase() + tool.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="Crime Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {types.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger>
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrimes.map((crime) => (
          <CrimeCard
            key={crime._id || crime.id}
            crime={crime}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CrimesPage;
