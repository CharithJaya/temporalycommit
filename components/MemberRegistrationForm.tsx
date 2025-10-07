'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  course: string;
  emergencyContact: string;
  address: string;
}

const MemberRegistrationForm = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    emergencyContact: '',
    address: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('https://new-backend-oia8vq.fly.dev/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register member');
      }

      const data = await response.json();
      setMessage(`✅ Member registered successfully! ID: ${data.id}`);

      setFormData({
        fullName: '',
        email: '',
        phone: '',
        course: '',
        emergencyContact: '',
        address: '',
      });
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card text-card-foreground rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Member Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div>
            <Label>Email *</Label>
            <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label>Phone *</Label>
            <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div>
            <Label>Course *</Label>
            <Select
              value={formData.course}
              onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Java Spring Boot">Java Spring Boot</SelectItem>
                <SelectItem value="Physics Grade 11">Physics Grade 11</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Emergency Contact</Label>
            <Input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
          </div>
          <div className="sm:col-span-2">
            <Label>Address</Label>
            <Textarea name="address" value={formData.address} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => setFormData({
            fullName: '',
            email: '',
            phone: '',
            course: '',
            emergencyContact: '',
            address: '',
          })}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </form>

      {message && (
        <p className={`mt-4 ${message.startsWith('❌') ? 'text-red-500' : 'text-green-500'}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default MemberRegistrationForm;
