import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { guestGuard } from './guest.guard';
import { AuthService } from '../services/auth.service';

describe('guestGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    localStorage.clear();
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should allow unauthenticated guests to access login/register', () => {
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(true);
  });

  it('should redirect logged-in USER to /user/dashboard', async () => {
    await firstValueFrom(authService.login({ email: 'user@taskflow.dev', password: 'User@123' }));
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/user/dashboard');
  });

  it('should redirect logged-in ADMIN to /admin/dashboard', async () => {
    await firstValueFrom(authService.login({ email: 'admin@taskflow.dev', password: 'Admin@123' }));
    const result = TestBed.runInInjectionContext(() =>
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/admin/dashboard');
  });
});
