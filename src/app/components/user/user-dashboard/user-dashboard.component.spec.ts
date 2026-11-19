import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserDashboardComponent } from './user-dashboard.component';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../models/task.model';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [UserDashboardComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        ConfirmationService,
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create the UserDashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should update active filter when setFilter is called', () => {
    component.setFilter('Pending');
    expect(taskService.activeFilter()).toBe('Pending');

    component.setFilter('Completed');
    expect(taskService.activeFilter()).toBe('Completed');
  });

  it('should open Add Task dialog with empty form', () => {
    component.openAddTaskDialog();
    expect(component.isDialogVisible()).toBe(true);
    expect(component.isEditing()).toBe(false);
    expect(component.editingTaskId()).toBeNull();
    expect(component.taskForm.value.title).toBe('');
  });

  it('should open Edit Task dialog pre-filled with task data', () => {
    const mockTask: Task = {
      id: 'mock-1',
      title: 'Test Existing Task',
      description: 'Existing Description',
      priority: 'High',
      dueDate: '2026-12-25',
      status: 'Pending',
      userId: 'usr-1',
      createdAt: new Date().toISOString()
    };

    component.openEditTaskDialog(mockTask);
    expect(component.isDialogVisible()).toBe(true);
    expect(component.isEditing()).toBe(true);
    expect(component.editingTaskId()).toBe('mock-1');
    expect(component.taskForm.value.title).toBe('Test Existing Task');
    expect(component.taskForm.value.priority).toBe('High');
  });

  it('should prevent submission of invalid task form', () => {
    component.openAddTaskDialog();
    component.taskForm.patchValue({ title: '', description: '' });

    component.onSaveTask();
    expect(component.taskForm.invalid).toBe(true);
    expect(component.isSubmitting()).toBe(false);
  });
});
