import React from 'react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  Shield, 
  Users, 
  FileText, 
  MapPin, 
  Clock,
  Plus
} from 'lucide-react';

const PoliceDashboard = () => {
  const { crimes, policeOfficers, emergencyAlerts } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate statistics
  const totalCrimes = crimes.length;
  const activeInvestigations = crimes.filter(crime => crime.status === 'investigating').length;
  const resolvedCrimes = crimes.filter(crime => crime.status === 'closed').length;
  const totalOfficers = policeOfficers.length;
  const activeAlerts = emergencyAlerts.length;

  // Get recent crimes (last 5)
  const recentCrimes = [...crimes]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-police-dark">Police Dashboard</h1>
        <Button
          onClick={() => navigate('/crimes/add')}
          className="bg-police-dark text-white hover:bg-police"
        >
          <Plus className="h-4 w-4 mr-2" />
          Report New Crime
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Crimes</CardTitle>
            <Shield className="h-4 w-4 text-police" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCrimes}</div>
            <p className="text-xs text-muted-foreground">
              {activeInvestigations} under investigation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Officers</CardTitle>
            <Users className="h-4 w-4 text-police" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOfficers}</div>
            <p className="text-xs text-muted-foreground">
              On duty officers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Active emergency alerts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Cases</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedCrimes}</div>
            <p className="text-xs text-muted-foreground">
              Successfully resolved cases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Crimes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Crime Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCrimes.map((crime) => (
                <div key={crime.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{crime.title}</h3>
                      <p className="text-sm text-gray-500">{crime.type}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      crime.status === 'closed' ? 'bg-green-100 text-green-800' :
                      crime.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {crime.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{typeof crime.location === 'string' ? crime.location : crime.location.address}</span>
                  </div>
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{new Date(crime.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/crimes')}
              >
                View Crime Records
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/sos')}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency Alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PoliceDashboard; 