"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockMembers, mockAttendance, mockCourses } from '@/lib/mock-data';
import { Users, Clock, BookOpen, TrendingUp, Calendar, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = mockAttendance.filter(a => a.date === today);
  const activeMembers = mockMembers.filter(m => m.status === 'active');

  const stats = userIsAdmin ? [
    {
      title: 'Total Members',
      value: mockMembers.length.toString(),
      icon: Users,
      description: `${activeMembers.length} active`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Today\'s Attendance',
      value: todayAttendance.length.toString(),
      icon: UserCheck,
      description: `${todayAttendance.filter(a => a.status === 'present').length} present`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Courses',
      value: mockCourses.length.toString(),
      icon: BookOpen,
      description: '3 instructors',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      title: 'Monthly Revenue',
      value: 'Rs2,750',
      icon: TrendingUp,
      description: '+12% from last month',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ] : [
    {
      title: 'My Attendance',
      value: '85%',
      icon: UserCheck,
      description: 'This month',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Classes This Week',
      value: '6',
      icon: Calendar,
      description: '2 remaining',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('https://www.arena-multimedia.com/wp-content/uploads/2020/07/arena-bg.jpg')",
      }}
    >
      {/* Optional overlay for better readability */}
      <div className="flex min-h-screen bg-background/80">
        <Sidebar className="w-64 hidden lg:block" />
        <div className="flex-1">
          <Header />
          <main className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                {userIsAdmin 
                  ? 'Manage your tuition classes efficiently' 
                  : 'Track your learning progress'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                          </p>
                        </div>
                        <div className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Attendance</CardTitle>
                  <CardDescription>Latest check-ins and check-outs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todayAttendance.slice(0, 5).map((attendance) => (
                      <div key={attendance.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">{attendance.memberName}</p>
                          <p className="text-sm text-muted-foreground">
                            In: {attendance.checkInTime} 
                            {attendance.checkOutTime && ` • Out: ${attendance.checkOutTime}`}
                          </p>
                        </div>
                        <Badge variant={
                          attendance.status === 'present' ? 'default' :
                          attendance.status === 'late' ? 'secondary' : 'destructive'
                        }>
                          {attendance.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/attendance">View All Attendance</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userIsAdmin ? (
                    <>
                      <Button asChild className="w-full justify-start">
                        <Link href="/qr-scanner">
                          <Clock className="mr-2 h-4 w-4" />
                          Scan QR Code for Attendance
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/add-member">
                          <Users className="mr-2 h-4 w-4" />
                          Add New Member
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/members">
                          <Users className="mr-2 h-4 w-4" />
                          View All Members
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full justify-start">
                        <Link href="/qr-code">
                          <Clock className="mr-2 h-4 w-4" />
                          Show My QR Code
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/my-attendance">
                          <UserCheck className="mr-2 h-4 w-4" />
                          View My Attendance
                        </Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full justify-start">
                        <Link href="/my-courses">
                          <BookOpen className="mr-2 h-4 w-4" />
                          My Courses
                        </Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
