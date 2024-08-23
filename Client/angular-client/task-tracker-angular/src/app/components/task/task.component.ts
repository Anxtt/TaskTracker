import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TaskService } from '../../services/task.service';

import { EditModalComponent } from '../edit-modal/edit-modal.component';

import { TaskResponseModel } from '../../models/TaskResponseModel';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-task',
    standalone: true,
    imports: [CommonModule, EditModalComponent],
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.css', '../../styles/buttons.css']
})
export class TaskComponent {
    @Input() createdOn: string;
    @Input() deadline: string;
    @Input() taskId: number;
    @Input() isCompleted: boolean;
    @Input() name: string;
    
    shouldShow: boolean;
    
    @Output() taskDeleted;
    @Output() taskUpdated;

    constructor(private taskService: TaskService, private messageService: MessageService) {
        this.createdOn = "";
        this.deadline = "";
        this.taskId = 0;
        this.isCompleted = false;
        this.name = "";
        this.shouldShow = false;

        this.taskDeleted = new EventEmitter<number>();
        this.taskUpdated = new EventEmitter<TaskResponseModel>()
    }

    deleteTask() {
        this.taskService
            .deleteTask(this.taskId)
            .subscribe({
                next: () => this.taskDeleted.emit(this.taskId),
                error: x => this.messageService.setErrorMessage(x)
                });
    }

    updateIsComplete() {
        this.taskService.editTask(
            this.taskId,
            this.name,
            this.deadline,
            !this.isCompleted
        ).subscribe({
            next: () => this.taskUpdated.emit({
                id: this.taskId,
                deadline: this.deadline,
                isCompleted: !this.isCompleted,
                name: this.name,
                createdOn: this.createdOn,
                user: ''
            }),
            error: x => {
                console.log(x);
                this.messageService.setErrorMessage(x)
            }
        });
    }

    onTaskUpdated(task: any) {
        this.taskUpdated.emit({
            id: task.id,
            deadline: task.deadline,
            isCompleted: task.isCompleted,
            name: task.name,
            createdOn: task.createdOn,
            user: ''
        });
    }

    setShouldShow(state: boolean) {
        this.shouldShow = state;
    }
}
