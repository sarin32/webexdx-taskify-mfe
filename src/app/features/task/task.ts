import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { type Priority, TaskApi, type TaskData } from './services/task-api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: 'app-task',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    HlmButton,
    HlmCardImports,
    BrnSelectModule,
    HlmSelectModule,
  ],
  templateUrl: './task.html',
  styleUrl: './task.css',
})
export class Task {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private taskApi = inject(TaskApi);

  // Read-only computed values from service
  readonly tasks = this.taskApi.tasks;
  readonly loading = this.taskApi.loading;
  readonly error = this.taskApi.error;
  loadingTaskId = signal<string | null>(null);

  priorities: { label: string; value: Priority | 'all' }[] = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Low',
      value: 'low',
    },
    {
      label: 'Medium',
      value: 'medium',
    },
    {
      label: 'High',
      value: 'high',
    },
  ];
  statuses: { label: string; value: 'all' | 'pending' | 'completed' }[] = [
    {
      label: 'All',
      value: 'all',
    },
    {
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'Completed',
      value: 'completed',
    },
  ];
  form = this.fb.group({
    priority: new FormControl<Priority | 'all'>('all', {
      validators: Validators.required,
    }),
    status: new FormControl<'all' | 'pending' | 'completed'>('all', {
      validators: Validators.required,
    }),
  });

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.taskApi.setFilter({
        priority: this.form.value.priority!,
        status: this.form.value.status!,
      });
    });
  }

  navToCreateTask() {
    this.router.navigate(['create']);
  }

  edit(task: TaskData) {
    this.router.navigate(['edit', task._id]);
  }

  async deleteTask(taskId: string) {
    await this.taskApi.deleteTask(taskId);
  }

  async toggleTaskStatus(task: TaskData) {
    this.loadingTaskId.set(task._id);
    try {
      await this.taskApi.updateTask({
        title: task.title,
        description: task.description,
        priority: task.priority,
        dueDate: task.dueDate,
        isCompleted: !task.isCompleted,
        taskId: task._id,
      });
    } finally {
      this.loadingTaskId.set(null);
    }
  }
}
