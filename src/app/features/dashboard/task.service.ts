import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export type Priority = 'low' | 'medium' | 'high'
export type Status = 'pending' |'completed'

export interface TaskData {
  _id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  priority: Priority,
  dueDate: Date
}

export interface CreateTaskParams {
  title: string,
  description: string,
  priority: Priority,
  dueDate: Date
}

export interface UpdateTaskParams {
  taskId: string,
  title: string,
  description: string,
  priority: Priority,
  dueDate: Date,
  isCompleted: boolean
}

export interface GetTaskListParams {
  priority: 'all' |Priority,
  status: 'all' | Status
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private httpClient = inject(HttpClient);

  createTask(body: CreateTaskParams) {
    return this.httpClient.post<{ id: string }>(
      `${environment.serverBaseUrl}/task`,
      body,
    );
  }

  getTaskList({ priority, status }: GetTaskListParams) {
    return this.httpClient.get<TaskData[]>(
      `${environment.serverBaseUrl}/task`,
      {
        params: {
          priority,
          status
        }
      }
    );
  }

  deleteTask(taskId: string) {
    return this.httpClient.delete(
      `${environment.serverBaseUrl}/task/${taskId}`,
    );
  }

  getTask(taskId: string) {
    return this.httpClient.get<TaskData>(
      `${environment.serverBaseUrl}/task/${taskId}`,
    );
  }

  updateTask({
    taskId,
    isCompleted,
    title,
    description,
    dueDate,
    priority
  }: UpdateTaskParams) {
    return this.httpClient.put(
      `${environment.serverBaseUrl}/task/${taskId}`,
      {
        isCompleted,
        title,
        description,
        dueDate,
        priority
      },
    );
  }
}
