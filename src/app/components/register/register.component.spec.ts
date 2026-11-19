import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should start with an invalid form', () => {
    expect(component.registerForm.valid).toBe(false);
  });

  it('should validate matching passwords', () => {
    component.registerForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
      confirmPassword: 'MismatchPassword'
    });

    expect(component.registerForm.valid).toBe(false);
    expect(component.registerForm.controls['confirmPassword'].errors?.['passwordMismatch']).toBe(true);

    // Make them match
    component.registerForm.patchValue({
      confirmPassword: 'Password123'
    });

    expect(component.registerForm.controls['confirmPassword'].errors).toBeNull();
    expect(component.registerForm.valid).toBe(true);
  });

  it('should toggle password visibility flags', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);

    expect(component.showConfirmPassword()).toBe(false);
    component.toggleConfirmPasswordVisibility();
    expect(component.showConfirmPassword()).toBe(true);
  });
});
