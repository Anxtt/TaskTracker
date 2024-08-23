import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

import { Observable } from "rxjs";

import { TaskService } from "../services/task.service";

@Injectable({ providedIn: 'root' })
export class TaskNameExistValidator implements AsyncValidator {
    constructor(private taskService: TaskService) { }
    
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.taskService
            .doesExistByName(control.value);
    }
}