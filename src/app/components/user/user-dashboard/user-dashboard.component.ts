import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AuthService } from '../../../services/auth.service';
import { TaskService } from '../../../services/task.service';
import { Task, TaskPriority, TaskFilter } from '../../../models/task.model';

/**
 * Custom validator for task title:
 * - Trims the title before validation
 * - Rejects empty or whitespace-only inputs with { required: true } and { whitespace: true }
 * - Rejects titles shorter than min length with { minlength: { requiredLength: min, actualLength: trimmed.length } }
 * - Rejects titles longer than max length with { maxlength: { requiredLength: max, actualLength: trimmed.length } }
 */
export function taskTitleValidator(min: number = 3, max: number = 100): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined) {
      return { required: true };
    }
    const str = typeof value === 'string' ? value : String(value);
    const trimmed = str.trim();

    if (trimmed.length === 0) {
      return str.length > 0 ? { required: true, whitespace: true } : { required: true };
    }
    if (trimmed.length < min) {
      return { minlength: { requiredLength: min, actualLength: trimmed.length } };
    }
    if (trimmed.length > max) {
      return { maxlength: { requiredLength: max, actualLength: trimmed.length } };
    }
    return null;
  };
}

/**
 * UserDashboardComponent
 *
 * For Beginners:
 * - Manages personal tasks for normal logged-in users.
 * - Reactive Forms (`taskForm`) handles both "Add Task" and "Edit Task" via a modal dialog.
 * - Angular Signals provide instant UI updates when tasks are added, modified, or marked complete.
 */
@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Dialog,
    NavbarComponent,
    SidebarComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit {
  public authService = inject(AuthService);
  public taskService = inject(TaskService);
  private fb = inject(FormBuilder);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  // Mobile sidebar drawer state
  isSidebarOpen = signal<boolean>(false);

  // Dialog state
  isDialogVisible = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  editingTaskId = signal<string | null>(null);
  isSubmitting = signal<boolean>(false);

  // Priority options for dropdown
  readonly priorities: TaskPriority[] = ['Low', 'Medium', 'High'];

  // Reactive Task Form definition
  taskForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, taskTitleValidator(3, 100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    priority: ['Medium' as TaskPriority, [Validators.required]],
    dueDate: [new Date().toISOString().split('T')[0], [Validators.required]]
  });

  get f() {
    return this.taskForm.controls;
  }

  ngOnInit(): void {
    // Load personal tasks on component initialization
    this.taskService.getTasks().subscribe();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update((val) => !val);
  }

  setFilter(filter: TaskFilter): void {
    this.taskService.activeFilter.set(filter);
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.taskService.searchQuery.set(input.value);
  }

  openAddTaskDialog(): void {
    this.isEditing.set(false);
    this.editingTaskId.set(null);
    this.taskForm.reset({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0]
    });
    this.isDialogVisible.set(true);
  }

  openEditTaskDialog(task: Task): void {
    this.isEditing.set(true);
    this.editingTaskId.set(task.id);
    this.taskForm.patchValue({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate
    });
    this.isDialogVisible.set(true);
  }

  closeDialog(): void {
    this.isDialogVisible.set(false);
    this.taskForm.reset();
  }

  onSaveTask(): void {
    // Trim the task title before validation
    const titleControl = this.taskForm.get('title');
    if (titleControl && typeof titleControl.value === 'string') {
      const raw = titleControl.value;
      const trimmed = raw.trim();
      titleControl.setValue(trimmed);
      if (raw.length > 0 && trimmed.length === 0) {
        titleControl.setErrors({ required: true, whitespace: true });
      }
    }

    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValues = {
      ...this.taskForm.value,
      title: this.taskForm.value.title?.trim()
    };

    if (this.isEditing() && this.editingTaskId()) {
      // Update existing task
      this.taskService.updateTask(this.editingTaskId()!, formValues).subscribe({
        next: (updated) => {
          this.isSubmitting.set(false);
          this.closeDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Task Updated',
            detail: `"${updated.title}" has been updated.`,
            life: 3000
          });
        },
        error: (err: Error) => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Update Failed',
            detail: err.message,
            life: 4000
          });
        }
      });
    } else {
      // Create new task
      this.taskService.addTask(formValues).subscribe({
        next: (created) => {
          this.isSubmitting.set(false);
          this.closeDialog();
          this.messageService.add({
            severity: 'success',
            summary: 'Task Created',
            detail: `"${created.title}" added to your tasks!`,
            life: 3000
          });
        },
        error: (err: Error) => {
          this.isSubmitting.set(false);
          this.messageService.add({
            severity: 'error',
            summary: 'Creation Failed',
            detail: err.message,
            life: 4000
          });
        }
      });
    }
  }

  onToggleStatus(task: Task, event: Event): void {
    event.stopPropagation();
    this.taskService.toggleTaskStatus(task).subscribe({
      next: (updated) => {
        const isDone = updated.status === 'Completed';
        this.messageService.add({
          severity: isDone ? 'success' : 'info',
          summary: isDone ? 'Task Completed! 🎉' : 'Task Reopened',
          detail: `"${updated.title}" marked as ${updated.status}.`,
          life: 2500
        });
      }
    });
  }

  onDeleteTask(task: Task, event: Event): void {
    event.stopPropagation();
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the task "${task.title}"? This action cannot be undone.`,
      header: 'Delete Task Confirmation',
      icon: 'pi pi-exclamation-triangle text-rose-500',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'warn',
              summary: 'Task Deleted',
              detail: `"${task.title}" was removed.`,
              life: 3000
            });
          }
        });
      }
    });
  }
}
