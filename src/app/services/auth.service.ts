import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserRole, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

/**
 * AuthService handles user authentication, session state, and role checks.
 *
 * For Beginners:
 * - Angular Signals (`signal`, `computed`) provide a modern, reactive way to track state without complex RxJS subscriptions.
 * - This service includes a local mock database for offline/local development, but is structured so it can connect to the
 *   Fastify Node.js backend endpoints (`/api/auth/login`, `/api/auth/register`) simply by toggling `environment.useMockData = false`.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'taskflow_auth_token';
  private readonly USER_KEY = 'taskflow_auth_user';

  // Reactive state using Angular Signals
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  // Public read-only signals for components to consume
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  public readonly userRole = computed(() => this.currentUserSignal()?.role || null);
  public readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  public readonly isUser = computed(() => this.currentUserSignal()?.role === 'USER');

  // Demo accounts for local development
  private readonly DEMO_USERS: (User & { passwordHash: string })[] = [
    {
      id: 'adm-shruti',
      name: 'angrevyas',
      email: 'angrevyas@gmail.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash: 'Angre@123',
      createdAt: new Date().toISOString()
    },
    {
      id: 'adm-demo',
      name: 'Demo Administrator',
      email: 'admin@taskflow.dev',
      role: 'ADMIN',
      status: 'ACTIVE',
      passwordHash: 'Admin@123',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-demo',
      name: 'Demo User',
      email: 'user@taskflow.dev',
      role: 'USER',
      status: 'ACTIVE',
      passwordHash: 'User@123',
      createdAt: new Date().toISOString()
    }
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Log in user with email & password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (environment.useMockData) {
      return this.mockLogin(credentials);
    }
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap((response) => this.handleAuthSuccess(response))
    );
  }

  /**
   * Register a new user
   * Role is strictly forced to 'USER' - public registration cannot create Admin accounts.
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    if (environment.useMockData) {
      return this.mockRegister(data);
    }
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, {
      name: data.name,
      email: data.email,
      password: data.password
    }).pipe(
      tap((response) => this.handleAuthSuccess(response))
    );
  }

  /**
   * Log out the current user and navigate to the login page
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Retrieves current auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // --- Private Helper Methods ---

  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSignal.set(response.user);
  }

  private loadUserFromStorage(): User | null {
    try {
      const data = localStorage.getItem(this.USER_KEY);
      if (!data) return null;
      const user: User = JSON.parse(data);
      if (user && user.email?.toLowerCase() === 'angrevyas@gmail.com' && user.name !== 'angrevyas') {
        user.name = 'angrevyas';
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      }
      return user;
    } catch {
      return null;
    }
  }

  private mockLogin(credentials: LoginRequest): Observable<AuthResponse> {
    const found = this.DEMO_USERS.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.passwordHash === credentials.password
    );

    if (!found) {
      return throwError(() => new Error('Invalid email or password. Please verify your credentials.'));
    }

    if (found.status === 'INACTIVE') {
      return throwError(() => new Error('Your account has been deactivated by an Administrator.'));
    }

    const { passwordHash, ...user } = found;
    const response: AuthResponse = {
      token: `mock-jwt-token-${user.id}-${Date.now()}`,
      user
    };

    return of(response).pipe(
      delay(500),
      tap((res) => this.handleAuthSuccess(res))
    );
  }

  private mockRegister(data: RegisterRequest): Observable<AuthResponse> {
    const existing = this.DEMO_USERS.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return throwError(() => new Error('An account with this email already exists.'));
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'USER', // Always 'USER' for public signups
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    this.DEMO_USERS.push({ ...newUser, passwordHash: data.password });

    const response: AuthResponse = {
      token: `mock-jwt-token-${newUser.id}-${Date.now()}`,
      user: newUser,
      message: 'Account created successfully!'
    };

    return of(response).pipe(delay(600));
  }
}
