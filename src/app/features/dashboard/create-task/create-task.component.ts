import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Priority, TaskService } from '../task.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-create-task',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  private fb = inject(FormBuilder)
  private taskService = inject(TaskService)
  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium' satisfies Priority as Priority, Validators.required],
    dueDate: ['', Validators.required],
  });
  isLoading = false;

  priorities: { label: string, value: Priority }[] = [
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
    }
  ];

  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }
    try {
      await lastValueFrom(this.taskService.createTask({
        title: this.form.value.title!,
        priority: this.form.value.priority!,
        description: this.form.value.description!,
        dueDate: new Date(this.form.value.dueDate!)
      }))

    } catch (error) {
      let message = 'Something went wrong'
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message
      }
      this.form.setErrors({ root: message });
    }

    this.form.reset();
  }

}

