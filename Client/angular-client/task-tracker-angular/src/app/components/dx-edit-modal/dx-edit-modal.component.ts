import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DxPopupModule, DxFormModule } from 'devextreme-angular';

import { TaskComponent } from '../task/task.component';

import { TaskService } from '../../services/task.service';
import { MessageService } from '../../services/message.service';

import { TaskResponseModel } from '../../models/TaskResponseModel';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
    selector: 'app-dx-edit-modal',
    standalone: true,
    imports: [DxPopupModule, DxFormModule, TaskComponent],
    templateUrl: './dx-edit-modal.component.html',
    styleUrl: './dx-edit-modal.component.css'
})
export class DxEditModalComponent implements OnInit, OnDestroy {
    destroyed$: Subject<void> = new Subject();

    @Input() showModal: boolean = false;
    @Input() task: TaskResponseModel | undefined;

    @Output() setShowModalEvent: EventEmitter<boolean> = new EventEmitter();
    @Output() taskUpdated: EventEmitter<TaskResponseModel> = new EventEmitter<TaskResponseModel>();

    editForm: TaskResponseModel | undefined;
    currentDate: string = new Date().toISOString().slice(0, 10);
    taskNameErrorMessage: string = "";
    buttonOptions = { text: 'Edit', type: 'info', useSubmitBehavior: true };

    constructor(private taskService: TaskService, private messageService: MessageService) { }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this.editForm = this.task;
    }

    editTask(e: any) {
        e.preventDefault();

        this.taskService
            .editTask(this.editForm)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: () => {
                    this.taskUpdated.emit(this.editForm)
                },
                error: x => this.messageService.setMessage(x)
            });
    }

    taskNameCheck = (async ({ value }: any) => {
        return new Promise<void>((resolve, reject) => {
            if (value === this.editForm?.name!) {
                return resolve();
            }

            this.taskService.doesExistByName(value)
                .pipe(take(1))
                .subscribe((x: any) => {
                    if (x?.slowDown) {
                        this.messageService.setMessage(x);
                        this.taskNameErrorMessage = "You have exceeded the API quota for this action. Try again later.";
                        return reject();
                    }
                    else if (x !== null) {
                        this.taskNameErrorMessage = "Task Name already exists.";
                        return reject();
                    }

                    return resolve();
                })
        })
    }).bind(this);

    setShowModal(state: boolean) {
        this.showModal = state;
        this.setShowModalEvent.emit(state);
    }
}