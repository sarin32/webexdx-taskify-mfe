import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, effect, Injectable, inject, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed';
export type Filter = { priority: 'all' | Priority; status: 'all' | Status };

export interface TaskData {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  priority: Priority;
  dueDate: Date;
}

export interface CreateTaskParams {
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
}

export interface UpdateTaskParams {
  taskId: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: Date;
  isCompleted: boolean;
}

export interface GetTaskListParams {
  priority: 'all' | Priority;
  status: 'all' | Status;
}

@Injectable({
  providedIn: 'root',
})
export class TaskApi {
  private httpClient = inject(HttpClient);

  // State signals
  private tasksSignal = signal<TaskData[]>([]);
  private filterSignal = signal<Filter>({ priority: 'all', status: 'all' });
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // Computed values
  readonly tasks = computed(() => this.tasksSignal());
  readonly filter = computed(() => this.filterSignal());
  readonly loading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  constructor() {
    effect(() => {
      const filter = this.filterSignal();

      this.fetchTaskList(filter).catch((error) => {
        console.error('Failed to fetch tasks:', error);
      });
    });
  }

  async createTask(body: CreateTaskParams) {
    try {
      this.loadingSignal.set(true);
      const response = await lastValueFrom(
        this.httpClient.post<{ id: string }>(
          `${environment.serverBaseUrl}/task`,
          body,
        ),
      );
      await this.fetchTaskList(this.filterSignal());
      this.errorSignal.set(null);
      return response;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async fetchTaskList(filter: Filter) {
    try {
      this.loadingSignal.set(true);
      const tasks = await lastValueFrom(
        this.httpClient.get<TaskData[]>(`${environment.serverBaseUrl}/task`, {
          params: {
            priority: filter.priority,
            status: filter.status,
          },
        }),
      );
      this.tasksSignal.set(tasks ?? []);
      this.errorSignal.set(null);
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async deleteTask(taskId: string) {
    try {
      this.loadingSignal.set(true);
      await lastValueFrom(
        this.httpClient.delete(`${environment.serverBaseUrl}/task/${taskId}`),
      );
      await this.fetchTaskList(this.filterSignal());
      this.errorSignal.set(null);
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async getTask(taskId: string) {
    try {
      this.loadingSignal.set(true);
      const task = await lastValueFrom(
        this.httpClient.get<TaskData>(
          `${environment.serverBaseUrl}/task/${taskId}`,
        ),
      );
      this.errorSignal.set(null);
      return task;
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateTask(params: UpdateTaskParams) {
    try {
      this.loadingSignal.set(true);
      lastValueFrom(
        await this.httpClient.put(
          `${environment.serverBaseUrl}/task/${params.taskId}`,
          {
            isCompleted: params.isCompleted,
            title: params.title,
            description: params.description,
            dueDate: params.dueDate,
            priority: params.priority,
          },
        ),
      );
      await this.fetchTaskList(this.filterSignal());
      this.errorSignal.set(null);
    } catch (error: unknown) {
      this.handleError(error);
      throw error;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  setFilter(filter: Filter) {
    this.filterSignal.set(filter);
  }

  private handleError(error: unknown) {
    let message = 'Something went wrong';
    if (error instanceof HttpErrorResponse) {
      message = error.error.message || message;
    }
    this.errorSignal.set(message);
  }
}
