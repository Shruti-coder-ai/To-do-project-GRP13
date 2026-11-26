import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

/**
 * Reusable NavbarComponent
 *
 * For Beginners:
 * - Displays page header, logged-in user greeting, role badge, theme toggle, and logout control.
 * - `@Input()` accepts customizable titles from parent dashboard components.
 * - `@Output()` communicates sidebar toggle events on mobile devices.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public authService = inject(AuthService);
  public themeService = inject(ThemeService);

  @Input() pageTitle: string = 'Dashboard';
  @Input() pageSubtitle: string = '';

  @Output() toggleSidebar = new EventEmitter<void>();

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
