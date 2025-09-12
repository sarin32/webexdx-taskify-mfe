import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Priority, TaskService } from '../task.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmInputModule } from '@spartan-ng/helm/input';
import { HlmLabelModule } from '@spartan-ng/helm/label';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { HlmDatePickerModule } from '@spartan-ng/helm/date-picker';


@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    FormsModule, 
    HlmButtonModule, 
    HlmInputModule, 
    HlmLabelModule,
    BrnSelectModule,
    HlmSelectModule,
    HlmDatePickerModule
  ],
  templateUrl: './create-task.component.html'
})
export class CreateTaskComponent {
  private fb = inject(FormBuilder)
  private taskService = inject(TaskService)
  private router = inject(Router);
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

  navigateBack() {
    this.router.navigate(['']);
  }

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
      this.router.navigate(['/dashboard']);
    } catch (error) {
      let message = 'Something went wrong'
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message
      }
      this.form.setErrors({ root: message });
    }
  }

}

