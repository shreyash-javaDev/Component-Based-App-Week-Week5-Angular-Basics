/**
 * Represents a student in the portal.
 */
export interface Student {
  id: number;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  semester: number;
  enrolledCourses: number[]; // Course IDs
  joinDate: string;
}

/**
 * Represents an academic course.
 */
export interface Course {
  id: number;
  code: string;
  name: string;
  instructor: string;
  credits: number;
  department: string;
  totalStudents: number;
}

/**
 * Represents a grade record linking a student to a course.
 */
export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  marks: number;
  maxMarks: number;
  grade: string;
  semester: number;
}

/**
 * Represents a logged-in user session.
 */
export interface User {
  id: number;
  username: string;
  role: 'admin' | 'student';
  name: string;
}
