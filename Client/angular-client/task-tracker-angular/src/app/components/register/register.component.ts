import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { UserNameExistValidator } from '../../validators/UserNameExistValidator';
import { MessageService } from '../../services/message.service';

import { EmailExistValidator } from '../../validators/EmailExistValidator';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css', '../../styles/buttons.css', '../../styles/form.css']
})

export class RegisterComponent implements OnDestroy {
    destroyed$: Subject<void> = new Subject();

    passwordValidators = [Validators.required, Validators.minLength(6), Validators.maxLength(18)];
    emailValidator: EmailExistValidator = inject(EmailExistValidator);
    userNameValidator: UserNameExistValidator = inject(UserNameExistValidator);

    invalidUser: boolean = false;

    registerForm = new FormGroup({
        username: new FormControl(null,
            {
                validators:
                    [
                        Validators.required,
                        Validators.minLength(4),
                        Validators.maxLength(16)
                    ],
                asyncValidators: this.userNameValidator.validate.bind(this.userNameValidator), updateOn: 'blur'
            }),
        email: new FormControl(null,
            {
                validators:
                    [
                        Validators.required,
                        Validators.email,
                        Validators.minLength(6),
                        Validators.maxLength(50)
                    ],
                asyncValidators: this.emailValidator.validate.bind(this.emailValidator), updateOn: 'blur'
            }),
        password: new FormControl(null, this.passwordValidators),
        confirmPassword: new FormControl(null, this.passwordValidators),
    }, {
        validators: (control) => {
            const password = control.get('password');
            const confirmPassword = control.get('confirmPassword');

            return password?.value === confirmPassword?.value
                ? null
                : { notmatched: true };
        }
    });

    constructor(private authSerivce: AuthService, private messageService: MessageService, private router: Router) { }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    // something() {
    //     console.log(this.registerForm.get("username")?.errors);
    //     this.registerForm.get("username")!.errors![""]
    //     this.registerForm.get("username")?.errors?.[""]
    //     this.registerForm.get("username")?.errors![""]
    // }

    protected handleRegister() {
        this.authSerivce
            .register(this.registerForm.value)
            .pipe(take(1))
            .subscribe({
                next: x => x,
                error: e => this.messageService.setMessage(e),
                complete: () => {
                    this.router.navigateByUrl('/login');
                    this.messageService.setMessage({ body: "Registration was successful" });
                }
            });
    }
}
