import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatistics, TaskFilter } from '../models/task.model';
import { AuthService } from './auth.service';

/**
 * TaskService manages all task CRUD operations and statistics.
 *
 * For Beginners:
 * - When `environment.useMockData` is true, tasks are kept in memory and synchronized with localStorage.
 * - When `environment.useMockData` is false, requests are routed to Fastify's `/api/tasks` endpoints.
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'taskflow_tasks_store';

  // Master reactive task list
  private tasksSignal = signal<Task[]>(this.initializeTasks());

  // Active filter state ('All' | 'Pending' | 'Completed')
  public readonly activeFilter = signal<TaskFilter>('All');

  // Search query state
  public readonly searchQuery = signal<string>('');

  // Public readonly tasks signal
  public readonly allTasks = this.tasksSignal.asReadonly();

  // Tasks filtered by current logged-in user
  public readonly userTasks = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return [];
    return this.tasksSignal().filter((task) => task.userId === user.id || (user.name && task.userName === user.name));
  });

  // Filtered view for User Dashboard based on active filter and search text
  public readonly filteredUserTasks = computed(() => {
    const filter = this.activeFilter();
    const query = this.searchQuery().toLowerCase().trim();
    let tasks = this.userTasks();

    if (filter === 'Pending') {
      tasks = tasks.filter((t) => t.status === 'Pending');
    } else if (filter === 'Completed') {
      tasks = tasks.filter((t) => t.status === 'Completed');
    }

    if (query) {
      tasks = tasks.filter(
        (t) => t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
      );
    }

    return tasks;
  });

  // Calculated statistics for the current user
  public readonly userStatistics = computed<TaskStatistics>(() => {
    const tasks = this.userTasks();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;
    const highPriorityTasks = tasks.filter((t) => t.priority === 'High' && t.status === 'Pending').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      pendingTasks,
      completedTasks,
      highPriorityTasks,
      completionRate
    };
  });

  // Platform-wide task statistics for Admin Dashboard
  public readonly adminTaskStatistics = computed(() => {
    const tasks = this.tasksSignal();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const pendingTasks = totalTasks - completedTasks;

    return {
      totalTasks,
      pendingTasks,
      completedTasks,
      priorityDistribution: {
        low: tasks.filter((t) => t.priority === 'Low').length,
        medium: tasks.filter((t) => t.priority === 'Medium').length,
        high: tasks.filter((t) => t.priority === 'High').length
      },
      statusDistribution: {
        pending: pendingTasks,
        completed: completedTasks
      }
    };
  });

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Fetch all tasks (User gets own tasks, Admin gets all)
   */
  getTasks(): Observable<Task[]> {
    if (environment.useMockData) {
      return of(this.authService.isAdmin() ? this.tasksSignal() : this.userTasks()).pipe(delay(200));
    }
    const endpoint = this.authService.isAdmin() ? `${environment.apiUrl}/admin/tasks` : `${environment.apiUrl}/tasks`;
    return this.http.get<Task[]>(endpoint).pipe(
      tap((tasks) => this.tasksSignal.set(tasks))
    );
  }

  /**
   * Add a new task
   */
  addTask(dto: CreateTaskDto): Observable<Task> {
    const user = this.authService.currentUser();
    if (!user) {
      return throwError(() => new Error('You must be logged in to create a task.'));
    }

    if (environment.useMockData) {
      // In TaskFlow, task creator should be a user name, not an admin name
      const creatorName = user.role === 'ADMIN' ? 'Shruti Naik' : user.name;
      const creatorId = user.role === 'ADMIN' ? 'usr-shruti' : user.id;

      const newTask: Task = {
        id: `tsk-${Date.now()}`,
        title: dto.title,
        description: dto.description,
        priority: dto.priority,
        dueDate: dto.dueDate,
        status: 'Pending',
        userId: creatorId,
        userName: creatorName,
        createdAt: new Date().toISOString()
      };

      this.tasksSignal.update((tasks) => [newTask, ...tasks]);
      this.persistTasks();
      return of(newTask).pipe(delay(300));
    }

    return this.http.post<Task>(`${environment.apiUrl}/tasks`, dto).pipe(
      tap((created) => {
        this.tasksSignal.update((tasks) => [created, ...tasks]);
      })
    );
  }

  /**
   * Update an existing task
   */
  updateTask(id: string, updates: UpdateTaskDto): Observable<Task> {
    if (environment.useMockData) {
      let updatedTask: Task | null = null;

      this.tasksSignal.update((tasks) =>
        tasks.map((t) => {
          if (t.id === id) {
            updatedTask = {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString()
            };
            return updatedTask;
          }
          return t;
        })
      );

      if (!updatedTask) {
        return throwError(() => new Error('Task not found'));
      }

      this.persistTasks();
      return of(updatedTask as Task).pipe(delay(300));
    }

    return this.http.put<Task>(`${environment.apiUrl}/tasks/${id}`, updates).pipe(
      tap((updated) => {
        this.tasksSignal.update((tasks) => tasks.map((t) => (t.id === id ? updated : t)));
      })
    );
  }

  /**
   * Toggle task completion status
   */
  toggleTaskStatus(task: Task): Observable<Task> {
    const nextStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    return this.updateTask(task.id, { status: nextStatus });
  }
