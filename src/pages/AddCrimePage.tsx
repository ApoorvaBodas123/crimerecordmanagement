import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Location } from '@/models/types';

const AddCrimePage = () => {
  const navigate = useNavigate();
  const { addCrimeRecord } = useData();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    type: '',
    location: {
      type: 'Point' as const,
      coordinates: [0, 0] as [number, number],
      address: ''
    },
    severity: '',
    victim: {
      name: '',
      contact: '',
      description: ''
    },
    toolUsed: '',
    timeOfOccurrence: new Date().toISOString().slice(0, 16)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user) {
        toast.error('You must be logged in to report a crime');
        return;
      }

      // Validate location address
      if (!formData.location.address) {
        toast.error('Please enter a valid location address');
        return;
      }

      const newCrime = {
        ...formData,
        status: 'reported',
        reportedBy: user.id,
        reporterName: user.name,
        createdAt: new Date().toISOString()
      };

      await addCrimeRecord(newCrime);
      toast.success('Crime reported successfully');
      navigate('/crimes');
    } catch (error) {
      console.error('Error reporting crime:', error);
      toast.error('Failed to report crime. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('victim.')) {
      const victimField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        victim: {
          ...prev.victim,
          [victimField]: value
        }
      }));
    } else if (name === 'location') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          address: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-police-dark mb-6">Report New Crime</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter crime title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of the crime"
              required
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <Input
              name="location"
              value={formData.location.address}
              onChange={handleChange}
              placeholder="Enter crime location address"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select crime type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="theft">Theft</SelectItem>
                  <SelectItem value="assault">Assault</SelectItem>
                  <SelectItem value="burglary">Burglary</SelectItem>
                  <SelectItem value="vandalism">Vandalism</SelectItem>
                  <SelectItem value="fraud">Fraud</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
              <Select
                value={formData.severity}
                onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tool Used</label>
              <Select
                value={formData.toolUsed}
                onValueChange={(value) => setFormData(prev => ({ ...prev, toolUsed: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tool used" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weapon">Weapon</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="tool">Tool</SelectItem>
                  <SelectItem value="chemical">Chemical</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time of Occurrence</label>
              <Input
                type="datetime-local"
                name="timeOfOccurrence"
                value={formData.timeOfOccurrence}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Victim Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <Input
                name="victim.name"
                value={formData.victim.name}
                onChange={handleChange}
                placeholder="Enter victim's name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <Input
                name="victim.contact"
                value={formData.victim.contact}
                onChange={handleChange}
                placeholder="Enter victim's contact information"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <Textarea
                name="victim.description"
                value={formData.victim.description}
                onChange={handleChange}
                placeholder="Describe the victim's condition"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/crimes')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-police-dark text-white hover:bg-police"
            >
              {isSubmitting ? 'Reporting...' : 'Report Crime'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCrimePage; 