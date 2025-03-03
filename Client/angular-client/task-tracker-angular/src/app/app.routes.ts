import { Routes } from '@angular/router';

import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ErrorComponent } from './components/error/error.component';
import { UserStatisticsComponent } from './components/user-statistics/user-statistics.component';

import { AuthGuard } from './guards/auth.guard';
import { LoggedAuthGuard } from './guards/loggedAuth.guard';

export const routes: Routes = [
    {
        path: '',
        // pathMatch: '',
        // resolve: { auth: AuthResolver },
        // redirectTo: ,
        children: [
            {
                path: '',
                title: 'Task Tracker',
                component: HomeComponent
            },

            {
                path: 'about',
                title: 'About',
                component: AboutComponent
            },

            {
                path: 'login',
                title: 'Login',
                component: LoginComponent,
                canActivate: [LoggedAuthGuard]
            },

            {
                path: 'register',
                title: 'Register',
                component: RegisterComponent,
                canActivate: [LoggedAuthGuard]
            },

            {
                path: 'tasks',
                title: 'Tasks',
                component: TaskListComponent,
                canActivate: [AuthGuard]
            },

            {
                path: 'addTask',
                title: 'Add Task',
                component: AddTaskComponent,
                canActivate: [AuthGuard]
            },

            {
                path: 'users',
                title: 'User Statistics',
                component: UserStatisticsComponent
            },

            {
                path: '**',
                title: 'Error',
                component: ErrorComponent
            }
        ]
    }
];
