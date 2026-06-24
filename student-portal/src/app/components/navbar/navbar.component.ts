import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

/**
 * Top navigation bar component.
 * Displays nav links and current user info with logout action.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <div class="nav-brand">
        <span class="brand-icon">🎓</span>
        <span class="brand-name">StudentPortal</span>
      </div>

      <ul class="nav-links">
        <li>
          <a routerLink="/dashboard" routerLinkActive="active">
            <span class="nav-icon">⊞</span> Dashboard
          </a>
        </li>
        <li>
          <a routerLink="/students" routerLinkActive="active">
            <span class="nav-icon">👥</span> Students
          </a>
        </li>
        <li>
          <a routerLink="/courses" routerLinkActive="active">
            <span class="nav-icon">📚</span> Courses
          </a>
        </li>
        <li>
          <a routerLink="/grades" routerLinkActive="active">
            <span class="nav-icon">📊</span> Grades
          </a>
        </li>
      </ul>

      <div class="nav-user">
        <span class="user-name">{{ authService.getUser()?.name }}</span>
        <span class="user-role">{{ authService.getUser()?.role }}</span>
        <button class="logout-btn" (click)="authService.logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      height: 64px;
      background: #1a237e;
      display: flex;
      align-items: center;
      padding: 0 24px;
      gap: 32px;
      z-index: 100;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      font-size: 1.2rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      white-space: nowrap;
    }
    .brand-icon { font-size: 1.5rem; }
    .nav-links {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
      gap: 4px;
      flex: 1;
    }
    .nav-links a {
      display: flex;
      align-items: center;
      gap: 6px;
      color: rgba(255,255,255,0.75);
      text-decoration: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      background: rgba(255,255,255,0.15);
      color: #fff;
    }
    .nav-icon { font-size: 1rem; }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-left: auto;
    }
    .user-name {
      color: #fff;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .user-role {
      color: rgba(255,255,255,0.6);
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(255,255,255,0.1);
      padding: 2px 8px;
      border-radius: 12px;
    }
    .logout-btn {
      background: rgba(255,255,255,0.15);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .logout-btn:hover {
      background: #e53935;
      border-color: #e53935;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService) {}
}
