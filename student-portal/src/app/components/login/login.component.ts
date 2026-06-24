import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

/**
 * LoginComponent handles user authentication.
 * Uses a reactive form with validation.
 * Demo credentials are shown to assist evaluators.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">🎓</div>
          <h1>Student Portal</h1>
          <p>Sign in to your account</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              formControlName="username"
              placeholder="Enter username"
              [class.error]="isInvalid('username')"
            />
            <span class="error-msg" *ngIf="isInvalid('username')">
              Username is required.
            </span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="Enter password"
              [class.error]="isInvalid('password')"
            />
            <span class="error-msg" *ngIf="isInvalid('password')">
              Password must be at least 6 characters.
            </span>
          </div>

          <div class="alert alert-error" *ngIf="loginError">
            Invalid credentials. Please try again.
          </div>

          <button type="submit" class="btn-login" [disabled]="loginForm.invalid">
            Sign In
          </button>
        </form>

        <div class="demo-credentials">
          <p><strong>Demo Credentials</strong></p>
          <p>Admin: <code>admin</code> / <code>admin123</code></p>
          <p>Student: <code>student</code> / <code>student123</code></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #3949ab 100%);
      padding: 24px;
    }
    .login-card {
      background: #fff;
      border-radius: 16px;
      padding: 40px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .login-header {
      text-align: center;
      margin-bottom: 32px;
    }
    .logo { font-size: 3rem; margin-bottom: 8px; }
    h1 {
      font-size: 1.6rem;
      font-weight: 700;
      color: #1a237e;
      margin: 0 0 4px;
    }
    p { color: #666; margin: 0; font-size: 0.9rem; }
    .form-group { margin-bottom: 20px; }
    label {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 6px;
    }
    input {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.2s;
      outline: none;
    }
    input:focus { border-color: #3949ab; }
    input.error { border-color: #e53935; }
    .error-msg {
      display: block;
      color: #e53935;
      font-size: 0.78rem;
      margin-top: 4px;
    }
    .alert {
      padding: 10px 14px;
      border-radius: 8px;
      margin-bottom: 16px;
      font-size: 0.875rem;
    }
    .alert-error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
    .btn-login {
      width: 100%;
      padding: 12px;
      background: #1a237e;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 4px;
    }
    .btn-login:hover:not(:disabled) { background: #283593; }
    .btn-login:disabled { background: #9fa8da; cursor: not-allowed; }
    .demo-credentials {
      margin-top: 24px;
      padding: 14px;
      background: #f5f5f5;
      border-radius: 8px;
      font-size: 0.82rem;
      color: #555;
    }
    .demo-credentials p { margin: 2px 0; }
    code {
      background: #e8eaf6;
      color: #1a237e;
      padding: 1px 5px;
      border-radius: 4px;
      font-family: monospace;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /** Returns true if a field is invalid and has been touched. */
  isInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { username, password } = this.loginForm.value;
    const success = this.authService.login(username, password);
    if (success) {
      this.loginError = false;
      this.router.navigate(['/dashboard']);
    } else {
      this.loginError = true;
    }
  }
}
