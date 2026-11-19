import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid form', () => {
    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.controls['email'].errors?.['required']).toBeTruthy();
    expect(component.loginForm.controls['password'].errors?.['required']).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.errors?.['email']).toBeTruthy();

    emailControl.setValue('valid@taskflow.dev');
    expect(emailControl.errors).toBeNull();
  });

  it('should validate minimum password length', () => {
    const passControl = component.loginForm.controls['password'];
    passControl.setValue('123');
    expect(passControl.errors?.['minlength']).toBeTruthy();

    passControl.setValue('Secret123');
    expect(passControl.errors).toBeNull();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should autofill demo credentials on demand', () => {
    component.fillDemoCredentials('USER');
    expect(component.loginForm.value.email).toBe('user@taskflow.dev');
    expect(component.loginForm.value.password).toBe('User@123');
    expect(component.loginForm.valid).toBe(true);

    component.fillDemoCredentials('ADMIN');
    expect(component.loginForm.value.email).toBe('admin@taskflow.dev');
    expect(component.loginForm.value.password).toBe('Admin@123');
    expect(component.loginForm.valid).toBe(true);
  });
});
