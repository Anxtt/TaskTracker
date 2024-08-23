import { Injectable } from "@angular/core";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

import { Observable } from "rxjs";

import { AuthService } from "../services/auth.service";

@Injectable({ providedIn: 'root' })
export class EmailExistValidator implements AsyncValidator {
    constructor(private authService: AuthService) { }
    
    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.authService
            .doesExistByEmail(control.value);
    }
}