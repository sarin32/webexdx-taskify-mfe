import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { TaskFormComponent } from '../components/task-form/task-form.component';
import { TaskApi } from '../services/task-api';

@Component({
  selector: 'app-create-task',
  imports: [TaskFormComponent, HlmButtonModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTask {
  private taskService = inject(TaskApi);
  private router = inject(Router);

  // Use task service's loading signal
  readonly isLoading = this.taskService.loading;
  serverError = signal<string | null>(null);

  navigateBack() {
    this.router.navigate(['']);
  }

  async onSubmit(formValue: any) {
    this.serverError.set(null);
    try {
      await this.taskService.createTask({
        title: formValue.title!,
        priority: formValue.priority!,
        description: formValue.description!,
        dueDate: new Date(formValue.dueDate!),
      });
    } catch (error: any) {
      let message = 'Something went wrong';
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message;
      }
      this.serverError.set(message);
    }
  }
}
