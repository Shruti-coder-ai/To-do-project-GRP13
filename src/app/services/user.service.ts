import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User, UserStatus } from '../models/user.model';

/**
 * UserService manages registered user accounts (Admin operations).
 *
 * For Beginners:
 * - Admins can view all registered users and toggle account status (Active / Inactive).
 * - Deactivated users are blocked from logging into the platform.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_STORAGE_KEY = 'taskflow_admin_users';

  // Master reactive users list
  private usersSignal = signal<User[]>(this.initializeUsers());

  // Public readonly users
  public readonly users = this.usersSignal.asReadonly();

  // Summary statistics
  public readonly totalUsers = computed(() => this.usersSignal().length);
  public readonly activeUsers = computed(() => this.usersSignal().filter((u) => u.status === 'ACTIVE').length);
  public readonly inactiveUsers = computed(() => this.usersSignal().filter((u) => u.status === 'INACTIVE').length);

  constructor(private http: HttpClient) {}

  /**
   * Fetch all registered users for Admin table
   */
  getUsers(): Observable<User[]> {
    if (environment.useMockData) {
      return of(this.usersSignal()).pipe(delay(250));
    }
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users`).pipe(
      tap((users) => this.usersSignal.set(users))
    );
  }

  /**
   * Toggle user account status (Activate / Deactivate)
   */
  toggleUserStatus(userId: string): Observable<User> {
    const current = this.usersSignal().find((u) => u.id === userId);
    if (!current) {
      return throwError(() => new Error('User not found.'));
    }

    const nextStatus: UserStatus = current.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

    if (environment.useMockData) {
      let updatedUser: User | null = null;
      this.usersSignal.update((users) =>
        users.map((u) => {
          if (u.id === userId) {
            updatedUser = { ...u, status: nextStatus, updatedAt: new Date().toISOString() };
            return updatedUser;
          }
          return u;
        })
      );
      this.persistUsers();

      // Sync status with auth users database in localStorage
      try {
        const authDbRaw = localStorage.getItem('taskflow_auth_users_db');
        if (authDbRaw) {
          const authUsers = JSON.parse(authDbRaw);
          const idx = authUsers.findIndex(
            (u: any) => u.id === userId || (updatedUser && u.email?.toLowerCase() === (updatedUser as User).email?.toLowerCase())
          );
          if (idx >= 0) {
            authUsers[idx].status = nextStatus;
            localStorage.setItem('taskflow_auth_users_db', JSON.stringify(authUsers));
          }
        }
      } catch {}

      return of(updatedUser!).pipe(delay(300));
    }

    return this.http.patch<User>(`${environment.apiUrl}/admin/users/${userId}/status`, { status: nextStatus }).pipe(
      tap((updated) => {
        this.usersSignal.update((users) => users.map((u) => (u.id === userId ? updated : u)));
      })
    );
  }

  // --- Mock Store Initialization ---

  private initializeUsers(): User[] {
    let users: User[] = [];
    const saved = localStorage.getItem(this.USERS_STORAGE_KEY);
    if (saved) {
      try {
        users = JSON.parse(saved);
      } catch {
        users = [];
      }
    }

    if (!users || users.length === 0) {
      users = [
        {
          id: 'adm-shruti',
          name: 'angrevyas',
          email: 'angrevyas@gmail.com',
          role: 'ADMIN',
          status: 'ACTIVE',
          createdAt: '2026-11-01T09:00:00.000Z'
        },
        {
          id: 'adm-demo',
          name: 'Demo Administrator',
          email: 'admin@taskflow.dev',
          role: 'ADMIN',
          status: 'ACTIVE',
          createdAt: '2026-10-15T08:00:00.000Z'
        },
        {
          id: 'usr-demo',
          name: 'Demo User',
          email: 'user@taskflow.dev',
          role: 'USER',
          status: 'ACTIVE',
          createdAt: '2026-11-05T11:20:00.000Z'
        },
        {
          id: 'usr-shruti',
          name: 'Shruti Naik',
          email: 'naikshruti015@gmail.com',
          role: 'USER',
          status: 'ACTIVE',
          createdAt: '2026-11-19T10:00:00.000Z'
        },
        {
          id: 'usr-3',
          name: 'Rohan Verma',
          email: 'rohan.v@taskflow.dev',
          role: 'USER',
          status: 'ACTIVE',
          createdAt: '2026-11-10T14:45:00.000Z'
        },
        {
          id: 'usr-4',
          name: 'Priya Patel',
          email: 'priya.p@taskflow.dev',
          role: 'USER',
          status: 'INACTIVE',
          createdAt: '2026-11-12T16:10:00.000Z'
        }
      ];
    }

    // Ensure angrevyas@gmail.com admin account is present with name angrevyas
    const adminIndex = users.findIndex((u) => u.email.toLowerCase() === 'angrevyas@gmail.com');
    if (adminIndex >= 0) {
      if (users[adminIndex].name !== 'angrevyas') {
        users[adminIndex].name = 'angrevyas';
      }
    } else {
      users.unshift({
        id: 'adm-shruti',
        name: 'angrevyas',
        email: 'angrevyas@gmail.com',
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: '2026-11-01T09:00:00.000Z'
      });
    }

    // Ensure Shruti Naik user account is present
    const shrutiIndex = users.findIndex((u) => u.email.toLowerCase() === 'naikshruti015@gmail.com');
    if (shrutiIndex === -1) {
      users.push({
        id: 'usr-shruti',
        name: 'Shruti Naik',
        email: 'naikshruti015@gmail.com',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: '2026-11-19T10:00:00.000Z'
      });
    }

    // Merge any registered accounts from taskflow_auth_users_db
    try {
      const authDbRaw = localStorage.getItem('taskflow_auth_users_db');
      if (authDbRaw) {
        const authUsers: any[] = JSON.parse(authDbRaw);
        for (const au of authUsers) {
          if (!users.some((u) => u.email.toLowerCase() === au.email.toLowerCase())) {
            const { passwordHash, ...cleanUser } = au;
            users.push(cleanUser);
          }
        }
      }
    } catch {}

    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(users));
    return users;
  }

  private persistUsers(): void {
    localStorage.setItem(this.USERS_STORAGE_KEY, JSON.stringify(this.usersSignal()));
  }
}
