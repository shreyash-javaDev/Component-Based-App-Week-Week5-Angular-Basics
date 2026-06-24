import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Grade } from '../../models/student.model';

/**
 * GradesComponent shows grade records, filterable by student.
 * Calculates and displays a percentage and grade letter per record.
 */
@Component({
  selector: 'app-grades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Grades</h1>
          <p>{{ filteredGrades().length }} records</p>
        </div>
        <div class="filter-group">
          <select [(ngModel)]="selectedStudentId" (ngModelChange)="onStudentChange($event)">
            <option [value]="0">All Students</option>
            <option *ngFor="let s of students()" [value]="s.id">
              {{ s.name }} ({{ s.rollNumber }})
            </option>
          </select>
        </div>
      </header>

      <!-- Student Summary Card (when filtered) -->
      <div class="student-summary" *ngIf="selectedStudent()">
        <div class="summary-info">
          <h3>{{ selectedStudent()!.name }}</h3>
          <span>{{ selectedStudent()!.rollNumber }}</span>
          <span class="dept">{{ selectedStudent()!.department }}</span>
        </div>
        <div class="summary-stats">
          <div class="s-stat">
            <span class="s-val">{{ filteredGrades().length }}</span>
            <span class="s-lbl">Subjects</span>
          </div>
          <div class="s-stat">
            <span class="s-val">{{ studentAvg() }}%</span>
            <span class="s-lbl">Average</span>
          </div>
          <div class="s-stat">
            <span class="s-val" [class]="gradeClass(studentAvg())">{{ letterGrade(studentAvg()) }}</span>
            <span class="s-lbl">Overall</span>
          </div>
        </div>
      </div>

      <!-- Grades Table -->
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Semester</th>
              <th>Marks</th>
              <th>Percentage</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let g of filteredGrades()">
              <td>
                <strong>{{ getStudentName(g.studentId) }}</strong>
                <br /><small class="muted">{{ getStudentRoll(g.studentId) }}</small>
              </td>
              <td>
                <strong>{{ getCourseName(g.courseId) }}</strong>
                <br /><small class="muted">{{ getCourseCode(g.courseId) }}</small>
              </td>
              <td><span class="sem-badge">Sem {{ g.semester }}</span></td>
              <td>{{ g.marks }} / {{ g.maxMarks }}</td>
              <td>
                <div class="progress-wrap">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="pct(g)" [class]="pctClass(pct(g))"></div>
                  </div>
                  <span>{{ pct(g) }}%</span>
                </div>
              </td>
              <td>
                <span class="grade-badge" [class]="gradeClass(pct(g))">{{ g.grade }}</span>
              </td>
            </tr>
            <tr *ngIf="filteredGrades().length === 0">
              <td colspan="6" class="empty">No grade records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a237e; margin: 0 0 4px; }
    .page-header p  { color: #888; margin: 0; font-size: 0.875rem; }
    .filter-group select {
      padding: 9px 14px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      min-width: 220px;
      background: #fff;
    }
    .student-summary {
      background: #1a237e;
      color: #fff;
      border-radius: 12px;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .summary-info h3 { margin: 0 0 4px; font-size: 1.1rem; }
    .summary-info span { font-size: 0.85rem; opacity: 0.8; margin-right: 12px; }
    .summary-stats { display: flex; gap: 32px; }
    .s-stat { text-align: center; }
    .s-val { display: block; font-size: 1.6rem; font-weight: 700; }
    .s-lbl { font-size: 0.75rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.5px; }
    .table-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th { background: #f5f7ff; color: #1a237e; text-align: left; padding: 12px 16px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 14px 16px; border-bottom: 1px solid #f0f0f0; color: #333; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    small.muted { color: #aaa; font-size: 0.78rem; }
    .sem-badge { background: #f3e5f5; color: #6a1b9a; font-size: 0.78rem; padding: 3px 10px; border-radius: 12px; font-weight: 600; }
    .progress-wrap { display: flex; align-items: center; gap: 10px; }
    .progress-bar { flex: 1; height: 8px; background: #eee; border-radius: 4px; overflow: hidden; min-width: 80px; }
    .progress-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }
    .progress-fill.high   { background: #4caf50; }
    .progress-fill.medium { background: #ff9800; }
    .progress-fill.low    { background: #e53935; }
    .grade-badge { font-size: 0.85rem; font-weight: 700; padding: 4px 12px; border-radius: 8px; }
    .grade-badge.high   { background: #e8f5e9; color: #2e7d32; }
    .grade-badge.medium { background: #fff3e0; color: #e65100; }
    .grade-badge.low    { background: #ffebee; color: #c62828; }
    .s-val.high   { color: #69f0ae; }
    .s-val.medium { color: #ffd740; }
    .s-val.low    { color: #ff5252; }
    .empty { text-align: center; color: #aaa; padding: 40px; }
  `]
})
export class GradesComponent {
  students  = this.studentService.students;
  allGrades = this.studentService.grades;
  selectedStudentId = 0;

  filteredGrades = computed(() =>
    this.selectedStudentId === 0
      ? this.allGrades()
      : this.allGrades().filter(g => g.studentId === this.selectedStudentId)
  );

  selectedStudent = computed(() =>
    this.selectedStudentId
      ? this.studentService.getStudentById(this.selectedStudentId)
      : null
  );

  studentAvg = computed(() => {
    const gs = this.filteredGrades();
    if (!gs.length) return 0;
    return Math.round(gs.reduce((s, g) => s + this.pct(g), 0) / gs.length);
  });

  constructor(private studentService: StudentService) {}

  onStudentChange(id: number): void {
    this.selectedStudentId = Number(id);
  }

  pct(g: Grade): number { return Math.round((g.marks / g.maxMarks) * 100); }

  pctClass(p: number): string {
    if (p >= 75) return 'high';
    if (p >= 50) return 'medium';
    return 'low';
  }

  gradeClass(p: number): string { return this.pctClass(p); }

  letterGrade(p: number): string {
    if (p >= 90) return 'A+';
    if (p >= 80) return 'A';
    if (p >= 70) return 'B+';
    if (p >= 60) return 'B';
    if (p >= 50) return 'C';
    return 'F';
  }

  getStudentName(id: number): string { return this.studentService.getStudentById(id)?.name    ?? '—'; }
  getStudentRoll(id: number): string { return this.studentService.getStudentById(id)?.rollNumber ?? ''; }
  getCourseName(id: number):  string { return this.studentService.getCourseById(id)?.name     ?? '—'; }
  getCourseCode(id: number):  string { return this.studentService.getCourseById(id)?.code     ?? ''; }
}
