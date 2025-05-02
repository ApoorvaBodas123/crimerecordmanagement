
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
import { CrimeCategory, CrimeRecord } from '@/models/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileText, Plus, Search, Filter, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  location: z.string().min(3, { message: "Location is required" }),
  category: z.enum(['Theft', 'Assault', 'Fraud', 'Vandalism', 'Burglary', 'Other'] as const),
  dateOccurred: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Please enter a valid date"
  }),
});

type FormValues = z.infer<typeof formSchema>;

const CrimesPage = () => {
  const { user } = useAuth();
  const { crimeRecords, addCrimeRecord, deleteCrimeRecord } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const isPoliceOrAdmin = user && (user.role === 'police' || user.role === 'admin');

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      category: 'Theft',
      dateOccurred: format(new Date(), 'yyyy-MM-dd'),
    },
  });

  const { isSubmitting } = form.formState;

  const handleAddNewCrime = async (values: FormValues) => {
    if (!user) return;
    
    const newCrime: Omit<CrimeRecord, 'id'> = {
      title: values.title,
      description: values.description,
      location: values.location,
      dateReported: format(new Date(), 'yyyy-MM-dd'),
      dateOccurred: values.dateOccurred,
      category: values.category as CrimeCategory,
      status: 'Open',
      reportedBy: user.name,
    };
    
    addCrimeRecord(newCrime);
    setDialogOpen(false);
    form.reset();
  };

  const handleDeleteCrime = (id: string) => {
    deleteCrimeRecord(id);
  };

  // Filter crimes based on search term and category
  const filteredCrimes = crimeRecords.filter(crime => {
    const matchesSearch = searchTerm === '' || 
      crime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crime.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === null || crime.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-police-dark mb-2">Crime Records</h1>
            <p className="text-gray-600">
              {isPoliceOrAdmin 
                ? "Manage and view crime records in your jurisdiction." 
                : "Stay informed about crime activity in your area."}
            </p>
          </div>
          
          {isPoliceOrAdmin && (
            <Button 
              className="mt-4 md:mt-0 flex items-center"
              onClick={() => setDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Record
            </Button>
          )}
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by title, description or location..."
              className="pl-10"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <Select onValueChange={(value) => setCategoryFilter(value === 'all' ? null : value)} defaultValue="all">
              <SelectTrigger className="w-full">
                <div className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Theft">Theft</SelectItem>
                <SelectItem value="Assault">Assault</SelectItem>
                <SelectItem value="Fraud">Fraud</SelectItem>
                <SelectItem value="Vandalism">Vandalism</SelectItem>
                <SelectItem value="Burglary">Burglary</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Crime Records Grid */}
        {filteredCrimes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrimes.map((crime) => (
              <CrimeCard 
                key={crime.id} 
                crime={crime} 
                onDelete={isPoliceOrAdmin ? handleDeleteCrime : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Crime Records Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm || categoryFilter 
                ? "No records match your search criteria. Try adjusting your filters." 
                : "There are no crime records to display at the moment."}
            </p>
          </div>
        )}
      </div>
      
      {/* Add New Crime Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Crime Record</DialogTitle>
            <DialogDescription>
              Enter the details of the crime to add it to the system.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddNewCrime)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the crime" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Theft">Theft</SelectItem>
                          <SelectItem value="Assault">Assault</SelectItem>
                          <SelectItem value="Fraud">Fraud</SelectItem>
                          <SelectItem value="Vandalism">Vandalism</SelectItem>
                          <SelectItem value="Burglary">Burglary</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOccurred"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Occurred</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Where did this occur?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of what happened..." 
                        {...field}
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Add Record"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default CrimesPage;
