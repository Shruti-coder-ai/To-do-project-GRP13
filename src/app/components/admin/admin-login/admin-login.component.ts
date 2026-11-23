import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

/**
 * AdminLoginComponent
 *
 * Dedicated portal for system administrators.
 * Features quick-fill credentials for:
 * - Shruti Naik (Admin)
 * - Demo Administrator
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);

  // UI state signals
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Reactive Form
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  /**
   * Helper for tests or programmatic fill
   */
  fillAdminCredentials(adminType: 'SHRUTI' | 'DEMO'): void {
    if (adminType === 'SHRUTI') {
      this.loginForm.patchValue({
        email: 'angrevyas@gmail.com',
        password: 'Angre@123'
      });
    } else {
      this.loginForm.patchValue({
        email: 'admin@taskflow.dev',
        password: 'Admin@123'
      });
    }
    this.errorMessage.set(null);
  }

  onSubmit(): void {
    this.errorMessage.set(null);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const credentials = this.loginForm.value;

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Administrator Authenticated',
          detail: `Welcome, ${response.user.name}! Redirecting to Admin Dashboard...`,
          life: 3000
        });

        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        if (response.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        let errorMsg = 'Administrator authentication failed.';
        if (err.status === 0) {
          errorMsg = 'Unable to connect to the backend server (http://localhost:3000). Please ensure the backend server is running.';
        } else if (err.error?.message) {
          errorMsg = err.error.message;
        } else if (err.message) {
          errorMsg = err.message;
        }
        this.errorMessage.set(errorMsg);
        this.messageService.add({
          severity: 'error',
          summary: 'Access Denied',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }
}
