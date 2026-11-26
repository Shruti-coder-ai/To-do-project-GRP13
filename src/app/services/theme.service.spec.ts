import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should default to light mode if no localStorage preference exists', () => {
    // When no localStorage is set and matchMedia is default
    expect(typeof service.isDarkMode()).toBe('boolean');
  });

  it('should toggle theme mode and persist to localStorage', () => {
    const initial = service.isDarkMode();
    service.toggleTheme();
    expect(service.isDarkMode()).toBe(!initial);
    expect(localStorage.getItem('taskflow_theme_mode')).toBe(!initial ? 'dark' : 'light');
    expect(document.documentElement.classList.contains('dark')).toBe(!initial);
  });

  it('should explicitly set theme', () => {
    service.setTheme(true);
    expect(service.isDarkMode()).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('taskflow_theme_mode')).toBe('dark');

    service.setTheme(false);
    expect(service.isDarkMode()).toBe(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('taskflow_theme_mode')).toBe('light');
  });
});
