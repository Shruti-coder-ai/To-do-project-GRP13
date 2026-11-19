import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

/**
 * RoleGuard restricts routes to specific user roles ('USER' or 'ADMIN').
 *
 * For Beginners:
 * - This is a higher-order function that takes an `expectedRole` and returns a `CanActivateFn`.
 * - If a normal user tries to navigate to `/admin/dashboard`, they are politely redirected to `/user/dashboard`.
 * - If an admin navigates to `/user/dashboard`, they are redirected to `/admin/dashboard`.
 * - If an unauthenticated user attempts access, they are redirected to `/login`.
 */
export const roleGuard = (expectedRole: UserRole): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    const currentRole = authService.userRole();

    if (currentRole === expectedRole) {
      return true;
    }

    // Role mismatch: redirect to the appropriate dashboard
    if (currentRole === 'ADMIN') {
      return router.createUrlTree(['/admin/dashboard']);
    }

    return router.createUrlTree(['/user/dashboard']);
  };
};
