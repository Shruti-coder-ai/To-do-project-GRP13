import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

/**
 * LoginComponent
 *
 * For Beginners:
 * - Reactive Forms (`FormBuilder`, `FormGroup`, `Validators`) allow robust form state tracking and validation in code.
 * - Angular Signals (`signal`) manage UI state like `isLoading`, `showPassword`, and `errorMessage`.
 * - On successful login, the user's role is checked:
 *   - 'USER' -> redirected to /user/dashboard
 *   - 'ADMIN' -> redirected to /admin/dashboard
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  public themeService = inject(ThemeService);

  // Reactive UI state
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Reactive Form Definition with validation rules
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Convenience getter for form controls in HTML template
  get f() {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  /**
   * Quick-fill demo credentials for easy testing during development
   */
  fillDemoCredentials(role: 'USER' | 'ADMIN'): void {
    if (role === 'USER') {
      this.loginForm.patchValue({
        email: 'user@taskflow.dev',
        password: 'User@123'
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

    // Stop if the form is invalid
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
          summary: 'Welcome back!',
          detail: `Logged in as ${response.user.name} (${response.user.role})`,
          life: 3000
        });

        // Check if there was a returnUrl query parameter
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
          return;
        }

        // Role-based redirection
        if (response.user.role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/user/dashboard']);
        }
      },
      error: (err: any) => {
        this.isLoading.set(false);
        let errorMsg = 'Login failed. Please check your credentials and try again.';
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
          summary: 'Authentication Failed',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }
}
