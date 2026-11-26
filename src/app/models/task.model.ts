/**
 * Priority Level for a Task
 * - Low: Routine, non-urgent tasks (emerald badge)
 * - Medium: Standard priority tasks (amber/periwinkle badge)
 * - High: Critical or urgent deadlines (deep violet/red badge)
 */
export type TaskPriority = 'Low' | 'Medium' | 'High';

/**
 * Completion Status of a Task
 * - Pending: Task is yet to be finished
 * - Completed: Task is completed by the user
 */
export type TaskStatus = 'Pending' | 'Completed';

/**
 * Filter options for Task listing views
 * - All: View every task
 * - Pending: View tasks awaiting completion
 * - Completed: View finished tasks
 * - Overdue: View incomplete tasks past their deadline
 */
export type TaskFilter = 'All' | 'Pending' | 'Completed' | 'Overdue';

/**
 * Core Task Model
 * Represents a single task created by a user.
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string; // ISO format string (e.g., '2026-12-01')
  dueTime?: string; // Optional time string (e.g., '14:30' or '2:30 PM')
  status: TaskStatus;
  userId: string;
  userName?: string; // Included for Admin views to attribute task ownership
  createdAt: string;
  updatedAt?: string;
}

/**
 * Task Creation Payload
 * Data required to add a new task.
 */
export interface CreateTaskDto {
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  dueTime?: string;
}

/**
 * Task Update Payload
 * Data allowable when updating an existing task.
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: string;
  dueTime?: string;
  status?: TaskStatus;
}

/**
 * User Task Statistics
 * Summarized numbers displayed on the user's dashboard overview cards.
 */
export interface TaskStatistics {
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  overdueTasks: number;
  highPriorityTasks: number;
  completionRate: number; // percentage from 0 to 100
}

/**
 * Platform-wide Admin Statistics
 * Summarized numbers and chart data displayed on the Admin dashboard.
 */
export interface AdminStatistics {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  priorityDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  statusDistribution: {
    pending: number;
    completed: number;
  };
}
