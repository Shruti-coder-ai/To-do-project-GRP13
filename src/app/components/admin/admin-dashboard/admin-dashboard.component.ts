import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UIChart } from 'primeng/chart';
import { Dialog } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { User, UserStatus } from '../../../models/user.model';
import { Task, TaskPriority, TaskStatus } from '../../../models/task.model';

/**
 * AdminDashboardComponent
 *
 * For Beginners:
 * - Provides system administrators with a comprehensive control panel.
 * - Manages registered user accounts (viewing user details, activating/deactivating accounts).
 * - Displays all tasks created across the entire organization.
 * - Visualizes analytics using Chart.js (status doughnut chart and priority bar chart).
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    UIChart,
    Dialog,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  public authService = inject(AuthService);
  public userService = inject(UserService);
  public taskService = inject(TaskService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // Mobile sidebar drawer state
  isSidebarOpen = signal<boolean>(false);

  // Active view tab ('analytics' | 'users' | 'tasks')
  activeTab = signal<'overview' | 'users' | 'tasks'>('overview');

  // Search & Filter signals for User Management
  userSearchQuery = signal<string>('');
  userStatusFilter = signal<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Search & Filter signals for All Tasks view
  taskSearchQuery = signal<string>('');
  taskStatusFilter = signal<'ALL' | 'Pending' | 'Completed' | 'Overdue'>('ALL');
  taskPriorityFilter = signal<'ALL' | TaskPriority>('ALL');

  // Detail Modal dialog state
  selectedUser = signal<User | null>(null);
  isUserDetailVisible = signal<boolean>(false);

  selectedTask = signal<Task | null>(null);
  isTaskDetailVisible = signal<boolean>(false);

  // Chart configuration signals
  statusChartData = computed(() => {
    const stats = this.taskService.adminTaskStatistics();
    return {
      labels: ['Pending Tasks', 'Completed Tasks'],
      datasets: [
        {
          data: [stats.statusDistribution.pending, stats.statusDistribution.completed],
          backgroundColor: ['#A5A0F5', '#7054C8'],
          hoverBackgroundColor: ['#8C86EF', '#5B3EB2'],
          borderColor: '#FFF9F2',
          borderWidth: 3
        }
      ]
    };
  });

  statusChartOptions: any = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#332747',
          font: { family: "'Plus Jakarta Sans', sans-serif", weight: 'bold', size: 12 },
          usePointStyle: true,
          padding: 18
        }
      }
    },
    cutout: '68%',
    responsive: true,
    maintainAspectRatio: false
  };

  priorityChartData = computed(() => {
    const stats = this.taskService.adminTaskStatistics();
    return {
      labels: ['Low Priority', 'Medium Priority', 'High Priority'],
      datasets: [
        {
          label: 'Number of Tasks',
          data: [
            stats.priorityDistribution.low,
            stats.priorityDistribution.medium,
            stats.priorityDistribution.high
          ],
          backgroundColor: ['#10B981', '#F59E0B', '#F43F5E'],
          borderRadius: 8,
          borderSkipped: false
        }
      ]
    };
  });

  priorityChartOptions: any = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        ticks: { color: '#6b5d82', font: { family: "'Plus Jakarta Sans', sans-serif", weight: 'bold' } },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#6b5d82', precision: 0 },
        grid: { color: 'rgba(165, 160, 245, 0.15)' }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  // Filtered Users List
  filteredUsers = computed(() => {
    let users = this.userService.users();
    const query = this.userSearchQuery().toLowerCase().trim();
    const status = this.userStatusFilter();

    if (status !== 'ALL') {
      users = users.filter((u) => u.status === status);
    }

    if (query) {
      users = users.filter(
        (u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
      );
    }

    return users;
  });

  // Filtered All-Platform Tasks List
  filteredAllTasks = computed(() => {
    let tasks = this.taskService.allTasks();
    const query = this.taskSearchQuery().toLowerCase().trim();
    const status = this.taskStatusFilter();
    const priority = this.taskPriorityFilter();

    if (status !== 'ALL') {
      if (status === 'Overdue') {
        tasks = tasks.filter((t) => this.taskService.isTaskOverdue(t));
      } else {
        tasks = tasks.filter((t) => t.status === status);
      }
    }

    if (priority !== 'ALL') {
      tasks = tasks.filter((t) => t.priority === priority);
    }

    if (query) {
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          (t.userName && t.userName.toLowerCase().includes(query))
      );
    }

    return tasks;
  });

  ngOnInit(): void {
    this.userService.getUsers().subscribe();
    this.taskService.getTasks().subscribe();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((val) => !val);
  }

  viewUserDetails(user: User): void {
    this.selectedUser.set(user);
    this.isUserDetailVisible.set(true);
  }

  viewTaskDetails(task: Task): void {
    this.selectedTask.set(task);
    this.isTaskDetailVisible.set(true);
  }

  toggleAccountStatus(user: User): void {
    if (user.role === 'ADMIN') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Action Not Allowed',
        detail: 'System Administrator accounts cannot be deactivated.',
        life: 3500
      });
      return;
    }

    const actionText = user.status === 'ACTIVE' ? 'deactivate' : 'activate';
    this.confirmationService.confirm({
      message: `Are you sure you want to ${actionText} the account for "${user.name}" (${user.email})?`,
      header: `Confirm Account ${actionText.toUpperCase()}`,
      icon: 'pi pi-exclamation-triangle text-amber-500',
      acceptLabel: user.status === 'ACTIVE' ? 'Deactivate' : 'Activate',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: user.status === 'ACTIVE' ? 'p-button-danger' : 'p-button-success',
      accept: () => {
        this.userService.toggleUserStatus(user.id).subscribe({
          next: (updated) => {
            const isNowActive = updated.status === 'ACTIVE';
            this.messageService.add({
              severity: isNowActive ? 'success' : 'warn',
              summary: isNowActive ? 'Account Activated' : 'Account Deactivated',
              detail: `${updated.name}'s account is now ${updated.status}.`,
              life: 3000
            });
          },
          error: (err: Error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Action Failed',
              detail: err.message,
              life: 4000
            });
          }
        });
      }
    });
  }
}
