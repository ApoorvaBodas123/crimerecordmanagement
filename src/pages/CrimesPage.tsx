import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import CrimeCard from '@/components/CrimeCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const CrimesPage = () => {
  const navigate = useNavigate();
  const { crimes, loading, error, deleteCrimeRecord } = useData();
  const { user } = useAuth();

  const handleDelete = async (id: string) => {
    try {
      await deleteCrimeRecord(id);
      toast.success('Crime record deleted successfully');
    } catch (error) {
      console.error('Error deleting crime:', error);
      toast.error('Failed to delete crime record');
    }
  };

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crimes.map((crime) => (
          <CrimeCard
            key={crime.id}
            crime={crime}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default CrimesPage;
