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

    component.setFilter('Overdue');
    expect(taskService.activeFilter()).toBe('Overdue');
  });

  it('should open Add Task dialog with empty form and dueTime control', () => {
    component.openAddTaskDialog();
    expect(component.isDialogVisible()).toBe(true);
    expect(component.isEditing()).toBe(false);
    expect(component.editingTaskId()).toBeNull();
    expect(component.taskForm.value.title).toBe('');
    expect(component.taskForm.contains('dueTime')).toBe(true);
  });

  it('should open Edit Task dialog pre-filled with task data including dueTime', () => {
    const mockTask: Task = {
      id: 'mock-1',
      title: 'Test Existing Task',
      description: 'Existing Description',
      priority: 'High',
      dueDate: '2026-12-25',
      dueTime: '16:30',
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
    expect(component.taskForm.value.dueTime).toBe('16:30');
  });

  it('should prevent submission of invalid task form', () => {
    component.openAddTaskDialog();
    component.taskForm.patchValue({ title: '', description: '' });

    component.onSaveTask();
    expect(component.taskForm.invalid).toBe(true);
    expect(component.isSubmitting()).toBe(false);
  });

  describe('Task Title Validation (Bug 1 & Bug 2)', () => {
    it('should accept normal valid titles in Add Task form', () => {
      component.openAddTaskDialog();
      const titleControl = component.taskForm.controls['title'];

      titleControl.setValue('Finish project report');
      expect(titleControl.valid).toBe(true);
      expect(titleControl.errors).toBeNull();

      titleControl.setValue('Abc'); // exactly 3 characters
      expect(titleControl.valid).toBe(true);

      titleControl.setValue('a'.repeat(100)); // exactly 100 characters
      expect(titleControl.valid).toBe(true);
    });

    it('should accept normal valid titles in Edit Task form', () => {
      const mockTask: Task = {
        id: 'mock-1',
        title: 'Initial Title',
        description: 'Existing Description',
        priority: 'Medium',
        dueDate: '2026-12-25',
        status: 'Pending',
        userId: 'usr-1',
        createdAt: new Date().toISOString()
      };
      component.openEditTaskDialog(mockTask);
      const titleControl = component.taskForm.controls['title'];

      titleControl.setValue('Updated Valid Title');
      expect(titleControl.valid).toBe(true);
      expect(titleControl.errors).toBeNull();
    });

    it('should reject whitespace-only titles with whitespace and required errors (Bug 1)', () => {
      component.openAddTaskDialog();
      const titleControl = component.taskForm.controls['title'];

      titleControl.setValue('   ');
      expect(titleControl.invalid).toBe(true);
      expect(titleControl.hasError('whitespace')).toBe(true);
      expect(titleControl.hasError('required')).toBe(true);

      titleControl.setValue('\t  \n ');
      expect(titleControl.invalid).toBe(true);
      expect(titleControl.hasError('whitespace')).toBe(true);
    });

    it('should trim whitespace-only titles and prevent submission on save (Bug 1)', () => {
      component.openAddTaskDialog();
      component.taskForm.patchValue({
        title: '     ',
        description: 'Valid description',
        priority: 'High',
        dueDate: '2026-12-30'
      });

      component.onSaveTask();
      expect(component.taskForm.invalid).toBe(true);
      expect(component.taskForm.controls['title'].hasError('whitespace')).toBe(true);
      expect(component.isSubmitting()).toBe(false);
    });

    it('should reject too-short titles (< 3 characters) with minlength error', () => {
      component.openAddTaskDialog();
      const titleControl = component.taskForm.controls['title'];

      titleControl.setValue('a');
      expect(titleControl.invalid).toBe(true);
      expect(titleControl.hasError('minlength')).toBe(true);
      expect(titleControl.errors?.['minlength']?.requiredLength).toBe(3);
      expect(titleControl.hasError('maxlength')).toBe(false);

      titleControl.setValue('ab');
      expect(titleControl.invalid).toBe(true);
      expect(titleControl.hasError('minlength')).toBe(true);

      // Whitespace around 2 characters should still fail minlength after trimming
      titleControl.setValue('  ab  ');
      expect(titleControl.invalid).toBe(true);
      expect(titleControl.hasError('minlength')).toBe(true);
      expect(titleControl.errors?.['minlength']?.actualLength).toBe(2);
    });

    it('should reject a 300-character title with maxlength error and NOT minlength error (Bug 2)', () => {
      component.openAddTaskDialog();
      const titleControl = component.taskForm.controls['title'];

      const longTitle = 'a'.repeat(300);
      titleControl.setValue(longTitle);

      expect(titleControl.invalid).toBe(true);
      expect(titleControl.hasError('maxlength')).toBe(true);
      expect(titleControl.errors?.['maxlength']?.requiredLength).toBe(100);
      expect(titleControl.errors?.['maxlength']?.actualLength).toBe(300);

      // Bug 2 verification: must NOT display or have minlength error for long titles
      expect(titleControl.hasError('minlength')).toBe(false);
    });

    it('should trim valid titles before saving', () => {
      component.openAddTaskDialog();
      component.taskForm.patchValue({
        title: '   Clean Title With Padding   ',
        description: 'Valid description text',
        priority: 'Low',
        dueDate: '2026-12-31'
      });

      component.onSaveTask();
      expect(component.taskForm.controls['title'].value).toBe('Clean Title With Padding');
    });
  });
});
