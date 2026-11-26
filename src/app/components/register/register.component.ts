import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

/**
 * Custom Validator to confirm that Password and Confirm Password match.
 *
 * For Beginners:
 * - In Angular Reactive Forms, a validator applied at the `FormGroup` level can read
 *   multiple child controls and verify relationships between them (like passwords matching).
 */
export function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) {
    return null;
  }

  // If confirmPassword already has another error (e.g. required), don't overwrite it
  if (confirmPassword.errors && !confirmPassword.errors['passwordMismatch']) {
    return null;
  }

  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    // If they match and were previously mismatched, clear the mismatch error
    if (confirmPassword.hasError('passwordMismatch')) {
      const { passwordMismatch, ...remainingErrors } = confirmPassword.errors || {};
      confirmPassword.setErrors(Object.keys(remainingErrors).length ? remainingErrors : null);
    }
    return null;
  }
}

/**
 * RegisterComponent
 *
 * Handles new user signups.
 * Note: All public registrations are assigned the 'USER' role by default.
 * Admin accounts cannot be created publicly and must be provisioned securely by the backend.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  public themeService = inject(ThemeService);

  // Reactive UI state
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Reactive Form Definition with cross-field password matching
  registerForm: FormGroup = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    { validators: passwordMatchValidator }
  );

  get f() {
    return this.registerForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update((val) => !val);
  }

  onSubmit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    // Stop if the form is invalid
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const { name, email, password } = this.registerForm.value;

    this.authService.register({ name, email, password }).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        const msg = response.message || 'Account created successfully! Redirecting to login...';
        this.successMessage.set(msg);

        this.messageService.add({
          severity: 'success',
          summary: 'Registration Successful',
          detail: msg,
          life: 3000
        });

        // Redirect to Login page after a brief delay so user sees success message
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: any) => {
        this.isLoading.set(false);
        let errorMsg = 'Registration failed. Please try again.';
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
          summary: 'Registration Failed',
          detail: errorMsg,
          life: 4000
        });
      }
    });
  }
}
