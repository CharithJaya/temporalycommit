"use client";

import { useState, useMemo } from "react";
import { FileText, Download, Filter, Users } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage"; // adjust path if needed
import { Course, AttendanceRecord } from "@/types"; // adjust path if needed
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function ExportAttendancePage() {
  const [courses] = useLocalStorage<Course[]>("courses", []);
  const [attendance] = useLocalStorage<AttendanceRecord[]>("attendance", []);

  const [filters, setFilters] = useState({
    courseId: "",
    startDate: "",
    endDate: "",
    status: "",
  });

  const filteredAttendance = useMemo(() => {
    return attendance.filter((record) => {
      const recordDate = new Date(record.date);

      if (filters.courseId && record.courseId !== filters.courseId) return false;
      if (filters.startDate && recordDate < new Date(filters.startDate)) return false;
      if (filters.endDate && recordDate > new Date(filters.endDate)) return false;
      if (filters.status && record.status !== filters.status) return false;

      return true;
    });
  }, [attendance, filters]);

  const downloadCSV = () => {
    if (filteredAttendance.length === 0) {
      alert("No records to export");
      return;
    }

    const csvHeaders = ["Student Name", "Course Name", "Date", "Status", "Notes"];
    const csvRows = filteredAttendance.map((record) => [
      record.studentName,
      record.courseName,
      new Date(record.date).toLocaleDateString(),
      record.status,
      record.notes || "",
    ]);

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((field) => `"${field}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `attendance-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "late":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "absent":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const stats = useMemo(() => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter((r) => r.status === "present").length;
    const late = filteredAttendance.filter((r) => r.status === "late").length;
    const absent = filteredAttendance.filter((r) => r.status === "absent").length;

    return { total, present, late, absent };
  }, [filteredAttendance]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar className="w-64 hidden lg:block" />

      {/* Main Content */}
      <div className="flex-1">
        <Header />

        <main className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Export Attendance</h1>
            <p className="text-gray-600 mt-2">
              Filter and export attendance records
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <Filter className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label
                  htmlFor="courseFilter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Course
                </label>
                <select
                  id="courseFilter"
                  value={filters.courseId}
                  onChange={(e) =>
                    setFilters({ ...filters, courseId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Courses</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={filters.startDate}
                  onChange={(e) =>
                    setFilters({ ...filters, startDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={filters.endDate}
                  onChange={(e) =>
                    setFilters({ ...filters, endDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="statusFilter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Status
                </label>
                <select
                  id="statusFilter"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Total Records", value: stats.total, color: "blue" },
              { label: "Present", value: stats.present, color: "green" },
              { label: "Late", value: stats.late, color: "yellow" },
              { label: "Absent", value: stats.absent, color: "red" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p
                      className={`text-3xl font-bold text-${stat.color}-600`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div className={`bg-${stat.color}-50 p-3 rounded-lg`}>
                    <Users className={`h-8 w-8 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Export Button */}
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {filteredAttendance.length} record(s) found
            </p>
            <button
              onClick={downloadCSV}
              disabled={filteredAttendance.length === 0}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-shadow inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5 mr-2" />
              Download CSV
            </button>
          </div>

          {/* Records Table */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-purple-600" />
                Attendance Records
              </h3>
            </div>

            {filteredAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">
                        Student
                      </th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">
                        Course
                      </th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">
                        Date
                      </th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-left py-3 px-6 font-semibold text-gray-700">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((record, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-6 font-medium text-gray-900">
                          {record.studentName}
                        </td>
                        <td className="py-3 px-6 text-gray-600">
                          {record.courseName}
                        </td>
                        <td className="py-3 px-6 text-gray-600">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-6">
                          <span
                            className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-gray-600 max-w-xs truncate">
                          {record.notes || "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No records found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or add some attendance records first
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
