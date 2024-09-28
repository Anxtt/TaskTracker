import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { DxFormModule, DxPopupModule } from 'devextreme-angular';

import { TaskService } from '../../services/task.service';

import { TaskResponseModel } from '../../models/TaskResponseModel';
import { MessageService } from '../../services/message.service';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
    selector: 'app-task',
    standalone: true,
    imports: [CommonModule, DxFormModule, DxPopupModule],
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css', '../../styles/buttons.css']
})
export class TaskComponent implements OnInit, OnDestroy {
    destroyed$: Subject<void> = new Subject();

    @Input() createdOn: Date = new Date();
    @Input() deadline: Date = new Date();
    @Input() taskId: number = 0;
    @Input() isCompleted = false;
    @Input() name: string = "";
    @Input() userId: string = "";

    @Output() taskDeleted;
    @Output() taskUpdated;
    @Output() sendTaskData;
    @Output() setShowModalEvent;

    editForm = {
        id: this.taskId,
        name: this.name,
        deadline: new Date(),
        isCompleted: this.isCompleted,
        userId: this.userId
    };

    constructor(private taskService: TaskService, private messageService: MessageService) {
        this.taskDeleted = new EventEmitter<number>();
        this.taskUpdated = new EventEmitter<TaskResponseModel>();
        this.setShowModalEvent = new EventEmitter<boolean>();
        this.sendTaskData = new EventEmitter<any>();
    }
    
    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this.editForm.name = this.name;
        this.editForm.isCompleted = this.isCompleted;
        this.editForm.deadline = this.deadline;
        this.editForm.id = this.taskId;
        this.editForm.userId = this.userId
    }

    deleteTask() {
        this.taskService
            .deleteTask(this.taskId, this.userId)
            .pipe(take(1))
            .subscribe({
                next: () => this.taskDeleted.emit(this.taskId),
                error: x => this.messageService.setMessage(x)
            });
    }

    updateIsComplete() {
        this.editForm.isCompleted = !this.editForm.isCompleted;

        this.taskService
            .editTask(this.editForm)
            .pipe(take(1))
            .subscribe({
                next: () => this.taskUpdated.emit({
                    id: this.taskId,
                    deadline: this.deadline,
                    isCompleted: !this.isCompleted,
                    name: this.name,
                    createdOn: this.createdOn,
                    user: '',
                    userId: this.userId
                }),
                error: x => {
                    this.messageService.setMessage(x)
                }
            });
    }

    setShowModal(state: any) {
        this.sendTaskData.emit(this.taskId);
        this.setShowModalEvent.emit(state);
    }
}
