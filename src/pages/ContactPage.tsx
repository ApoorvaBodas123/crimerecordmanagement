
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters" }),
  message: z.string().min(20, { message: "Message must be at least 20 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

const ContactPage = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: FormValues) => {
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(values);
    toast.success("Your message has been sent successfully!");
    form.reset();
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-police-dark mb-4 text-center">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-3xl mx-auto">
          Have questions or need assistance? Reach out to our team using the contact information below or fill out the form.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="bg-police text-white rounded-full p-4 mb-4">
              <Phone className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Phone</h3>
            <p className="text-gray-600 mb-4">Our call center operates 24/7 for your convenience</p>
            <p className="font-medium">Emergency: 911</p>
            <p className="font-medium">Non-Emergency: (555) 123-4567</p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="bg-police text-white rounded-full p-4 mb-4">
              <Mail className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Send us an email and we'll respond within 24 hours</p>
            <a href="mailto:support@civiceye.gov" className="font-medium text-blue-600 hover:underline">
              support@civiceye.gov
            </a>
            <a href="mailto:info@civiceye.gov" className="font-medium text-blue-600 hover:underline">
              info@civiceye.gov
            </a>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="bg-police text-white rounded-full p-4 mb-4">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
            <p className="text-gray-600 mb-4">Stop by our headquarters for in-person assistance</p>
            <p className="font-medium">100 Police Plaza</p>
            <p className="font-medium">Downtown, City 10001</p>
            <div className="flex items-center mt-2 text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Open: Mon-Fri, 8AM-6PM</span>
            </div>
          </Card>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What is your message about?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter your message here..." 
                          rows={5} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
