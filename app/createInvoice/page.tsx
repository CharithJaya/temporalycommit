"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ArrowLeft, Plus, Trash2, Save, Send } from "lucide-react";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Student {
  id: number;
  fullName: string;
}

export default function CreateInvoicePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [invoiceData, setInvoiceData] = useState({
    studentId: "",
    studentName: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    notes: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "Mathematics Tuition", quantity: 1, rate: 150, amount: 150 * 300 },
  ]);

  // -------------------------------
  // FETCH STUDENTS FROM BACKEND
  // -------------------------------
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoadingStudents(true);
      setError(null);
      try {
        const res = await fetch("https://new-backend-ve6s7g.fly.dev/api/members");
        if (!res.ok) throw new Error("Failed to fetch students");
        const data = await res.json();

        // Map backend Member entity to frontend Student shape
        const studentList: Student[] = (Array.isArray(data) ? data : data.content || []).map(
          (m: any) => ({
            id: m.id.toString(), // convert to string for select value
            fullName: m.fullName,
          })
        );

        setStudents(studentList);
      } catch (err: any) {
        console.error("Error fetching students:", err);
        setError(err.message);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // -------------------------------
  // ITEM HANDLERS
  // -------------------------------
  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), description: "", quantity: 1, rate: 0, amount: 0 },
    ]);
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate) * 300; // convert to Rs
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // -------------------------------
  // CALCULATIONS
  // -------------------------------
  const getSubtotal = () => items.reduce((total, item) => total + item.amount, 0);
  const getTax = () => getSubtotal() * 0.18;
  const getTotal = () => getSubtotal() + getTax();

  // -------------------------------
  // SAVE DRAFT API
  // -------------------------------
  const saveDraft = async () => {
    if (!invoiceData.studentId) {
      alert("Please select a student before saving.");
      return;
    }

    const payload = {
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      notes: invoiceData.notes,
      items: items.map((i) => ({
        description: i.description,
        qty: i.quantity,
        rate: i.rate,
        amount: i.amount,
      })),
      subtotal: getSubtotal(),
      tax: getTax(),
      total: getTotal(),
    };

    try {
      const response = await fetch(
        `https://new-backend-ve6s7g.fly.dev/api/invoices/${invoiceData.studentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving draft:", errorData);
        alert("❌ Failed to save draft. Check console for details.");
        return;
      }

      const data = await response.json();
      console.log("✅ Draft saved successfully:", data);
      alert("✅ Draft saved successfully!");
    } catch (err) {
      console.error("Network error:", err);
      alert("⚠️ Network error. Could not save draft.");
    }
  };

  // -------------------------------
  // RENDER
  // -------------------------------
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar className="w-64 hidden lg:block" />
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-6 space-y-6">
          {/* Back + Title */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create Invoice</h1>
              <p className="text-gray-600 mt-1">
                Generate a new invoice for student billing
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Invoice Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Student
                    </label>
                    <select
                      value={invoiceData.studentId}
                      onChange={(e) => {
                        const selected = students.find((s) => s.id === e.target.value);
                        setInvoiceData({
                          ...invoiceData,
                          studentId: e.target.value,
                          studentName: selected?.fullName || "",
                        });
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isLoadingStudents}
                    >
                      <option value="">
                        {isLoadingStudents ? "Loading students..." : "Select Student"}
                      </option>
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.fullName}
                        </option>
                      ))}
                    </select>
                    {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <input
                      type="date"
                      value={invoiceData.issueDate}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, issueDate: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) =>
                        setInvoiceData({ ...invoiceData, dueDate: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                  <button
                    onClick={addItem}
                    className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                      <div className="col-span-5">
                        {idx === 0 && (
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                        )}
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            updateItem(item.id, "description", e.target.value)
                          }
                          placeholder="Item description"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-2">
                        {idx === 0 && <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>}
                        <input
                          type="number"
                          value={item.quantity}
                          min={1}
                          onChange={(e) =>
                            updateItem(item.id, "quantity", parseInt(e.target.value) || 0)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-2">
                        {idx === 0 && <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>}
                        <input
                          type="number"
                          value={item.rate}
                          min={0}
                          step={0.01}
                          onChange={(e) =>
                            updateItem(item.id, "rate", parseFloat(e.target.value) || 0)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="col-span-2">
                        {idx === 0 && <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rs)</label>}
                        <input
                          type="number"
                          value={item.amount}
                          readOnly
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                        />
                      </div>

                      <div className="col-span-1">
                        {items.length > 1 && (
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <textarea
                  value={invoiceData.notes}
                  onChange={(e) =>
                    setInvoiceData({ ...invoiceData, notes: e.target.value })
                  }
                  placeholder="Add any additional notes or terms..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Summary + Buttons */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>Rs {getSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18%):</span>
                    <span>Rs {getTax().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">Rs {getTotal().toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={saveDraft}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </button>

                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2">
                    <Send className="w-4 h-4" />
                    <span>Send Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
