import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TaskService } from '../../../services/task.service';
import { TaskFilter } from '../../../models/task.model';

/**
 * Reusable SidebarComponent
 *
 * For Beginners:
 * - Adapts navigation links dynamically depending on whether the logged-in user is a USER or an ADMIN.
 * - Supports collapsible mobile drawer mode and responsive desktop layout.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public authService = inject(AuthService);
  public taskService = inject(TaskService);
  private router = inject(Router);

  @Input() isOpen: boolean = false;
  @Input() activeAdminTab: 'overview' | 'users' | 'tasks' = 'overview';

  @Output() closeSidebar = new EventEmitter<void>();
  @Output() adminTabSelected = new EventEmitter<'overview' | 'users' | 'tasks'>();

  onClose(): void {
    this.closeSidebar.emit();
  }

  setFilter(filter: TaskFilter): void {
    this.taskService.activeFilter.set(filter);
    if (!this.router.url.includes('/user/dashboard')) {
      this.router.navigate(['/user/dashboard']);
    }
    this.closeSidebar.emit();
  }

  selectAdminTab(tab: 'overview' | 'users' | 'tasks'): void {
    this.adminTabSelected.emit(tab);
    if (!this.router.url.includes('/admin/dashboard')) {
      this.router.navigate(['/admin/dashboard']);
    }
    this.closeSidebar.emit();
  }

  onLogout(): void {
    this.authService.logout();
  }
}
