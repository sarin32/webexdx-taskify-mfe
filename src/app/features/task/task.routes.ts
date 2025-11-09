import type { Routes } from '@angular/router';
import { CreateTask } from './create-task/create-task';
import { Task } from './task';
import { UpdateTask } from './update-task/update-task';

export const taskRoutes: Routes = [
  {
    path: '',
    component: Task,
  },
  {
    path: 'create',
    component: CreateTask,
  },
  {
    path: 'edit/:id',
    component: UpdateTask,
  },
];
