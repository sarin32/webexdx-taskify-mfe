

import { DatePipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Priority, TaskData, TaskService } from './task.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HlmButton } from '@spartan-ng/helm/button';


@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, FormsModule, DatePipe,HlmButton],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private router = inject(Router)
  private fb = inject(FormBuilder)
  private taskService = inject(TaskService)

  priorities: { label: string, value: Priority | 'all' }[] = [
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
    }
  ];
  statuses: { label: string, value: 'all' | 'pending' | 'completed' }[] = [
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
    priority: new FormControl<Priority | 'all'>('all', { validators: Validators.required }),
    status: new FormControl<'all' | 'pending' | 'completed'>('all', { validators: Validators.required }),
  });
  tasks: TaskData[] = [];

  ngOnInit() {
    this.fetchTaskList()
  }

  navToCreateTask() {
    this.router.navigate(['create'])
  }

  async fetchTaskList() {
    try {
      this.tasks = await lastValueFrom(this.taskService.getTaskList({
        priority: this.form.value.priority!,
        status: this.form.value.status!
      }))
    } catch (error) {
      let message = 'Something went wrong'
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message
      }
      this.form.setErrors({ root: message });
    }
  }

  async deleteTask(taskId: string) {
    await lastValueFrom(this.taskService.deleteTask(taskId))
    this.fetchTaskList(); // Apply filter after deletion
  }

  edit(task: TaskData) {
    this.router.navigate(['edit', task._id])
  }
}

