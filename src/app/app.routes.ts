import type { Routes } from '@angular/router';
import { taskRoutes } from './features/task/task.routes';

export const routes: Routes = [{ path: '', children: taskRoutes }];
