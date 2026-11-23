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
  private readonly USERS_DB_KEY = 'taskflow_auth_users_db';

  // Reactive state using Angular Signals
  private currentUserSignal = signal<User | null>(this.loadUserFromStorage());

  // Public read-only signals for components to consume
  public readonly currentUser = this.currentUserSignal.asReadonly();
  public readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  public readonly userRole = computed(() => this.currentUserSignal()?.role || null);
  public readonly isAdmin = computed(() => this.currentUserSignal()?.role === 'ADMIN');
  public readonly isUser = computed(() => this.currentUserSignal()?.role === 'USER');

  // Stored users getter for backward compatibility
  private get DEMO_USERS(): (User & { passwordHash: string })[] {
    return this.getStoredUsers();
  }

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
    const users = this.getStoredUsers();

    // Check if account status was modified in admin user management
    let isDeactivated = false;
    try {
      const adminUsersRaw = localStorage.getItem('taskflow_admin_users');
      if (adminUsersRaw) {
        const adminUsers: User[] = JSON.parse(adminUsersRaw);
        const match = adminUsers.find((u) => u.email.toLowerCase() === credentials.email.toLowerCase());
        if (match && match.status === 'INACTIVE') {
          isDeactivated = true;
        }
      }
    } catch {}

    const found = users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase() && u.passwordHash === credentials.password
    );

    if (!found) {
      return throwError(() => new Error('Invalid email or password. Please verify your credentials.'));
    }

    if (found.status === 'INACTIVE' || isDeactivated) {
      return throwError(() => new Error('Your account has been deactivated by an Administrator.'));
    }

    const { passwordHash, ...user } = found;
    if (isDeactivated) {
      user.status = 'INACTIVE';
    }

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
    const users = this.getStoredUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === data.email.toLowerCase());

    let userToReturn: User;

    if (existingIndex >= 0) {
      // If user is registering with default seed account (e.g. Shruti Naik), update password and name
      if (users[existingIndex].id === 'usr-shruti') {
        users[existingIndex].name = data.name;
        users[existingIndex].passwordHash = data.password;
        this.saveStoredUsers(users);
        const { passwordHash, ...user } = users[existingIndex];
        userToReturn = user;
      } else {
        return throwError(() => new Error('An account with this email already exists.'));
      }
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: 'USER', // Always 'USER' for public signups
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };

      users.push({ ...newUser, passwordHash: data.password });
      this.saveStoredUsers(users);
      userToReturn = newUser;
    }

    // Synchronize newly created user with UserService admin store
    try {
      const adminUsersRaw = localStorage.getItem('taskflow_admin_users');
      let adminUsers: User[] = adminUsersRaw ? JSON.parse(adminUsersRaw) : [];
      const adminIdx = adminUsers.findIndex((u) => u.email.toLowerCase() === userToReturn.email.toLowerCase());
      if (adminIdx >= 0) {
        adminUsers[adminIdx].name = userToReturn.name;
        adminUsers[adminIdx].status = 'ACTIVE';
      } else {
        adminUsers.push(userToReturn);
      }
      localStorage.setItem('taskflow_admin_users', JSON.stringify(adminUsers));
    } catch {}

    const response: AuthResponse = {
      token: `mock-jwt-token-${userToReturn.id}-${Date.now()}`,
      user: userToReturn,
      message: 'Account created successfully!'
    };

    return of(response).pipe(delay(600));
  }

  // --- Stored Users Persistence (survives page refresh) ---

  private getStoredUsers(): (User & { passwordHash: string })[] {
    const defaultAccounts: (User & { passwordHash: string })[] = [
      {
        id: 'adm-shruti',
        name: 'angrevyas',
        email: 'angrevyas@gmail.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        passwordHash: 'Angre@123',
        createdAt: '2026-11-01T09:00:00.000Z'
      },
      {
        id: 'adm-demo',
        name: 'Demo Administrator',
        email: 'admin@taskflow.dev',
        role: 'ADMIN',
        status: 'ACTIVE',
        passwordHash: 'Admin@123',
        createdAt: '2026-10-15T08:00:00.000Z'
      },
      {
        id: 'usr-demo',
        name: 'Demo User',
        email: 'user@taskflow.dev',
        role: 'USER',
        status: 'ACTIVE',
        passwordHash: 'User@123',
        createdAt: '2026-11-05T11:20:00.000Z'
      },
      {
        id: 'usr-shruti',
        name: 'Shruti Naik',
        email: 'naikshruti015@gmail.com',
        role: 'USER',
        status: 'ACTIVE',
        passwordHash: 'Shruti@123',
        createdAt: '2026-11-19T10:00:00.000Z'
      }
    ];

    try {
      const saved = localStorage.getItem(this.USERS_DB_KEY);
      if (!saved) {
        localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(defaultAccounts));
        return defaultAccounts;
      }
      const users: (User & { passwordHash: string })[] = JSON.parse(saved);
      // Ensure default accounts exist
      for (const def of defaultAccounts) {
        const idx = users.findIndex((u) => u.email.toLowerCase() === def.email.toLowerCase());
        if (idx === -1) {
          users.push(def);
        } else if (def.email.toLowerCase() === 'angrevyas@gmail.com') {
          users[idx].name = 'angrevyas';
        }
      }
      return users;
    } catch {
      return defaultAccounts;
    }
  }

  private saveStoredUsers(users: (User & { passwordHash: string })[]): void {
    try {
      localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users database to localStorage', e);
    }
  }
}
