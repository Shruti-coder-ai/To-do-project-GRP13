import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { guestGuard } from './guards/guest.guard';

/**
 * Application Routing Table
 *
 * For Beginners:
 * - Lazy loading (`loadComponent: () => import(...)`) ensures that each component's code
 *   is only fetched when the user actually visits that route, keeping initial bundle size minimal and fast.
 * - `canActivate`: route guards protect routes.
 *   - `guestGuard`: Prevents already-authenticated users from re-entering /login, /register, or /admin-login.
 *   - `authGuard`: Verifies that the user has an active session before accessing private routes.
 *   - `roleGuard('USER' | 'ADMIN')`: Enforces strict role-based authorization so normal users cannot access admin features.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then((m) => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'admin-login',
    loadComponent: () =>
      import('./components/admin/admin-login/admin-login.component').then(
        (m) => m.AdminLoginComponent
      ),
    canActivate: [guestGuard]
  },
  {
    path: 'admin/login',
    redirectTo: 'admin-login'
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then((m) => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'user/dashboard',
    loadComponent: () =>
      import('./components/user/user-dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
    canActivate: [authGuard, roleGuard('USER')]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./components/admin/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [authGuard, roleGuard('ADMIN')]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
