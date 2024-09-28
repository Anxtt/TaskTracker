import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Subject, catchError, of, switchMap, take, takeUntil } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class UnauthGuard implements CanActivate, OnDestroy {
    destroyed$: Subject<void> = new Subject();

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    // Prevents the user from accessing login and register when authenticated
    canActivate() {
        const isAuth = this.authService.getCurrentAuth();

        if (isAuth?.accessToken) {
            this.router.navigateByUrl("/tasks");
            return false;
        }

        return this.authService.verifyUser()
            .pipe(takeUntil(this.destroyed$))
            .pipe(
                catchError(x => {
                    const state = (this.router.getCurrentNavigation()?.extras.state as any)?.["from"];

                    if (state === "unauthorized") {
                        this.messageService.setMessage(x);
                        this.router.navigateByUrl("/login", {
                            state: {
                                from: undefined
                            }
                        });
                    }
                    return of({ userName: "", accessToken: "", refreshToken: "", roles: [] })
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