/**
 * Delete a task
 */
  deleteTask(id: string): Observable<boolean> {
    if (environment.useMockData) {
      this.tasksSignal.update((tasks) => tasks.filter((t) => t.id !== id));
      this.persistTasks();
      return of(true).pipe(delay(300));
    }

    return this.http.delete<void>(`${environment.apiUrl}/tasks/${id}`).pipe(
      tap(() => {
        this.tasksSignal.update((tasks) =>
          tasks.filter((t) => t.id !== id)
        );
      }),
      // Return true after the backend confirms deletion
      map(() => true)
    );
  }


  // --- Mock Data Management ---

  private initializeTasks(): Task[] {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      try {
        const tasks: Task[] = JSON.parse(saved);
        let updated = false;
        tasks.forEach((t) => {
          // If a task creator was saved as admin name 'angrevyas' or 'Demo Administrator', attribute to user 'Shruti Naik'
          if (t.userName === 'angrevyas' || t.userName === 'Demo Administrator') {
            t.userName = 'Shruti Naik';
            updated = true;
          }
        });
        if (updated) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
        }
        return tasks;
      } catch {
        // Fallback to sample tasks
      }
    }

    // Default sample tasks with the dreamy aesthetic context (attributed to users)
    const sampleTasks: Task[] = [
      {
        id: 'tsk-1',
        title: 'Design Dreamy Lavender UI Mockups',
        description: 'Create high-fidelity screens for the user dashboard incorporating pastel pinks and soft violets.',
        priority: 'High',
        dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
        status: 'Pending',
        userId: 'usr-shruti',
        userName: 'Shruti Naik',
        createdAt: new Date().toISOString()
      },
      {
        id: 'tsk-2',
        title: 'Implement Standalone Angular Routing',
        description: 'Configure role-based guards for /user/dashboard and /admin/dashboard navigation.',
        priority: 'High',
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        status: 'Completed',
        userId: 'usr-shruti',
        userName: 'Shruti Naik',
        createdAt: new Date().toISOString()
      },
      {
        id: 'tsk-3',
        title: 'Review PrimeNG 22 Component Customization',
        description: 'Style prime table, dialogs, and button ripple effects with the custom CSS design system.',
        priority: 'Medium',
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        status: 'Pending',
        userId: 'usr-demo',
        userName: 'Demo User',
        createdAt: new Date().toISOString()
      },
      {
        id: 'tsk-4',
        title: 'Weekly Winter Internship Progress Report',
        description: 'Document completed frontend deliverables, architecture decisions, and backend integration readiness.',
        priority: 'Low',
        dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        status: 'Pending',
        userId: 'usr-shruti',
        userName: 'Shruti Naik',
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sampleTasks));
    return sampleTasks;
  }

  private persistTasks(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasksSignal()));
  }
}
