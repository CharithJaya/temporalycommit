// Mock data for the application
export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  enrollmentDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  instructor: string;
  duration: string;
  fee: number;
  students: number;
  maxStudents: number;
  schedule: string;
  status: 'active' | 'inactive';
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  course: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'class' | 'exam' | 'meeting' | 'holiday';
  course?: string;
}

// Mock students data
export const students: Student[] = [
  {
  id: '1',
  name: 'Charith Jayashan',
  email: 'charith.jayashan@university.lk',
  phone: '+94711234567',
  course: 'Mathematics',
  enrollmentDate: '2024-01-15',
  status: 'active',
},
{
  id: '2',
  name: 'Nuwan Perera',
  email: 'nuwan.perera@university.lk',
  phone: '+94712233445',
  course: 'Physics',
  enrollmentDate: '2024-01-20',
  status: 'active',
},
{
  id: '3',
  name: 'Sanduni Lakmali',
  email: 'sanduni.lakmali@university.lk',
  phone: '+94713344556',
  course: 'Chemistry',
  enrollmentDate: '2024-02-01',
  status: 'active',
},
{
  id: '4',
  name: 'Kasun Fernando',
  email: 'kasun.fernando@university.lk',
  phone: '+94714455667',
  course: 'Mathematics',
  enrollmentDate: '2024-01-10',
  status: 'inactive',
},
{
  id: '5',
  name: 'Tharushi Madushani',
  email: 'tharushi.madushani@university.lk',
  phone: '+94715566778',
  course: 'Physics',
  enrollmentDate: '2024-02-15',
  status: 'active',
},

];

// Mock courses data
export const courses: Course[] = [
  {
    id: '1',
    name: 'Advanced Mathematics',
    description: 'Comprehensive course covering calculus, algebra, and geometry',
    instructor: 'Dr. Sarah Johnson',
    duration: '6 months',
    fee: 500,
    students: 25,
    maxStudents: 30,
    schedule: 'Mon, Wed, Fri - 10:00 AM',
    status: 'active',
  },
  {
    id: '2',
    name: 'Physics Fundamentals',
    description: 'Core physics concepts including mechanics, thermodynamics, and waves',
    instructor: 'Prof. Michael Chen',
    duration: '4 months',
    fee: 400,
    students: 20,
    maxStudents: 25,
    schedule: 'Tue, Thu - 2:00 PM',
    status: 'active',
  },
  {
    id: '3',
    name: 'Organic Chemistry',
    description: 'In-depth study of organic compounds and reactions',
    instructor: 'Dr. Emily Rodriguez',
    duration: '5 months',
    fee: 450,
    students: 18,
    maxStudents: 20,
    schedule: 'Mon, Wed - 4:00 PM',
    status: 'active',
  },
];

// Mock attendance data
export const attendanceRecords: AttendanceRecord[] = [
 {
  id: '1',
  studentId: '1',
  studentName: 'Charith Jayashan',
  date: '2025-01-15',
  status: 'present',
  course: 'Mathematics',
},
{
  id: '2',
  studentId: '2',
  studentName: 'Nuwan Perera',
  date: '2025-01-15',
  status: 'present',
  course: 'Physics',
},
{
  id: '3',
  studentId: '3',
  studentName: 'Sanduni Lakmali',
  date: '2025-01-15',
  status: 'absent',
  course: 'Chemistry',
},
{
  id: '4',
  studentId: '1',
  studentName: 'Charith Jayashan',
  date: '2025-01-14',
  status: 'late',
  course: 'Mathematics',
},
{
  id: '5',
  studentId: '2',
  studentName: 'Nuwan Perera',
  date: '2025-01-14',
  status: 'present',
  course: 'Physics',
},

];

// Mock calendar events
export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Mathematics Class',
    date: '2025-01-16',
    time: '10:00 AM',
    type: 'class',
    course: 'Advanced Mathematics',
  },
  {
    id: '2',
    title: 'Physics Lab',
    date: '2025-01-16',
    time: '2:00 PM',
    type: 'class',
    course: 'Physics Fundamentals',
  },
  {
    id: '3',
    title: 'Mid-term Exam',
    date: '2025-01-20',
    time: '9:00 AM',
    type: 'exam',
  },
  {
    id: '4',
    title: 'Faculty Meeting',
    date: '2025-01-18',
    time: '3:00 PM',
    type: 'meeting',
  },
  {
    id: '5',
    title: 'Holiday - Martin Luther King Jr. Day',
    date: '2025-01-20',
    time: 'All Day',
    type: 'holiday',
  },
];

// Analytics data
export const getAnalyticsData = () => {
  const attendanceData = [
    { month: 'Sep', present: 85, absent: 15 },
    { month: 'Oct', present: 88, absent: 12 },
    { month: 'Nov', present: 92, absent: 8 },
    { month: 'Dec', present: 89, absent: 11 },
    { month: 'Jan', present: 91, absent: 9 },
  ];

  const coursePerformance = courses.map(course => ({
    name: course.name,
    students: course.students,
    capacity: course.maxStudents,
    percentage: Math.round((course.students / course.maxStudents) * 100),
  }));

  return {
    attendanceData,
    coursePerformance,
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    totalCourses: courses.length,
    avgAttendance: 90,
  };
};