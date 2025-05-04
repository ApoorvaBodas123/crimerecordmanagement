import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Crime Records Management System</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardCard
            title="Crimes"
            description="View and manage crime records"
            onClick={() => navigate('/crimes')}
          />
          <DashboardCard
            title="Directory"
            description="Access police station directory"
            onClick={() => navigate('/directory')}
          />
          <DashboardCard
            title="Reports"
            description="Generate and view reports"
            onClick={() => navigate('/reports')}
          />
          <DashboardCard
            title="Cases"
            description="Manage active cases"
            onClick={() => navigate('/cases')}
          />
          <DashboardCard
            title="Evidence"
            description="Track evidence records"
            onClick={() => navigate('/evidence')}
          />
          <DashboardCard
            title="Analytics"
            description="View crime statistics"
            onClick={() => navigate('/analytics')}
          />
        </div>
      </main>
    </div>
  );
};

const DashboardCard = ({ title, description, onClick }: { 
  title: string; 
  description: string; 
  onClick: () => void;
}) => (
  <div
    className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Dashboard; 