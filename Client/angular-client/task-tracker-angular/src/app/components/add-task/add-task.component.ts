import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TaskService } from '../../services/task.service';

import { TaskNameExistValidator } from '../../validators/TaskNameExistValidator';
import { MessageService } from '../../services/message.service';
import { Subject, Subscription, finalize, take, takeUntil } from 'rxjs';
import { DateService } from '../../services/date.service';

@Component({
    selector: 'app-add-task',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './add-task.component.html',
    styleUrls: ['./add-task.component.css', '../../styles/buttons.css', '../../styles/form.css']
})
export class AddTaskComponent implements OnDestroy {
    destroyed$: Subject<void> = new Subject();

    taskNameExistValidator: TaskNameExistValidator = inject(TaskNameExistValidator);
    currentDate: string;

    constructor(
        private taskService: TaskService,
        private messageService: MessageService,
        private router: Router,
        private dateService: DateService
    ) {
        this.currentDate = this.dateService.currentDate;
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    createForm = new FormGroup({
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
            }
        ),
        deadline: new FormControl(null, [Validators.required])
    });

    // something() {
    //     console.log(this.createForm.get('taskName')?.errors);
    // }

    handleCreate() {
        const subs: Subscription = this.taskService
            .createTask(this.createForm.value)
            // .pipe(take(1/2/3/4/5))
            // .pipe(finalize(() => subs.unsubscribe())) // или complete долу
            // .pipe(takeUntil(this.destroyed$))
            .subscribe({
                error: x => {
                    this.messageService.setMessage(x);
                },
                next: () => {
                    this.router.navigateByUrl('tasks')
                    this.messageService.setMessage({ body: "Task was added successfully." });
                },
                complete: () => subs.unsubscribe()
            });
    };
}
