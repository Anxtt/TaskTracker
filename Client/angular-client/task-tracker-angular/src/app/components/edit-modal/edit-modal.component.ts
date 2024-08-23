import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaskComponent } from '../task/task.component';

import { TaskService } from '../../services/task.service';

import { TaskNameExistValidator } from '../../validators/TaskNameExistValidator';

import { TaskResponseModel } from '../../models/TaskResponseModel';

@Component({
    selector: 'app-edit-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TaskComponent],
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.css', '../../styles/buttons.css', '../../styles/form.css']
})
export class EditModalComponent {
    @Input() taskId: number;
    @Input() isCompleted: boolean;
    @Input() createdOn: string;
    @Input() currentTaskName: string;
    @Input() currentDeadline: string;
    currentDate: string;

    @Output() shouldShow = new EventEmitter<boolean>();
    @Output() taskUpdated = new EventEmitter<TaskResponseModel>();

    invalidForm: string;
    
    taskNameExistValidator: TaskNameExistValidator = inject(TaskNameExistValidator);

    editForm = new FormGroup({
        taskName: new FormControl(
            null,
            {
                validators:
                    [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(16)
                    ],
                    asyncValidators: this.taskNameExistValidator.validate.bind(this.taskNameExistValidator),
                    updateOn: 'blur'
            }),
        deadline: new FormControl(null, [Validators.required])
    })

    constructor(private taskService: TaskService) {
        this.currentDate = new Date().toISOString().slice(0, 10);
        this.invalidForm = "";
        this.currentDeadline = "";
        this.currentTaskName = "";
        this.createdOn = ""
        this.isCompleted = false;
        this.taskId = 0;
    }

    closeModal() {
        this.shouldShow.emit(false);
    }

    editTask() {
        this.taskService
            .editTask(this.taskId, this.editForm.value.taskName!, this.editForm.value.deadline!, this.isCompleted)
            .subscribe({
                next: () => {
                    this.shouldShow.emit(false);
                    this.taskUpdated.emit({
                        id: this.taskId,
                        name: this.editForm.value.taskName!,
                        deadline: this.editForm.value.deadline!,
                        isCompleted: this.isCompleted,
                        createdOn: this.createdOn,
                        user: ''
                    })
                },
                error: x => this.invalidForm = x.error
            });
    }
}
