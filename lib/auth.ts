import { User } from './types';
import { mockUsers } from './mock-data';

// Simple mock authentication
let currentUser: User | null = null;

export const login = async (email: string, password: string): Promise<User | null> => {
  // Mock authentication - in real app, this would call an API
  const user = mockUsers.find(u => u.email === email);
  if (user) {
    currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  if (currentUser) return currentUser;
  
  const stored = localStorage.getItem('currentUser');
  if (stored) {
    currentUser = JSON.parse(stored);
    return currentUser;
  }
  
  return null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};