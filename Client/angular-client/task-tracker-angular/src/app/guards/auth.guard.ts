import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { catchError, of, switchMap } from 'rxjs';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

    canActivate() {
        const isAuth = this.authService.getCurrentAuth();

        if (isAuth?.accessToken === "") {
            this.router.navigateByUrl("/login");
            return false;
        }

        return this.authService.verifyUser()
            .pipe(
                catchError(x => {
                    this.messageService.setErrorMessage(x);
                    return of({ userName: "", accessToken: "", refreshToken: "" })
                }),
                switchMap(x => {
                    this.authService.setAuth(x);

                    if (x?.accessToken === "") {
                        this.router.navigateByUrl("/login");
                        return of(false);
                    }

                    return of(true);
                })
            );
    }
}