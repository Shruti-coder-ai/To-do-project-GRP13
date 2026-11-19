/**
 * User Role Definition
 * The application has two strict roles:
 * - USER: Standard end-user with personal task management
 * - ADMIN: Platform administrator with user management & global analytics
 */
export type UserRole = 'USER' | 'ADMIN';

/**
 * User Account Status
 * - ACTIVE: Can log in and manage tasks
 * - INACTIVE: Deactivated by admin, access is blocked
 */
export type UserStatus = 'ACTIVE' | 'INACTIVE';

/**
 * User Profile Model
 * Represents a registered user in the application.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Login Request Payload
 * Sent when a user or admin logs in.
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Registration Request Payload
 * Sent when a new user creates an account.
 * Note: Role cannot be specified here; all public signups are assigned 'USER' by default.
 */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Authentication Response Payload
 * Returned by backend (or mock service) upon successful login or registration.
 */
export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}
