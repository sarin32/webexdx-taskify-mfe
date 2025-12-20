import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { TaskFormComponent } from '../components/task-form/task-form.component';
import {
  TaskApi,
  type TaskData,
} from '../services/task-api';
@Component({
  selector: 'app-update-task',
  imports: [TaskFormComponent, HlmButtonModule],
  templateUrl: './update-task.html',
  styleUrl: './update-task.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTask {
  private taskService = inject(TaskApi);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  // State signals
  private taskDataSignal = signal<TaskData | null>(null);
  readonly taskData = this.taskDataSignal;
  readonly isLoading = this.taskService.loading;
  serverError = signal<string | null>(null);

  ngOnInit() {
    this.setTask();
  }

  async setTask() {
    const taskId = this.activatedRoute.snapshot.params?.['id'];
    const task = await this.taskService.getTask(taskId);
    if (task) {
      this.taskDataSignal.set(task);
    }
  }

  async onSubmit(formValue: any) {
    this.serverError.set(null);
    if (!this.taskDataSignal()) return;

    try {
      await this.taskService.updateTask({
        title: formValue.title!,
        priority: formValue.priority!,
        description: formValue.description!,
        dueDate: new Date(formValue.dueDate!),
        isCompleted: Boolean(formValue.status === 'completed'),
        taskId: this.taskDataSignal()!._id,
      });
      this.router.navigate(['']);
    } catch (error: any) {
      let message = 'Something went wrong';
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message;
      }
      this.serverError.set(message);
    }
  }

  navigateBack() {
    this.router.navigate(['']);
  }
}
