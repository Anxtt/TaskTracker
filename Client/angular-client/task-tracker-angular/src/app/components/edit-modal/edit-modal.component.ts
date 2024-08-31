import { CommonModule, DatePipe } from '@angular/common';
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
    @Input() taskId: number = 0;
    @Input() isCompleted: boolean = false;
    @Input() createdOn: Date = new Date();
    @Input() name: string;
    @Input() deadline: Date = new Date();
    currentDate: string = new Date().toISOString().slice(0, 10);

    @Output() setShowModalEvent = new EventEmitter<boolean>();
    @Output() taskUpdated = new EventEmitter<TaskResponseModel>();

    invalidForm: string;
    
    taskNameExistValidator: TaskNameExistValidator = inject(TaskNameExistValidator);

    constructor(private taskService: TaskService) {
        this.invalidForm = "";
        this.name = "";
    }

    editForm = new FormGroup({
        id: new FormControl(this.taskId),
        isCompleted: new FormControl(this.isCompleted),
        name: new FormControl(
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

    editTask() {
        this.editForm.controls.id.setValue(this.taskId);

        this.taskService
            .editTask(this.editForm.value)
            .subscribe({
                next: () => {
                    this.taskUpdated.emit({
                        id: this.taskId,
                        name: this.editForm.value.name!,
                        deadline: this.editForm.value.deadline!,
                        isCompleted: this.isCompleted,
                        createdOn: this.createdOn,
                        user: ''
                    })
                },
                error: x => this.invalidForm = x.error
            });
    }

    closeModal() {
        this.setShowModalEvent.emit(false);
    }
}
