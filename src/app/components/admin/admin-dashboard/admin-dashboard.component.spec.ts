import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UserService } from '../../../services/user.service';
import { TaskService } from '../../../services/task.service';
import { User } from '../../../models/user.model';
import { Task } from '../../../models/task.model';

// Mock Canvas getContext for JSDOM / headless test runner
if (typeof HTMLCanvasElement !== 'undefined' && !HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = (() => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    fill: () => {},
    measureText: () => ({ width: 0 }),
    transform: () => {},
    rect: () => {},
    clip: () => {}
  })) as any;
}

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let userService: UserService;
  let taskService: TaskService;

  beforeEach(async () => {
    localStorage.clear();
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        ConfirmationService,
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create the AdminDashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should switch active tabs correctly', () => {
    expect(component.activeTab()).toBe('overview');

    component.activeTab.set('users');
    expect(component.activeTab()).toBe('users');

    component.activeTab.set('tasks');
    expect(component.activeTab()).toBe('tasks');
  });

  it('should filter users based on status and search query', () => {
    component.userStatusFilter.set('INACTIVE');
    const inactiveUsers = component.filteredUsers();
    expect(inactiveUsers.every((u) => u.status === 'INACTIVE')).toBe(true);

    component.userStatusFilter.set('ALL');
    component.userSearchQuery.set('angrevyas');
    const searchedUsers = component.filteredUsers();
    expect(searchedUsers.some((u) => u.name.includes('angrevyas'))).toBe(true);
  });

  it('should filter all tasks by status and priority', () => {
    component.taskStatusFilter.set('Completed');
    expect(component.filteredAllTasks().every((t) => t.status === 'Completed')).toBe(true);

    component.taskStatusFilter.set('Overdue');
    expect(component.filteredAllTasks().every((t) => taskService.isTaskOverdue(t))).toBe(true);

    component.taskStatusFilter.set('ALL');
    component.taskPriorityFilter.set('High');
    expect(component.filteredAllTasks().every((t) => t.priority === 'High')).toBe(true);
  });

  it('should open user detail dialog', () => {
    const mockUser: User = {
      id: 'usr-99',
      name: 'Test Candidate',
      email: 'test@candidate.com',
      role: 'USER',
      status: 'ACTIVE',
      createdAt: '2026-11-01T00:00:00Z'
    };

    component.viewUserDetails(mockUser);
    expect(component.isUserDetailVisible()).toBe(true);
    expect(component.selectedUser()?.id).toBe('usr-99');
  });

  it('should open task detail dialog', () => {
    const mockTask: Task = {
      id: 'tsk-99',
      title: 'Review System Metrics',
      description: 'Audit server logs and user activities',
      priority: 'High',
      dueDate: '2026-12-01',
      status: 'Pending',
      userId: 'usr-1',
      userName: 'angrevyas',
      createdAt: '2026-11-01T00:00:00Z'
    };

    component.viewTaskDetails(mockTask);
    expect(component.isTaskDetailVisible()).toBe(true);
    expect(component.selectedTask()?.title).toBe('Review System Metrics');
  });

  it('should disallow deactivation of ADMIN account', () => {
    const adminUser: User = {
      id: 'adm-1',
      name: 'System Administrator',
      email: 'admin@taskflow.dev',
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: '2026-10-15T00:00:00Z'
    };

    component.toggleAccountStatus(adminUser);
    expect(adminUser.status).toBe('ACTIVE');
  });
});
