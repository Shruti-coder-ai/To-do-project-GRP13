import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard ensures that only authenticated users can access protected routes.
 * If unauthenticated, the user is redirected to the /login page.
 *
 * For Beginners:
 * - Functional route guards (`CanActivateFn`) are the modern standard in Angular.
 * - `inject(...)` allows dependency injection directly inside functional guards without creating class boilerplate.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Preserve redirect URL so user can return after login
  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
