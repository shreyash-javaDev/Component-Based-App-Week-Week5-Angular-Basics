import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';
import { AuthService } from '../../services/auth.service';

/**
 * DashboardComponent shows a summary of the portal:
 * total students, courses, grades, and average marks.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Welcome back, {{ authService.getUser()?.name }} 👋</h1>
          <p>Here's a snapshot of the student portal today.</p>
        </div>
      </header>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card blue">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalStudents }}</span>
            <span class="stat-label">Total Students</span>
          </div>
        </div>
        <div class="stat-card green">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalCourses }}</span>
            <span class="stat-label">Active Courses</span>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalGrades }}</span>
            <span class="stat-label">Grade Records</span>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.avgMarks }}%</span>
            <span class="stat-label">Average Score</span>
          </div>
        </div>
      </div>

      <!-- Recent Students -->
      <section class="section">
        <div class="section-header">
          <h2>Recent Students</h2>
          <a routerLink="/students" class="view-all">View All →</a>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No.</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Courses</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of recentStudents">
                <td><strong>{{ s.name }}</strong></td>
                <td><code>{{ s.rollNumber }}</code></td>
                <td>{{ s.department }}</td>
                <td>Sem {{ s.semester }}</td>
                <td>
                  <span class="badge">{{ s.enrolledCourses.length }} enrolled</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Quick Links -->
      <section class="section">
        <h2>Quick Actions</h2>
        <div class="quick-links">
          <a routerLink="/students" class="quick-card">
            <span>👥</span> Manage Students
          </a>
          <a routerLink="/courses" class="quick-card">
            <span>📚</span> Browse Courses
          </a>
          <a routerLink="/grades" class="quick-card">
            <span>📊</span> View Grades
          </a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 1.6rem; color: #1a237e; margin: 0 0 4px; }
    .page-header p  { color: #666; margin: 0; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 36px;
    }
    .stat-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-left: 4px solid transparent;
    }
    .stat-card.blue   { border-color: #1a237e; }
    .stat-card.green  { border-color: #2e7d32; }
    .stat-card.orange { border-color: #e65100; }
    .stat-card.purple { border-color: #6a1b9a; }
    .stat-icon { font-size: 2rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 1.8rem; font-weight: 700; color: #222; line-height: 1; }
    .stat-label { font-size: 0.82rem; color: #888; margin-top: 4px; }

    .section { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .section h2 { font-size: 1.1rem; color: #1a237e; margin: 0 0 16px; }
    .section-header h2 { margin: 0; }
    .view-all { color: #3949ab; text-decoration: none; font-size: 0.875rem; font-weight: 600; }
    .view-all:hover { text-decoration: underline; }

    .table-wrap { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th { background: #f5f7ff; color: #1a237e; text-align: left; padding: 10px 14px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 12px 14px; border-bottom: 1px solid #f0f0f0; color: #333; }
    tr:last-child td { border-bottom: none; }
    code { background: #e8eaf6; color: #1a237e; padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; }
    .badge { background: #e8f5e9; color: #2e7d32; font-size: 0.78rem; padding: 3px 10px; border-radius: 12px; font-weight: 600; }

    .quick-links { display: flex; gap: 16px; flex-wrap: wrap; }
    .quick-card {
      flex: 1;
      min-width: 140px;
      background: #f5f7ff;
      border: 1.5px solid #c5cae9;
      border-radius: 10px;
      padding: 18px;
      text-align: center;
      text-decoration: none;
      color: #1a237e;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .quick-card:hover { background: #1a237e; color: #fff; border-color: #1a237e; }
  `]
})
export class DashboardComponent {
  stats = this.studentService.stats();
  recentStudents = this.studentService.students().slice(0, 4);

  constructor(
    private studentService: StudentService,
    public authService: AuthService
  ) {}
}
