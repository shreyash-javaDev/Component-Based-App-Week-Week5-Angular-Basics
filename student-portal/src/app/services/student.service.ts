import { Injectable, signal, computed } from '@angular/core';
import { Student, Course, Grade } from '../models/student.model';

/**
 * StudentService manages all student, course, and grade data.
 * Uses Angular signals for reactive state management.
 */
@Injectable({ providedIn: 'root' })
export class StudentService {

  // ─── State ────────────────────────────────────────────────────────────────
  private _students = signal<Student[]>(MOCK_STUDENTS);
  private _courses  = signal<Course[]>(MOCK_COURSES);
  private _grades   = signal<Grade[]>(MOCK_GRADES);

  // ─── Public Readonly Signals ───────────────────────────────────────────────
  readonly students = this._students.asReadonly();
  readonly courses  = this._courses.asReadonly();
  readonly grades   = this._grades.asReadonly();

  /** Summary stats for the dashboard */
  readonly stats = computed(() => ({
    totalStudents: this._students().length,
    totalCourses:  this._courses().length,
    totalGrades:   this._grades().length,
    avgMarks:      this.computeAvgMarks()
  }));

  // ─── Students CRUD ────────────────────────────────────────────────────────

  addStudent(student: Omit<Student, 'id'>): void {
    const newStudent: Student = {
      ...student,
      id: this.nextId(this._students())
    };
    this._students.update(list => [...list, newStudent]);
  }

  updateStudent(updated: Student): void {
    this._students.update(list =>
      list.map(s => s.id === updated.id ? updated : s)
    );
  }

  deleteStudent(id: number): void {
    this._students.update(list => list.filter(s => s.id !== id));
    this._grades.update(list => list.filter(g => g.studentId !== id));
  }

  getStudentById(id: number): Student | undefined {
    return this._students().find(s => s.id === id);
  }

  // ─── Courses ──────────────────────────────────────────────────────────────

  getCourseById(id: number): Course | undefined {
    return this._courses().find(c => c.id === id);
  }

  // ─── Grades ───────────────────────────────────────────────────────────────

  getGradesForStudent(studentId: number): Grade[] {
    return this._grades().filter(g => g.studentId === studentId);
  }

  addGrade(grade: Omit<Grade, 'id'>): void {
    const newGrade: Grade = { ...grade, id: this.nextId(this._grades()) };
    this._grades.update(list => [...list, newGrade]);
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private nextId(list: { id: number }[]): number {
    return list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;
  }

  private computeAvgMarks(): number {
    const grades = this._grades();
    if (!grades.length) return 0;
    const total = grades.reduce((sum, g) => sum + (g.marks / g.maxMarks) * 100, 0);
    return Math.round(total / grades.length);
  }
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_STUDENTS: Student[] = [
  { id: 1, name: 'Alex Johnson',   email: 'alex@edu.in',   rollNumber: 'CS2021001', department: 'Computer Science', semester: 5, enrolledCourses: [1, 2, 3], joinDate: '2021-08-01' },
  { id: 2, name: 'Priya Sharma',   email: 'priya@edu.in',  rollNumber: 'CS2021002', department: 'Computer Science', semester: 5, enrolledCourses: [1, 3],    joinDate: '2021-08-01' },
  { id: 3, name: 'Rahul Mehta',    email: 'rahul@edu.in',  rollNumber: 'IT2022001', department: 'Information Tech', semester: 3, enrolledCourses: [2, 4],    joinDate: '2022-08-01' },
  { id: 4, name: 'Sara Ahmed',     email: 'sara@edu.in',   rollNumber: 'EC2021003', department: 'Electronics',      semester: 5, enrolledCourses: [1, 4],    joinDate: '2021-08-01' },
  { id: 5, name: 'Kiran Patil',    email: 'kiran@edu.in',  rollNumber: 'ME2023001', department: 'Mechanical',       semester: 1, enrolledCourses: [3],        joinDate: '2023-08-01' },
];

const MOCK_COURSES: Course[] = [
  { id: 1, code: 'CS401', name: 'Data Structures & Algorithms', instructor: 'Prof. Desai',  credits: 4, department: 'Computer Science', totalStudents: 45 },
  { id: 2, code: 'CS402', name: 'Web Development',              instructor: 'Prof. Kulkarni',credits: 3, department: 'Computer Science', totalStudents: 38 },
  { id: 3, code: 'IT301', name: 'Database Management',          instructor: 'Prof. Joshi',  credits: 4, department: 'Information Tech',  totalStudents: 52 },
  { id: 4, code: 'EC401', name: 'Signals & Systems',            instructor: 'Prof. Rao',    credits: 3, department: 'Electronics',       totalStudents: 29 },
];

const MOCK_GRADES: Grade[] = [
  { id: 1, studentId: 1, courseId: 1, marks: 88, maxMarks: 100, grade: 'A',  semester: 5 },
  { id: 2, studentId: 1, courseId: 2, marks: 75, maxMarks: 100, grade: 'B+', semester: 5 },
  { id: 3, studentId: 1, courseId: 3, marks: 92, maxMarks: 100, grade: 'A+', semester: 5 },
  { id: 4, studentId: 2, courseId: 1, marks: 65, maxMarks: 100, grade: 'B',  semester: 5 },
  { id: 5, studentId: 2, courseId: 3, marks: 78, maxMarks: 100, grade: 'B+', semester: 5 },
  { id: 6, studentId: 3, courseId: 2, marks: 55, maxMarks: 100, grade: 'C',  semester: 3 },
  { id: 7, studentId: 4, courseId: 1, marks: 95, maxMarks: 100, grade: 'A+', semester: 5 },
  { id: 8, studentId: 5, courseId: 3, marks: 70, maxMarks: 100, grade: 'B',  semester: 1 },
];
