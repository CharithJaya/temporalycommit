'use client';

import { Sidebar } from '@/components/layout/sidebar'; // ✅ adjust if you export default
import { Header } from '@/components/layout/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAnalyticsData } from '@/lib/data';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function AnalyticsPage() {
  const analytics = getAnalyticsData();

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar className="w-64 hidden lg:block" />

        {/* Main Content */}
        <div className="flex-1">
          <Header />

          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">This analytics data is not real. I am still developing it. This only shows an idea of the analytics page</h1>
              <p className="text-gray-600 mt-1">
                Insights into your tuition class performance
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {analytics.totalStudents}
                    </p>
                    <p className="text-sm text-gray-600">Total Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {analytics.activeStudents}
                    </p>
                    <p className="text-sm text-gray-600">Active Students</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {analytics.totalCourses}
                    </p>
                    <p className="text-sm text-gray-600">Total Courses</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-600">
                      {analytics.avgAttendance}%
                    </p>
                    <p className="text-sm text-gray-600">Avg Attendance</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Attendance Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.attendanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="present"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Present (%)"
                      />
                      <Line
                        type="monotone"
                        dataKey="absent"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Absent (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Course Enrollment */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Enrollment</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics.coursePerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="students"
                        fill="#3B82F6"
                        name="Enrolled Students"
                      />
                      <Bar
                        dataKey="capacity"
                        fill="#E5E7EB"
                        name="Total Capacity"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Course Performance Details */}
            <Card>
              <CardHeader>
                <CardTitle>Course Performance Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.coursePerformance.map((course, index) => (
                    <div
                      key={course.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-4 h-4 rounded"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {course.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {course.students} of {course.capacity} students
                            enrolled
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">
                          {course.percentage}%
                        </p>
                        <p className="text-sm text-gray-600">
                          Enrollment Rate
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Summary */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.attendanceData.slice(-3).map((month) => (
                      <div
                        key={month.month}
                        className="flex items-center justify-between"
                      >
                        <span className="font-medium">{month.month} 2025</span>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-sm text-gray-600">
                              {month.present}% Present
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <span className="text-sm text-gray-600">
                              {month.absent}% Absent
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <p className="text-sm text-green-800">
                        Attendance has improved by 5% this month
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <p className="text-sm text-blue-800">
                        Mathematics course has the highest enrollment rate
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <p className="text-sm text-orange-800">
                        Chemistry course has availability for 2 more students
                      </p>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <p className="text-sm text-purple-800">
                        Overall student satisfaction rate is 95%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
