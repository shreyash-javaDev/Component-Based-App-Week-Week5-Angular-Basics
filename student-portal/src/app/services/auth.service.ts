import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/student.model';

/**
 * AuthService handles authentication state.
 * Stores the current user in a signal and persists session in sessionStorage.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);

  // Mock credentials for demo purposes
  private readonly MOCK_USERS: { username: string; password: string; user: User }[] = [
    {
      username: 'admin',
      password: 'admin123',
      user: { id: 1, username: 'admin', role: 'admin', name: 'Dr. Admin' }
    },
    {
      username: 'student',
      password: 'student123',
      user: { id: 2, username: 'student', role: 'student', name: 'Alex Johnson' }
    }
  ];

  constructor(private router: Router) {
    // Restore session if available
    const stored = sessionStorage.getItem('sp_user');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  /**
   * Attempts login with provided credentials.
   * @returns true if login succeeded, false otherwise
   */
  login(username: string, password: string): boolean {
    const match = this.MOCK_USERS.find(
      u => u.username === username && u.password === password
    );
    if (match) {
      this.currentUser.set(match.user);
      sessionStorage.setItem('sp_user', JSON.stringify(match.user));
      return true;
    }
    return false;
  }

  /** Clears the session and redirects to login. */
  logout(): void {
    this.currentUser.set(null);
    sessionStorage.removeItem('sp_user');
    this.router.navigate(['/login']);
  }

  /** Returns whether a user is currently logged in. */
  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  /** Returns the currently logged-in user, or null. */
  getUser(): User | null {
    return this.currentUser();
  }
}
