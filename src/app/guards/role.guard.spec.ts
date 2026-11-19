import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
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

  it('should redirect unauthenticated users to /login', () => {
    const guardFn = roleGuard('USER');
    const result = TestBed.runInInjectionContext(() =>
      guardFn({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('should redirect USER trying to access ADMIN route to /user/dashboard', async () => {
    await firstValueFrom(authService.login({ email: 'user@taskflow.dev', password: 'User@123' }));
    const adminGuard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() =>
      adminGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/user/dashboard');
  });

  it('should redirect ADMIN trying to access USER route to /admin/dashboard', async () => {
    await firstValueFrom(authService.login({ email: 'admin@taskflow.dev', password: 'Admin@123' }));
    const userGuard = roleGuard('USER');
    const result = TestBed.runInInjectionContext(() =>
      userGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result instanceof UrlTree).toBe(true);
    expect((result as UrlTree).toString()).toBe('/admin/dashboard');
  });

  it('should grant access when user role matches expected role', async () => {
    await firstValueFrom(authService.login({ email: 'user@taskflow.dev', password: 'User@123' }));
    const userGuard = roleGuard('USER');
    const result = TestBed.runInInjectionContext(() =>
      userGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBe(true);
  });
});
