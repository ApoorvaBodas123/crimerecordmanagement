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
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-police-dark">Add New Crime Record</DialogTitle>
              <DialogDescription>
                Fill in the details of the crime incident. All fields are required.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleAddNewCrime)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter crime title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide detailed description of the crime" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Location */}
                  <FormField
                    control={form.control}
                    name="location.address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter crime location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Type and Severity */}
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crime Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select crime type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="theft">Theft</SelectItem>
                            <SelectItem value="assault">Assault</SelectItem>
                            <SelectItem value="burglary">Burglary</SelectItem>
                            <SelectItem value="vandalism">Vandalism</SelectItem>
                            <SelectItem value="fraud">Fraud</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Victim Information */}
                  <FormField
                    control={form.control}
                    name="victim.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Victim Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter victim name" {...field} />
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
                        <FormLabel>Victim Contact</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter victim contact" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="victim.description"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Victim Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the victim's condition" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tool Used and Time */}
                  <FormField
                    control={form.control}
                    name="toolUsed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tool Used</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select tool used" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="weapon">Weapon</SelectItem>
                            <SelectItem value="vehicle">Vehicle</SelectItem>
                            <SelectItem value="tool">Tool</SelectItem>
                            <SelectItem value="chemical">Chemical</SelectItem>
                            <SelectItem value="electronic">Electronic</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
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
                        <FormLabel>Time of Occurrence</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
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
