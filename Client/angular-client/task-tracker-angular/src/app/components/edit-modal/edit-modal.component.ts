import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { TaskComponent } from '../task/task.component';

import { TaskService } from '../../services/task.service';

import { TaskNameExistValidator } from '../../validators/TaskNameExistValidator';

import { TaskResponseModel } from '../../models/TaskResponseModel';
import { Subject, take, takeUntil } from 'rxjs';
import { DateService } from '../../services/date.service';

@Component({
    selector: 'app-edit-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TaskComponent],
    templateUrl: './edit-modal.component.html',
    styleUrls: ['./edit-modal.component.css', '../../styles/buttons.css', '../../styles/form.css']
})
export class EditModalComponent implements OnDestroy, OnInit {
    destroyed$: Subject<void> = new Subject();

    @Input() taskId: number = 0;
    @Input() isCompleted: boolean = false;
    @Input() createdOn: Date = new Date();
    @Input() name: string;
    @Input() deadline: Date = new Date();
    @Input() userId: string = "";
    currentDate: string;

    @Output() setShowModalEvent = new EventEmitter<boolean>();
    @Output() taskUpdated = new EventEmitter<TaskResponseModel>();

    editForm!: any;
    invalidForm: string;
    
    taskNameExistValidator: TaskNameExistValidator = inject(TaskNameExistValidator);

    constructor(private taskService: TaskService, private dateService: DateService) {
        this.invalidForm = "";
        this.name = "";
        this.currentDate = this.dateService.currentDate;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this.editForm = new FormGroup({
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
        deadline: new FormControl(null, [Validators.required]),
        userId: new FormControl(this.userId),
        createdOn: new FormControl(this.createdOn),
        user: new FormControl(""),
        oldName: new FormControl(this.name)
    })
    }

    editTask() {
        // update default values
        this.editForm.controls.id.setValue(this.taskId);
        this.editForm.controls.userId.setValue(this.userId);

        this.taskService
            .editTask(this.editForm.value)
            .pipe(take(1))
            .subscribe({
                next: () => {
                    this.taskUpdated.emit({
                        id: this.taskId,
                        name: this.editForm.value.name!,
                        deadline: this.editForm.value.deadline!,
                        isCompleted: this.isCompleted,
                        createdOn: this.createdOn,
                        user: "",
                        userId: this.userId,
                        oldName: this.name
                    })
                },
                error: x => this.invalidForm = x.error
            });
    }

    closeModal() {
        this.setShowModalEvent.emit(false);
    }
}
