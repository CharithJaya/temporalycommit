export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  joinDate: string;
  status: 'active' | 'inactive';
  profilePicture?: string;
  address?: string;
  emergencyContact?: string;
  qrCode: string;
}

export interface AttendanceRecord {
  id: string;
  memberId: string;
  memberName: string;
  checkInTime: string;
  checkOutTime?: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  duration?: number; // in minutes
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  memberId?: string; // for students
}

export interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  schedule: string;
  duration: string;
  fees: number;
}