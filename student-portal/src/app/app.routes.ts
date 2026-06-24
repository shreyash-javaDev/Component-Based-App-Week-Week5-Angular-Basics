import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'students',
    loadComponent: () =>
      import('./components/students/students.component').then(m => m.StudentsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'courses',
    loadComponent: () =>
      import('./components/courses/courses.component').then(m => m.CoursesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'grades',
    loadComponent: () =>
      import('./components/grades/grades.component').then(m => m.GradesComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
