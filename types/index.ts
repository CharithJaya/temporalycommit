export interface Course {
  id: string;
  name: string;
  subject: string;
  instructor: string;
  schedule: string;
  duration: string;
  fee: number;
  description: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  type: 'exam' | 'workshop' | 'seminar' | 'holiday' | 'other';
  createdAt: Date;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseId: string;
  enrolledAt: Date;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
}