import { Routes } from '@angular/router';
import { CreateTaskComponent } from './create-task/create-task.component';
import { DashboardComponent } from './dashboard.component';
import { UpdateTaskComponent } from './update-task/update-task.component';

export const dashboardRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    },
    {
        path: 'create',
        component: CreateTaskComponent,
    },
    {
        path: 'edit/:id',
        component: UpdateTaskComponent,
    }
];
