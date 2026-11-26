import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

/**
 * ThemeService
 *
 * Manages light and dark theme state using Angular Signals.
 * Persists user preference in localStorage and synchronizes with the documentElement 'dark' class.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'taskflow_theme_mode';

  // Reactive state signal for dark mode
  public readonly isDarkMode = signal<boolean>(this.loadInitialTheme());

  constructor() {
    this.applyTheme(this.isDarkMode());
  }

  /**
   * Toggles between light and dark modes
   */
  public toggleTheme(): void {
    const nextMode = !this.isDarkMode();
    this.isDarkMode.set(nextMode);
    this.applyTheme(nextMode);
    try {
      localStorage.setItem(this.THEME_KEY, nextMode ? 'dark' : 'light');
    } catch {
      // localStorage may fail in restricted environments
    }
  }

  /**
   * Sets a specific mode explicitly
   */
  public setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
    this.applyTheme(isDark);
    try {
      localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }

  private loadInitialTheme(): boolean {
    try {
      const saved = localStorage.getItem(this.THEME_KEY);
      if (saved) {
        return saved === 'dark';
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch {
      // ignore
    }
    return false;
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
}
