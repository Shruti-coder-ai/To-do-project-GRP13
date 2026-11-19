import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AdminLoginComponent } from './admin-login.component';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AdminLoginComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AdminLogin component', () => {
    expect(component).toBeTruthy();
  });

  it('should autofill angrevyas admin credentials', () => {
    component.fillAdminCredentials('SHRUTI');
    expect(component.loginForm.value.email).toBe('angrevyas@gmail.com');
    expect(component.loginForm.value.password).toBe('Angre@123');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should autofill Demo Admin credentials', () => {
    component.fillAdminCredentials('DEMO');
    expect(component.loginForm.value.email).toBe('admin@taskflow.dev');
    expect(component.loginForm.value.password).toBe('Admin@123');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should toggle password visibility flag', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should successfully submit with angrevyas@gmail.com credentials', () => {
    component.loginForm.setValue({
      email: 'angrevyas@gmail.com',
      password: 'Angre@123'
    });
    expect(component.loginForm.valid).toBe(true);
    component.onSubmit();
    expect(component.errorMessage()).toBeNull();
  });
});
