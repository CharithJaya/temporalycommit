'use client';

import React, { useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getCurrentUser, logout } from '@/lib/auth';
import {
  LogOut,
  User,
  Settings,
  Home,
  Users,
  Clock,
  QrCode,
  UserPlus,
  FileCheck,
  FileText,
  BookOpen,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
  const user = getCurrentUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Admin navigation items (used only for mobile menu)
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

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Welcome message + mobile menu toggle */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">
            Welcome back, {user?.name || 'User'}
          </h1>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Right: Theme toggle + avatar dropdown */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-auto flex items-center gap-1 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.split(' ').map((n) => n[0]).join('') || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-sky-100 border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  
                className="flex items-center gap-1 px-3 py-2 rounded hover:bg-sky-800 transition-colors"

                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
