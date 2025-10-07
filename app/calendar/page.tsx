'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // ✅ for navigation
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calendarEvents } from '@/lib/data';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
} from 'lucide-react';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const router = useRouter(); // ✅ initialize router

  const getCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const grid = [];
    let currentWeek: Date[] = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      currentWeek.push(date);

      if (currentWeek.length === 7) {
        grid.push(currentWeek);
        currentWeek = [];
      }
    }

    return grid;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return calendarEvents.filter((event) => event.date === dateString);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'class':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'exam':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'meeting':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'holiday':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateEvents = getEventsForDate(selectedDate);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar className="w-64 hidden lg:block" />

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <Header />

          <div className="p-6 space-y-6">
            {/* Page title and button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
                <p className="text-gray-600 mt-1">
                  Schedule and manage your classes and events
                </p>
              </div>
              <Button
                className="gap-2"
                onClick={() => router.push('/event')} // ✅ navigate to /event page
              >
                <Plus className="h-4 w-4" />
                Add Event
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Calendar */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        {monthNames[currentDate.getMonth()]}{' '}
                        {currentDate.getFullYear()}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigateMonth('prev')}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => navigateMonth('next')}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-1">
                      {/* Day headers */}
                      {dayNames.map((day) => (
                        <div
                          key={day}
                          className="p-2 text-center text-sm font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      ))}

                      {/* Calendar grid */}
                      {getCalendarGrid().map((week, weekIndex) =>
                        week.map((date, dayIndex) => {
                          const events = getEventsForDate(date);
                          const key = `${weekIndex}-${dayIndex}`;

                          return (
                            <div
                              key={key}
                              className={`min-h-[80px] p-1 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                                !isCurrentMonth(date)
                                  ? 'bg-gray-50 text-gray-400'
                                  : ''
                              } ${
                                isSelected(date) ? 'ring-2 ring-blue-500' : ''
                              } ${isToday(date) ? 'bg-blue-50' : ''}`}
                              onClick={() => setSelectedDate(date)}
                            >
                              <div
                                className={`text-sm font-medium mb-1 ${
                                  isToday(date) ? 'text-blue-600' : ''
                                }`}
                              >
                                {date.getDate()}
                              </div>
                              <div className="space-y-1">
                                {events.slice(0, 2).map((event) => (
                                  <div
                                    key={event.id}
                                    className="text-xs px-1 py-0.5 rounded bg-blue-100 text-blue-800 truncate"
                                  >
                                    {event.title}
                                  </div>
                                ))}
                                {events.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{events.length - 2} more
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Events for selected date */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedDateEvents.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No events scheduled for this date
                        </p>
                      ) : (
                        selectedDateEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {event.title}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={getEventTypeColor(event.type)}
                              >
                                {event.type.charAt(0).toUpperCase() +
                                  event.type.slice(1)}
                              </Badge>
                            </div>
                            {event.course && (
                              <p className="text-sm text-gray-600 mb-2">
                                {event.course}
                              </p>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              {event.time}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {calendarEvents.slice(0, 4).map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Badge
                            variant="secondary"
                            className={`${getEventTypeColor(event.type)} text-xs`}
                          >
                            {event.type}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {event.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {event.date} at {event.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
