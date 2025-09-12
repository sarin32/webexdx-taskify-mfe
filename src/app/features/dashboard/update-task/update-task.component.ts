import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Priority, Status, TaskData, TaskService } from '../task.service';
import { lastValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmInputModule } from '@spartan-ng/helm/input';
import { HlmLabelModule } from '@spartan-ng/helm/label';
import { BrnSelectModule } from '@spartan-ng/brain/select';
import { HlmSelectModule } from '@spartan-ng/helm/select';
import { HlmDatePickerModule } from '@spartan-ng/helm/date-picker';

@Component({
  selector: 'app-update-task',
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
  templateUrl: './update-task.component.html'
})
export class UpdateTaskComponent {
  private fb = inject(FormBuilder);
  private taskService = inject(TaskService);
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);
  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    priority: ['medium' satisfies Priority as Priority, Validators.required],
    status: ['pending' satisfies Status as Status, Validators.required],
    dueDate: [new Date(), Validators.required],
  });
  isLoading = false;

  statuses: { label: string, value: Status }[] = [
    {
      label: 'Pending',
      value: 'pending',
    },
    {
      label: 'Completed',
      value: 'completed',
    },
  ];

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
  taskData!: TaskData;
  
  ngOnInit(){
    this.setTask()
  }

  async setTask(){
    const taskId = this.activatedRoute.snapshot.params['id']
    this.taskData = await lastValueFrom(this.taskService.getTask(taskId))
    this.form.setValue({
      description: this.taskData.description,
      dueDate: new Date(this.taskData.dueDate) ,
      priority: this.taskData.priority,
      status: this.taskData.isCompleted ? 'completed' : 'pending',
      title: this.taskData.title,
    })
    console.log(this.form.value);
  }
  async onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched()
      return
    }
    try {
      await lastValueFrom(this.taskService.updateTask({
        title: this.form.value.title!,
        priority: this.form.value.priority!,
        description: this.form.value.description!,
        dueDate: new Date(this.form.value.dueDate!),
        isCompleted: Boolean(this.form.value.status === 'completed'),
        taskId: this.taskData._id
      }))
      this.router.navigate(['']);
    } catch (error) {
      let message = 'Something went wrong'
      if (error instanceof HttpErrorResponse) {
        message = error.error.message || message
      }
      this.form.setErrors({ root: message });
    }

    this.form.reset();
  }

  navigateBack() {
    this.router.navigate(['']);
  }
}


