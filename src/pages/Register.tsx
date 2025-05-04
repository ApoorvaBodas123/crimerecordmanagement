import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['police', 'admin'], {
    required_error: 'Please select a role',
  }),
  badgeNumber: z.string().min(1, 'Badge number is required'),
  department: z.string().min(1, 'Department is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type FormValues = z.infer<typeof formSchema>;

const Register = () => {
  const { register: registerUser, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'police',
      badgeNumber: '',
      department: '',
      phoneNumber: '',
    },
  });

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (values: FormValues) => {
    try {
      const success = await registerUser(
        values.name,
        values.email,
        values.password,
        values.role,
        values.badgeNumber,
        values.department,
        values.phoneNumber
      );
      if (success) {
        // Get the redirect path from location state or default to dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (err) {
      form.setError('root', {
        message: 'Failed to register. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Create an account to access the Crime Records Management System.
            Only authorized police officers and administrators can register.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {form.formState.errors.root.message}
              </div>
            )}
            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                {...form.register('name')}
                aria-invalid={!!form.formState.errors.name}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                {...form.register('email')}
                aria-invalid={!!form.formState.errors.email}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                {...form.register('password')}
                aria-invalid={!!form.formState.errors.password}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Badge Number"
                {...form.register('badgeNumber')}
                aria-invalid={!!form.formState.errors.badgeNumber}
              />
              {form.formState.errors.badgeNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.badgeNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Department"
                {...form.register('department')}
                aria-invalid={!!form.formState.errors.department}
              />
              {form.formState.errors.department && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.department.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Phone Number"
                {...form.register('phoneNumber')}
                aria-invalid={!!form.formState.errors.phoneNumber}
              />
              {form.formState.errors.phoneNumber && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Select
                onValueChange={(value) => form.setValue('role', value as 'police' | 'admin')}
                defaultValue={form.getValues('role')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="police">Police Officer</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
