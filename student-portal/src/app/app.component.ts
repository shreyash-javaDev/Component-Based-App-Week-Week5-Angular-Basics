import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

/**
 * Root application component.
 * Hosts the navbar (when authenticated) and the router outlet.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  template: `
    <app-navbar *ngIf="authService.isLoggedIn()"></app-navbar>
    <main [class.with-nav]="authService.isLoggedIn()">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    main {
      min-height: 100vh;
      background: #f0f4f8;
    }
    main.with-nav {
      padding-top: 64px;
    }
  `]
})
export class AppComponent {
  title = 'student-portal';
  constructor(public authService: AuthService) {}
}
