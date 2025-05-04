import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    role: 'police' as 'police' | 'admin',
    badgeNumber: '',
    department: '',
    phoneNumber: ''
  });
  const [isLoading, setIsLoading] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: 'police' | 'admin') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.badgeNumber,
        formData.department,
        formData.phoneNumber
      );
      if (success) {
        navigate('/crimes');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 border-2 border-police">
          <h1 className="text-2xl font-bold text-center mb-6 text-police-dark">Create an Account</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-police-dark mb-1">
                Full Name
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                className="border-2 focus:border-police focus:ring-police"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-police-dark mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="border-2 focus:border-police focus:ring-police"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-police-dark mb-1">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                disabled={isLoading}
                className="border-2 focus:border-police focus:ring-police"
              />
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-police-dark mb-1">
                Phone Number
              </label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                disabled={isLoading}
                className="border-2 focus:border-police focus:ring-police"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-police-dark mb-1">
                Role
              </label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
                disabled={isLoading}
              >
                <SelectTrigger className="border-2 focus:border-police focus:ring-police">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="police">Police Officer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="badgeNumber" className="block text-sm font-medium text-police-dark mb-1">
                Badge Number
              </label>
              <Input
                id="badgeNumber"
                name="badgeNumber"
                value={formData.badgeNumber}
                onChange={handleChange}
                placeholder="Enter your badge number"
                required
                disabled={isLoading}
                className="border-2 focus:border-police focus:ring-police"
              />
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-police-dark mb-1">
                Department
              </label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter your department"
                required
                disabled={isLoading}
                className="border-2 focus:border-police focus:ring-police"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-police hover:bg-police-dark text-white font-semibold py-2" 
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-police hover:underline font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RegisterPage; 