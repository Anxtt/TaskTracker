import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

import { IdentityResponseModel } from '../../models/IdentityResponseModel';
import { TaskResponseModel } from '../../models/TaskResponseModel';
import { LoadingService } from '../../services/loading.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../styles/buttons.css', '../../styles/form.css']
})

export class LoginComponent {
    auth: IdentityResponseModel;
    tasks: TaskResponseModel[];

    loginForm = new FormGroup({
        username: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(16)]),
        password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(18)]),
    });

    constructor(
        private authService: AuthService,
        private messageService: MessageService,
        private loadingService: LoadingService,
        private router: Router) {
        this.auth = { accessToken: "", userName: "", refreshToken: "" };
        this.tasks = [];
    }

    protected handleLogin() {
        this.loadingService.setLoadingOn();

        this.authService
            .login(this.loginForm.value)
            .subscribe({
                next: x => {
                    this.auth = x.body!
                    this.authService.setAuth(x.body!);
                },
                error: e => this.messageService.setErrorMessage(e),
                complete: () => {
                    this.loadingService.setLoadingOff();
                    this.router.navigateByUrl('/tasks')
                    this.messageService.setSuccessMessage({ body: "Login was successful.", show: true });
                }
            });
    }
}
