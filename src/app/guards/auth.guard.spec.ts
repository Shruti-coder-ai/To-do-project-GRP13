import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
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

  it('should redirect unauthenticated users to /login with returnUrl', () => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = { url: '/user/dashboard' } as RouterStateSnapshot;

    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));

    expect(result instanceof UrlTree).toBe(true);
    const urlTree = result as UrlTree;
    expect(urlTree.toString()).toContain('/login');
    expect(urlTree.queryParams['returnUrl']).toBe('/user/dashboard');
  });

  it('should allow access if user is authenticated', async () => {
    const mockRoute = {} as ActivatedRouteSnapshot;
    const mockState = { url: '/user/dashboard' } as RouterStateSnapshot;

    await firstValueFrom(authService.login({ email: 'user@taskflow.dev', password: 'User@123' }));
    const result = TestBed.runInInjectionContext(() => authGuard(mockRoute, mockState));
    expect(result).toBe(true);
  });
});
