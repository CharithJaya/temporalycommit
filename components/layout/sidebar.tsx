"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X, Menu as MenuIcon, Home, Users, QrCode, UserPlus, ChartBar as BarChart3, FileCheck, FileText, CalendarDays, Settings, BookOpen, Clock } from "lucide-react";
import { isAdmin } from "@/lib/auth";

// Sidebar component
interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ className, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const userIsAdmin = isAdmin();

  const adminNavItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/members', icon: Users, label: 'Members' },
    { href: '/attendance', icon: Clock, label: 'Attendance' },
    { href: '/qr-scanner', icon: QrCode, label: 'QR Scanner' },
    { href: '/add-member', icon: UserPlus, label: 'Add Member' },
    { href: '/createInvoice', icon: FileCheck, label: 'Create Invoice' },
    { href: '/invoices', icon: FileText, label: 'Invoices' },
    { href: '/courses', icon: BookOpen, label: 'Courses' },
    { href: '/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/event', icon: CalendarDays, label: 'Event' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ];

  const studentNavItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/my-attendance', icon: Clock, label: 'My Attendance' },
    { href: '/my-courses', icon: BookOpen, label: 'My Courses' },
    { href: '/qr-code', icon: QrCode, label: 'My QR Code' },
    { href: '/profile', icon: Users, label: 'Profile' },
  ];

  const navItems = userIsAdmin ? adminNavItems : studentNavItems;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:shadow-none",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-primary">TuitionApp</h2>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden h-8 w-8 px-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) onClose?.();
                }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent group",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t bg-muted/30">
          <div className="flex items-center gap-3 px-3 py-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                userIsAdmin ? "bg-green-500" : "bg-blue-500"
              )}
            />
            <p className="text-xs text-muted-foreground font-medium">
              {userIsAdmin ? 'Admin Dashboard' : 'Student Portal'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Main Layout
interface LayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 bg-background">{children}</main>
      </div>
    </div>
  );
}
