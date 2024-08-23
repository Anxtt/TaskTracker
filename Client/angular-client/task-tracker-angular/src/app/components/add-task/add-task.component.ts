import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TaskService } from '../../services/task.service';

import { TaskNameExistValidator } from '../../validators/TaskNameExistValidator';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-add-task',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.css', '../../styles/buttons.css', '../../styles/form.css']
})
export class AddTaskComponent {
    taskNameExistValidator: TaskNameExistValidator = inject(TaskNameExistValidator);
    currentDate: string;    

    constructor(private taskService: TaskService, private messageService: MessageService, private router: Router) {
        this.currentDate = new Date().toISOString().slice(0, 10);
    }

    createForm = new FormGroup({
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
            }
        ),
        deadline: new FormControl(null, [Validators.required])
    });

    // something() {
    //     console.log(this.createForm.get('taskName')?.errors);
    // }

    handleCreate() {
        this.taskService
            .createTask(this.createForm)
            .subscribe({
                error: x => {
                    this.messageService.setErrorMessage(x);
                },
                next: () => this.router.navigateByUrl('tasks')
            });
    };
}
