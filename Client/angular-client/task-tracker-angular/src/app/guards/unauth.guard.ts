import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { catchError, of, switchMap } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

    // Prevents the user from accessing login and register when authenticated
    canActivate() {
        const isAuth = this.authService.getCurrentAuth();

        if (isAuth?.accessToken) {
            this.router.navigateByUrl("/tasks");
            return false;
        }

        return this.authService.verifyUser()
                        .pipe(
                            catchError(x => {
                                const state = (this.router.getCurrentNavigation()?.extras.state as any)?.["from"];

                                if (state === "unauthorized") {
                                    this.messageService.setErrorMessage(x);
                                }
                                return of({ userName: "", accessToken: "", refreshToken: "" })
                            }),
                            switchMap(x => {
                                this.authService.setAuth(x);

                                if (x?.accessToken) {
                                    this.router.navigateByUrl("/tasks");
                                    return of(false);
                                }

                                return of(true);
                            })
                        );
    }
}
