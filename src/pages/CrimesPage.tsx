import React, { useState } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CrimeCard from '@/components/CrimeCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { CrimeCategory, CrimeRecord, Location, CrimeStatus } from '@/models/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  location: z.object({
    address: z.string().min(3, { message: "Address is required" }),
  }),
  type: z.enum(['theft', 'assault', 'burglary', 'vandalism', 'fraud', 'other'] as const),
  severity: z.enum(['low', 'medium', 'high', 'critical'] as const),
  victim: z.object({
    name: z.string().min(2, { message: "Victim name is required" }),
    contact: z.string().min(5, { message: "Victim contact is required" }),
    description: z.string().min(10, { message: "Victim description is required" }),
  }).required(),
  toolUsed: z.enum(['weapon', 'vehicle', 'tool', 'chemical', 'electronic', 'other'] as const),
  timeOfOccurrence: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date and time"
  }),
});

type FormValues = z.infer<typeof formSchema>;
const CrimesPage = () => {
  const { user } = useAuth();
  const { crimeRecords = [], addCrimeRecord, deleteCrimeRecord, isLoading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [toolFilter, setToolFilter] = useState<string | null>(null);
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Debug logs
  console.log('Current user:', user);
  console.log('User role:', user?.role);
  console.log('Is police or admin:', user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin'));
  console.log('Dialog state:', dialogOpen);
  
  const isPoliceOrAdmin = user && (user.role.toLowerCase() === 'police' || user.role.toLowerCase() === 'admin');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: {
        address: '',
      },
      type: 'theft',
      severity: 'medium',
      victim: {
        name: '',
        contact: '',
        description: '',
      },
      toolUsed: 'other',
      timeOfOccurrence: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const { isSubmitting } = form.formState;

  const handleAddNewCrime = async (values: FormValues) => {
    console.log('Form submission started');
    console.log('Form values:', values);
    
    if (!user) {
      console.error('No user found');
      toast.error('You must be logged in to add a crime record');
      return;
    }
    
    // Create location object with proper structure
    const location: Location = {
      type: 'Point',
      coordinates: [77.5946, 12.9716], // Default coordinates for Bangalore
      address: values.location.address
    };
    
    const newCrime: Omit<CrimeRecord, 'id'> = {
      title: values.title,
      description: values.description,
      type: values.type,
      location,
      status: 'reported' as CrimeStatus,
      severity: values.severity,
      victim: {
        name: values.victim.name,
        contact: values.victim.contact,
        description: values.victim.description,
      },
      toolUsed: values.toolUsed,
      timeOfOccurrence: new Date(values.timeOfOccurrence).toISOString(),
      reportedBy: user.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('New crime object:', newCrime);
    
    try {
      console.log('Calling addCrimeRecord function...');
      await addCrimeRecord(newCrime);
      console.log('Crime record added successfully');
      setDialogOpen(false);
      form.reset();
      toast.success('Crime record added successfully');
    } catch (error) {
      console.error('Error adding crime:', error);
      toast.error('Failed to add crime record. Please try again.');
    }
  };

  const handleDeleteCrime = async (id: string) => {
    await deleteCrimeRecord(id);
  };

  // Filter crimes based on search term and filters
  const filteredCrimes = (Array.isArray(crimeRecords) ? crimeRecords : []).filter(crime => {
    const matchesSearch = searchTerm === '' || 
      crime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.victim.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === null || crime.type === categoryFilter;
    const matchesTool = toolFilter === null || crime.toolUsed === toolFilter;
    const matchesLocation = locationFilter === '' || 
      crime.location.address.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesDate = dateFilter === null || 
      new Date(crime.timeOfOccurrence).toDateString() === new Date(dateFilter).toDateString();
    
    return matchesSearch && matchesCategory && matchesTool && matchesLocation && matchesDate;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 min-h-screen">
        {/* Fixed Add Record Button */}
        {isPoliceOrAdmin && (
          <div className="fixed bottom-8 right-8 z-50">
            <Button 
              className="flex items-center bg-police hover:bg-police-dark text-white rounded-full p-6 shadow-lg"
              onClick={() => {
                console.log('Add Record button clicked');
                setDialogOpen(true);
              }}
            >
              <Plus className="h-6 w-6 mr-2" />
              <span className="text-lg">Add Record</span>
            </Button>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-police-dark mb-2">Crime Records</h1>
          <p className="text-gray-600">
            {isPoliceOrAdmin 
              ? "Manage and view crime records in your jurisdiction." 
              : "Stay informed about crime activity in your area."}
          </p>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by title, description, location or victim name..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select onValueChange={(value) => setCategoryFilter(value === 'all' ? null : value)} defaultValue="all">
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="vandalism">Vandalism</SelectItem>
                <SelectItem value="burglary">Burglary</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Select onValueChange={(value) => setToolFilter(value === 'all' ? null : value)} defaultValue="all">
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by tool" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                <SelectItem value="weapon">Weapon</SelectItem>
                <SelectItem value="vehicle">Vehicle</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
                <SelectItem value="chemical">Chemical</SelectItem>
                <SelectItem value="electronic">Electronic</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Input
              type="text"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48">
            <Input
              type="date"
              value={dateFilter || ''}
              onChange={e => setDateFilter(e.target.value || null)}
            />
          </div>
        </div>
        
        {/* Crime Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrimes.map((crime) => (
            <CrimeCard 
              key={crime.id} 
              crime={crime} 
              onDelete={isPoliceOrAdmin ? handleDeleteCrime : undefined}
            />
          ))}
        </div>
        
        {/* Add Crime Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[600px] bg-white border-2 border-police shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-police-dark">Add New Crime Record</DialogTitle>
              <DialogDescription className="text-gray-600">
                Fill in the details below to add a new crime record to the system.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddNewCrime)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-police-dark font-semibold">Title</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 focus:border-police focus:ring-police" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-police-dark font-semibold">Crime Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-2 border-police bg-white text-police-dark hover:bg-gray-50">
                              <SelectValue placeholder="Select crime type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-2 border-police">
                            <SelectItem value="theft" className="text-police-dark hover:bg-police hover:text-white">Theft</SelectItem>
                            <SelectItem value="assault" className="text-police-dark hover:bg-police hover:text-white">Assault</SelectItem>
                            <SelectItem value="burglary" className="text-police-dark hover:bg-police hover:text-white">Burglary</SelectItem>
                            <SelectItem value="vandalism" className="text-police-dark hover:bg-police hover:text-white">Vandalism</SelectItem>
                            <SelectItem value="fraud" className="text-police-dark hover:bg-police hover:text-white">Fraud</SelectItem>
                            <SelectItem value="other" className="text-police-dark hover:bg-police hover:text-white">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-police-dark font-semibold">Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="min-h-[100px] border-2 focus:border-police focus:ring-police" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="location.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-police-dark font-semibold">Location Address</FormLabel>
                        <FormControl>
                          <Input {...field} className="border-2 focus:border-police focus:ring-police" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-police-dark font-semibold">Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-2 border-police bg-white text-police-dark hover:bg-gray-50">
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-2 border-police">
                            <SelectItem value="low" className="text-police-dark hover:bg-police hover:text-white">Low</SelectItem>
                            <SelectItem value="medium" className="text-police-dark hover:bg-police hover:text-white">Medium</SelectItem>
                            <SelectItem value="high" className="text-police-dark hover:bg-police hover:text-white">High</SelectItem>
                            <SelectItem value="critical" className="text-police-dark hover:bg-police hover:text-white">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-police-dark mb-4">Victim Information</h3>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="victim.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-police-dark font-semibold">Victim Name</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-2 focus:border-police focus:ring-police" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="victim.contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-police-dark font-semibold">Victim Contact</FormLabel>
                          <FormControl>
                            <Input {...field} className="border-2 focus:border-police focus:ring-police" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="victim.description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-police-dark font-semibold">Victim Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="min-h-[80px] border-2 focus:border-police focus:ring-police" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="toolUsed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-police-dark font-semibold">Tool Used</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-2 border-police bg-white text-police-dark hover:bg-gray-50">
                              <SelectValue placeholder="Select tool used" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white border-2 border-police">
                            <SelectItem value="weapon" className="text-police-dark hover:bg-police hover:text-white">Weapon</SelectItem>
                            <SelectItem value="vehicle" className="text-police-dark hover:bg-police hover:text-white">Vehicle</SelectItem>
                            <SelectItem value="tool" className="text-police-dark hover:bg-police hover:text-white">Tool</SelectItem>
                            <SelectItem value="chemical" className="text-police-dark hover:bg-police hover:text-white">Chemical</SelectItem>
                            <SelectItem value="electronic" className="text-police-dark hover:bg-police hover:text-white">Electronic</SelectItem>
                            <SelectItem value="other" className="text-police-dark hover:bg-police hover:text-white">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeOfOccurrence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-police-dark font-semibold">Time of Occurrence</FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local" 
                            {...field} 
                            className="border-2 focus:border-police focus:ring-police" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    className="flex-1 border-2 border-gray-300 hover:bg-gray-100"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-1 bg-police hover:bg-police-dark text-white font-semibold py-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Crime Record'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default CrimesPage;
