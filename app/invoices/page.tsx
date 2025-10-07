"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

// Dynamic imports for Lucide icons to fix hydration issues
const Search = dynamic(() => import("lucide-react").then((m) => m.Search), { ssr: false });
const Filter = dynamic(() => import("lucide-react").then((m) => m.Filter), { ssr: false });
const Download = dynamic(() => import("lucide-react").then((m) => m.Download), { ssr: false });
const Eye = dynamic(() => import("lucide-react").then((m) => m.Eye), { ssr: false });
const Plus = dynamic(() => import("lucide-react").then((m) => m.Plus), { ssr: false });
const Calendar = dynamic(() => import("lucide-react").then((m) => m.Calendar), { ssr: false });

interface Invoice {
  id: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  issueDate: string;
  items: { description: string; amount: number }[];
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conversionRate = 300; // 1 USD = 300 Rs
  const memberId = "123"; // replace with dynamic member ID if available

  // Fetch invoices from API
  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://new-backend-ve6s7g.fly.dev";
      const res = await fetch(`${apiUrl}/api/invoices?memberId=${memberId}`);

      if (!res.ok) throw new Error("Failed to fetch invoices");

      const data = await res.json();

      const invoicesArray: Invoice[] = Array.isArray(data)
        ? data
        : Array.isArray(data.content)
        ? data.content
        : [];

      setInvoices(invoicesArray);
    } catch (err: any) {
      console.error("Error fetching invoices:", err);
      setError(err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Filtered invoices based on search and status
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTotalRevenue = () =>
    invoices.reduce((total, invoice) => total + invoice.amount * conversionRate, 0);
  const getPaidAmount = () =>
    invoices
      .filter((inv) => inv.status === "paid")
      .reduce((total, invoice) => total + invoice.amount * conversionRate, 0);
  const getPendingAmount = () =>
    invoices
      .filter((inv) => inv.status === "pending")
      .reduce((total, invoice) => total + invoice.amount * conversionRate, 0);
  const getOverdueAmount = () =>
    invoices
      .filter((inv) => inv.status === "overdue")
      .reduce((total, invoice) => total + invoice.amount * conversionRate, 0);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
              <p className="text-gray-600 mt-1">Manage billing and track payments</p>
            </div>
            <button
              onClick={() => console.log("Create Invoice")}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Invoice</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                Rs {getTotalRevenue().toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                Rs {getPaidAmount().toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                Rs {getPendingAmount().toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                Rs {getOverdueAmount().toLocaleString()}
              </p>
            </div>
          </div>

          {/* Search + Filter */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="text-center py-10 text-gray-500">Loading invoices...</div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">{error}</div>
            ) : filteredInvoices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Issue Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{invoice.id}</td>
                        <td className="px-6 py-4">{invoice.studentName}</td>
                        <td className="px-6 py-4 font-semibold">
                          Rs {(invoice.amount * conversionRate).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex space-x-2">
                          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg">
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No invoices found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
