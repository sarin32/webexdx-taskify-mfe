import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmDatePickerModule } from '@spartan-ng/helm/date-picker';
import { HlmInputModule } from '@spartan-ng/helm/input';
import { HlmLabelModule } from '@spartan-ng/helm/label';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { type Priority, TaskApi } from '../services/task-api';

@Component({
  selector: 'app-create-task',
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
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTask {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskApi);
  private router = inject(Router);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium' satisfies Priority as Priority, Validators.required],
    dueDate: ['', Validators.required],
  });

  // Use task service's loading signal
  readonly isLoading = this.taskService.loading;

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

  navigateBack() {
    this.router.navigate(['']);
  }

  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      await this.taskService.createTask({
        title: this.form.value.title!,
        priority: this.form.value.priority!,
        description: this.form.value.description!,
        dueDate: new Date(this.form.value.dueDate!),
      });
      this.router.navigate(['/']);
    } catch (error) {
      let message = 'Something went wrong';
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message;
      }
      this.form.setErrors({ root: message });
    }
  }
}
