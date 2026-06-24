import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';

/**
 * CoursesComponent displays all available courses in a card grid layout.
 */
@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Courses</h1>
          <p>{{ courses().length }} courses available</p>
        </div>
      </header>

      <div class="courses-grid">
        <div class="course-card" *ngFor="let c of courses()">
          <div class="course-header">
            <span class="course-code">{{ c.code }}</span>
            <span class="credits-badge">{{ c.credits }} credits</span>
          </div>
          <h3>{{ c.name }}</h3>
          <p class="instructor">👨‍🏫 {{ c.instructor }}</p>
          <div class="course-meta">
            <span class="dept-tag">{{ c.department }}</span>
            <span class="students-count">👥 {{ c.totalStudents }} students</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { margin-bottom: 28px; }
    .page-header h1 { font-size: 1.6rem; color: #1a237e; margin: 0 0 4px; }
    .page-header p  { color: #888; margin: 0; font-size: 0.875rem; }
    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }
    .course-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      border-top: 4px solid #1a237e;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .course-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 20px rgba(26,35,126,0.12);
    }
    .course-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .course-code { font-family: monospace; font-size: 0.85rem; background: #e8eaf6; color: #1a237e; padding: 3px 10px; border-radius: 6px; font-weight: 700; }
    .credits-badge { background: #fff3e0; color: #e65100; font-size: 0.78rem; padding: 3px 10px; border-radius: 12px; font-weight: 600; }
    h3 { font-size: 1rem; color: #1a237e; margin: 0 0 8px; font-weight: 600; line-height: 1.4; }
    .instructor { color: #555; font-size: 0.875rem; margin: 0 0 16px; }
    .course-meta { display: flex; justify-content: space-between; align-items: center; }
    .dept-tag { background: #e8f5e9; color: #2e7d32; font-size: 0.75rem; padding: 3px 10px; border-radius: 12px; font-weight: 600; }
    .students-count { color: #888; font-size: 0.82rem; }
  `]
})
export class CoursesComponent {
  courses = this.studentService.courses;
  constructor(private studentService: StudentService) {}
}
