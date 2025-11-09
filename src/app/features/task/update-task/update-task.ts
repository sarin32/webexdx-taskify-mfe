import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmDatePickerModule } from '@spartan-ng/helm/date-picker';
import { HlmInputModule } from '@spartan-ng/helm/input';
import { HlmLabelModule } from '@spartan-ng/helm/label';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import {
  type Priority,
  type Status,
  TaskApi,
  type TaskData,
} from '../services/task-api';

@Component({
  selector: 'app-update-task',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HlmButtonModule,
    HlmInputModule,
    HlmLabelModule,
    BrnSelectModule,
    HlmSelectModule,
    HlmDatePickerModule,
  ],
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTask {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskApi);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium' satisfies Priority as Priority, Validators.required],
    status: ['pending' satisfies Status as Status, Validators.required],
    dueDate: [new Date(), Validators.required],
  });

  // State signals
  private taskDataSignal = signal<TaskData | null>(null);
  readonly taskData = this.taskDataSignal;
  readonly isLoading = this.taskService.loading;

  statuses: { label: string; value: Status }[] = [
    {
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'Completed',
      value: 'completed',
    },
  ];

  priorities: { label: string; value: Priority }[] = [
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

  ngOnInit() {
    this.setTask();
  }

  async setTask() {
    const taskId = this.activatedRoute.snapshot.params?.['id'];
    const task = await this.taskService.getTask(taskId);
    if (task) {
      this.taskDataSignal.set(task);
      this.form.setValue({
        description: task.description,
        dueDate: new Date(task.dueDate),
        priority: task.priority,
        status: task.isCompleted ? 'completed' : 'pending',
        title: task.title,
      });
    }
  }

  async onSubmit() {
    if (!this.form.valid || !this.taskDataSignal()) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      await this.taskService.updateTask({
        title: this.form.value.title!,
        priority: this.form.value.priority!,
        description: this.form.value.description!,
        dueDate: new Date(this.form.value.dueDate!),
        isCompleted: Boolean(this.form.value.status === 'completed'),
        taskId: this.taskDataSignal()!._id,
      });
      this.router.navigate(['']);
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message;
      }
      this.form.setErrors({ root: message });
    }
  }

  navigateBack() {
    this.router.navigate(['']);
  }
}
