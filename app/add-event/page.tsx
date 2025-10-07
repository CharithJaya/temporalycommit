'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'exam' | 'workshop' | 'seminar' | 'holiday' | 'other';
  createdAt: Date;
}

export default function AddEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'other' as Event['type'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newEvent = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      type: formData.type,
    };

    try {
      const res = await fetch("https://new-backend-ve6s7g.fly.dev/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      if (!res.ok) {
        throw new Error("Failed to save event");
      }

      const savedEvent = await res.json();
      console.log("✅ Event saved:", savedEvent);

      router.push("/calendar");
    } catch (err) {
      console.error("❌ Error saving event:", err);
      alert("Failed to save event. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex">
        <Sidebar className="w-64 hidden lg:block" />
        <div className="flex-1">
          <Header />
          <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-4 animate-in fade-in slide-in-from-top-4 duration-700">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push('/calendar')}
                className="hover:scale-110 transition-transform duration-200"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Schedule New Event</h1>
                <p className="text-gray-600 mt-2">
                  Create a new event for your tuition center
                </p>
              </div>
            </div>

            <Card className="p-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-150 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                      placeholder="e.g., Mathematics Quiz Competition"
                    />
                  </div>

                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-300">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    />
                  </div>

                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Time *
                    </label>
                    <input
                      type="time"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    />
                  </div>

                  <div className="animate-in fade-in slide-in-from-left-4 duration-500 delay-400">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Event Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                    >
                      <option value="exam">Exam</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="holiday">Holiday</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="animate-in fade-in slide-in-from-right-4 duration-500 delay-400">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 hover:border-gray-400"
                      placeholder="e.g., Main Classroom, Room 101"
                    />
                  </div>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 resize-none hover:border-gray-400"
                    placeholder="Describe the event details, objectives, and any special instructions..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-600">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/calendar')}
                    className="hover:scale-105 transition-transform duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white hover:from-emerald-700 hover:to-blue-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Schedule Event
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
