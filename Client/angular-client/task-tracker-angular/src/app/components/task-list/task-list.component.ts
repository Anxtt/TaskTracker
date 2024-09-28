import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Observable, Subject, take, takeUntil } from 'rxjs';

import { DxTileViewModule } from 'devextreme-angular';

import { TaskComponent } from '../task/task.component';
import { DxEditModalComponent } from '../dx-edit-modal/dx-edit-modal.component';
import { EditModalComponent } from '../edit-modal/edit-modal.component';

import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { MessageService } from '../../services/message.service';
import { LoadingService } from '../../services/loading.service';

import { IdentityResponseModel } from '../../models/IdentityResponseModel';
import { TaskResponseModel } from '../../models/TaskResponseModel';

@Component({
    selector: 'app-task-list',
    standalone: true,
    imports: [RouterLink, TaskComponent, DxEditModalComponent, EditModalComponent, CommonModule, DxTileViewModule],
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css', '../../styles/buttons.css', '../../styles/filters.css', '../../styles/form.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
    isAuth$: Observable<IdentityResponseModel>;
    destroyed$: Subject<void> = new Subject();

    tasks: TaskResponseModel[];
    showModal: boolean = false;
    taskToEdit: any;

    noContent: boolean = false;
    isCompleted: boolean | string;
    dateSort: string;
    filter: string;

    constructor(
        private authService: AuthService,
        private taskService: TaskService,
        private messageService: MessageService,
        private loadingService: LoadingService) {
        this.isAuth$ = this.authService.getAuth();
        this.tasks = [];
        this.isCompleted = "";
        this.dateSort = "";
        this.filter = "";
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this.loadingService.setLoadingOn();
        this.taskService.all()
            .pipe(take(1))
            .subscribe({
                next: x => {
                    if (x.status === 204) {
                        this.tasks = [];
                        this.messageService.setMessage(x);
                        return;
                    }

                    this.tasks = x.body!;
                    this.noContent = false;
                },
                error: x => {
                    if (x.status === 429) {
                        this.messageService.setMessage(x);
                        return;
                    }

                    this.messageService.setMessage(x);
                },
                complete: () => {
                    this.loadingService.setLoadingOff();
                }
            });
    }

    onTaskDeleted(id: number) {
        this.tasks = this.tasks.filter(x => x.id !== id);
        this.messageService.setMessage({ body: "Task was deleted successfully." });
    }

    onTaskUpdated(task: any) {
        this.tasks = this.tasks.map(x => {
            if (x.id !== task.id) {
                return x;
            }

            return task;
        })

        this.setShowModal(false);
        this.messageService.setMessage({ body: "Task was updated successfully." });
    }

    handleFiltering(isCompleted: boolean | string) {
        this.taskService
            .allFiltered(isCompleted, this.dateSort, this.filter)
            .pipe(take(1))
            .subscribe({
                next: x => {
                    this.noContent = false;

                    if (x.status === 204) {
                        this.tasks = [];

                        if (this.filter !== "" || this.dateSort !== "" || this.isCompleted !== "") {
                            this.noContent = true;
                        }

                        this.messageService.setMessage(x);
                        return;
                    }

                    this.tasks = x.body!;
                },
                error: x => {
                    if (x.status === 429) {
                        this.messageService.setMessage(x);
                        return;
                    }

                    this.messageService.setMessage(x);
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

    getTaskToEdit(e: any) {
        this.taskToEdit = { ...(this.tasks.find(x => x.id === e)) };
    }

    setShowModal(state: any) {
        this.showModal = state;
    }
}
