import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

/**
 * StudentsComponent provides a full CRUD interface for student records.
 * Includes live search, add/edit modal form, and delete with confirmation.
 */
@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page">
      <header class="page-header">
        <div>
          <h1>Students</h1>
          <p>{{ filtered().length }} of {{ allStudents().length }} students</p>
        </div>
        <button class="btn-primary" (click)="openModal()">+ Add Student</button>
      </header>

      <!-- Search Bar -->
      <div class="search-bar">
        <input
          type="text"
          placeholder="Search by name, roll number, or department…"
          [value]="searchQuery()"
          (input)="searchQuery.set($any($event.target).value)"
        />
      </div>

      <!-- Table -->
      <div class="table-card">
        <table>
          <thead>
            <tr>
              <th>Roll No.</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
              <th>Semester</th>
              <th>Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let s of filtered()">
              <td><code>{{ s.rollNumber }}</code></td>
              <td><strong>{{ s.name }}</strong></td>
              <td>{{ s.department }}</td>
              <td class="muted">{{ s.email }}</td>
              <td><span class="sem-badge">Sem {{ s.semester }}</span></td>
              <td><span class="badge">{{ s.enrolledCourses.length }}</span></td>
              <td>
                <button class="btn-icon edit"   (click)="openModal(s)">✏️</button>
                <button class="btn-icon delete" (click)="confirmDelete(s)">🗑️</button>
              </td>
            </tr>
            <tr *ngIf="filtered().length === 0">
              <td colspan="7" class="empty">No students found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Overlay -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>{{ editingStudent ? 'Edit Student' : 'Add New Student' }}</h2>
          <button class="close-btn" (click)="closeModal()">✕</button>
        </div>

        <form [formGroup]="studentForm" (ngSubmit)="saveStudent()" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label>Full Name *</label>
              <input formControlName="name" placeholder="e.g. Alex Johnson"
                     [class.error]="isInvalid('name')" />
              <span class="error-msg" *ngIf="isInvalid('name')">Name is required.</span>
            </div>
            <div class="form-group">
              <label>Email *</label>
              <input formControlName="email" placeholder="e.g. alex@edu.in"
                     [class.error]="isInvalid('email')" />
              <span class="error-msg" *ngIf="isInvalid('email')">Valid email required.</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Roll Number *</label>
              <input formControlName="rollNumber" placeholder="e.g. CS2024001"
                     [class.error]="isInvalid('rollNumber')" />
              <span class="error-msg" *ngIf="isInvalid('rollNumber')">Roll number required.</span>
            </div>
            <div class="form-group">
              <label>Department *</label>
              <select formControlName="department" [class.error]="isInvalid('department')">
                <option value="">Select department</option>
                <option *ngFor="let d of departments" [value]="d">{{ d }}</option>
              </select>
              <span class="error-msg" *ngIf="isInvalid('department')">Department required.</span>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Semester *</label>
              <select formControlName="semester">
                <option *ngFor="let s of [1,2,3,4,5,6,7,8]" [value]="s">Semester {{ s }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Join Date *</label>
              <input type="date" formControlName="joinDate" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn-secondary" (click)="closeModal()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="studentForm.invalid">
              {{ editingStudent ? 'Save Changes' : 'Add Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm -->
    <div class="modal-overlay" *ngIf="deleteTarget" (click)="deleteTarget = null">
      <div class="modal modal-sm" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2>Delete Student</h2>
          <button class="close-btn" (click)="deleteTarget = null">✕</button>
        </div>
        <p>Are you sure you want to delete <strong>{{ deleteTarget?.name }}</strong>? This will also remove their grade records.</p>
        <div class="modal-footer">
          <button class="btn-secondary" (click)="deleteTarget = null">Cancel</button>
          <button class="btn-danger" (click)="deleteStudent()">Delete</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
    .page-header h1 { font-size: 1.6rem; color: #1a237e; margin: 0 0 4px; }
    .page-header p  { color: #888; margin: 0; font-size: 0.875rem; }
    .search-bar { margin-bottom: 20px; }
    .search-bar input {
      width: 100%;
      max-width: 400px;
      padding: 10px 16px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
    }
    .search-bar input:focus { border-color: #3949ab; }
    .table-card { background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th { background: #f5f7ff; color: #1a237e; text-align: left; padding: 12px 16px; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.5px; }
    td { padding: 13px 16px; border-bottom: 1px solid #f0f0f0; color: #333; }
    tr:last-child td { border-bottom: none; }
    .muted { color: #888; font-size: 0.85rem; }
    code { background: #e8eaf6; color: #1a237e; padding: 2px 6px; border-radius: 4px; font-size: 0.82rem; }
    .badge { background: #e3f2fd; color: #1565c0; font-size: 0.78rem; padding: 3px 10px; border-radius: 12px; font-weight: 600; }
    .sem-badge { background: #f3e5f5; color: #6a1b9a; font-size: 0.78rem; padding: 3px 10px; border-radius: 12px; font-weight: 600; }
    .empty { text-align: center; color: #aaa; padding: 40px; }
    .btn-icon { background: none; border: none; cursor: pointer; font-size: 1rem; padding: 4px 6px; border-radius: 6px; transition: background 0.15s; }
    .btn-icon:hover { background: #f0f0f0; }
    .btn-primary { background: #1a237e; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: background 0.2s; }
    .btn-primary:hover:not(:disabled) { background: #283593; }
    .btn-primary:disabled { background: #9fa8da; cursor: not-allowed; }
    .btn-secondary { background: #f0f0f0; color: #333; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
    .btn-danger { background: #e53935; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 0.9rem; font-weight: 600; cursor: pointer; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 200; padding: 16px; }
    .modal { background: #fff; border-radius: 16px; padding: 28px; width: 100%; max-width: 560px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    .modal-sm { max-width: 400px; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .modal-header h2 { font-size: 1.2rem; color: #1a237e; margin: 0; }
    .close-btn { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #888; padding: 4px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-size: 0.83rem; font-weight: 600; color: #444; margin-bottom: 5px; }
    input, select {
      width: 100%;
      padding: 9px 12px;
      border: 1.5px solid #ddd;
      border-radius: 7px;
      font-size: 0.9rem;
      box-sizing: border-box;
      outline: none;
      background: #fff;
    }
    input:focus, select:focus { border-color: #3949ab; }
    input.error, select.error { border-color: #e53935; }
    .error-msg { color: #e53935; font-size: 0.76rem; margin-top: 3px; display: block; }
    .modal-footer { display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px; }
    .modal p { color: #555; margin: 0 0 16px; }
  `]
})
export class StudentsComponent {
  allStudents  = this.studentService.students;
  searchQuery  = signal('');
  showModal    = false;
  editingStudent: Student | null = null;
  deleteTarget:   Student | null = null;
  studentForm!: FormGroup;

  readonly departments = [
    'Computer Science', 'Information Tech', 'Electronics', 'Mechanical', 'Civil', 'Chemical'
  ];

  /** Filtered list based on search query */
  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.allStudents();
    return this.allStudents().filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.rollNumber.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  });

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {}

  openModal(student?: Student): void {
    this.editingStudent = student ?? null;
    this.studentForm = this.fb.group({
      name:        [student?.name        ?? '', Validators.required],
      email:       [student?.email       ?? '', [Validators.required, Validators.email]],
      rollNumber:  [student?.rollNumber  ?? '', Validators.required],
      department:  [student?.department  ?? '', Validators.required],
      semester:    [student?.semester    ?? 1],
      joinDate:    [student?.joinDate    ?? new Date().toISOString().split('T')[0]]
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingStudent = null;
  }

  isInvalid(field: string): boolean {
    const c = this.studentForm.get(field);
    return !!(c && c.invalid && c.touched);
  }

  saveStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }
    const value = this.studentForm.value;
    if (this.editingStudent) {
      this.studentService.updateStudent({
        ...this.editingStudent,
        ...value,
        semester: Number(value.semester)
      });
    } else {
      this.studentService.addStudent({ ...value, semester: Number(value.semester), enrolledCourses: [] });
    }
    this.closeModal();
  }

  confirmDelete(student: Student): void {
    this.deleteTarget = student;
  }

  deleteStudent(): void {
    if (this.deleteTarget) {
      this.studentService.deleteStudent(this.deleteTarget.id);
      this.deleteTarget = null;
    }
  }
}
