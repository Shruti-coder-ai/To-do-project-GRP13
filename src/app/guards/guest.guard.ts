import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * GuestGuard prevents authenticated users from accessing public authentication pages (Login, Register).
 *
 * For Beginners:
 * - If a user is already logged in, visiting `/login` or `/register` automatically redirects them
 *   directly to their respective dashboard instead of showing the login form again.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const role = authService.userRole();
    if (role === 'ADMIN') {
      return router.createUrlTree(['/admin/dashboard']);
    }
    return router.createUrlTree(['/user/dashboard']);
  }

  return true;
};
