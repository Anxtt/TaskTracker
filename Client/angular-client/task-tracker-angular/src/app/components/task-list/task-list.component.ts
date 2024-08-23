import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Observable } from 'rxjs';

import { TaskComponent } from '../task/task.component';

import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { MessageService } from '../../services/message.service';
import { UserActivityService } from '../../services/user-activity.service';

import { IdentityResponseModel } from '../../models/IdentityResponseModel';
import { TaskResponseModel } from '../../models/TaskResponseModel';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [RouterLink, TaskComponent, CommonModule],
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css', '../../styles/buttons.css', '../../styles/filters.css', '../../styles/form.css']
})
export class TaskListComponent implements OnInit {
    isAuth$: Observable<IdentityResponseModel>;
    tasks: TaskResponseModel[];

    isActive$: boolean;

    isCompleted: boolean | string;
    dateSort: string;
    filter: string;

    constructor(
        private authService: AuthService,
        private taskService: TaskService,
        private userActivityService: UserActivityService,
        private messageService: MessageService) {
        this.isAuth$ = this.authService.getAuth();
        this.tasks = [];
        this.isCompleted = "";
        this.dateSort = "";
        this.filter = "";
        this.isActive$ = true;
    }

    ngOnInit(): void {
       this.taskService.all()
            .subscribe({
                next: x => {
                    if (x.status === 204) {
                        this.tasks = [];
                        this.messageService.setErrorMessage(x);
                        return;
                    }

                    this.tasks = x.body!;
                },
                error: x => {
                    if (x.status === 429) {
                        this.messageService.setErrorMessage(x);
                        return;
                    }

                    this.messageService.setErrorMessage(x);
                }
            });

        // направи това глобално?
        this.userActivityService.isActive.subscribe(x => this.isActive$ = x);
    }

    reset() {
        console.log("Reset idle timer");
        this.isActive$ = true;
        this.userActivityService.reset();
    }

    onTaskDeleted(id: number) {
        this.tasks = this.tasks.filter(x => x.id !== id);
    }

    onTaskUpdated(task: any) {
        this.tasks = this.tasks.map(x => {
            if (x.id !== task.id) {
                return x;
            }

            return task;
        })
    }

    handleFiltering(isCompleted: boolean | string) {
        this.taskService
            .allFiltered(isCompleted, this.dateSort, this.filter)
            .subscribe({
                next: x => {
                    if (x.status === 204) {
                        this.tasks = [];
                        this.messageService.setErrorMessage(x);
                        return;
                    }

                    this.tasks = x.body!;
                },
                error: x => {
                    if (x.status === 429) {
                        this.messageService.setErrorMessage(x);
                        return;
                    }

                    this.messageService.setErrorMessage(x);
                }
            });
    }

    filterByState(isCompleted: boolean | string) {
        if (isCompleted === this.isCompleted) {
            this.isCompleted = '';
            this.handleFiltering('');
            return;
        }

        this.isCompleted = isCompleted;
        this.handleFiltering(isCompleted);
    }

    setParam(param: string, event: Event) {
        let target = event.currentTarget as HTMLInputElement;

        if (param === 'dateSort') {
            this.dateSort = target.value;
        }
        else {
            this.filter = target.value;
        }
    }
}
