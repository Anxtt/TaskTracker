import { Injectable } from '@angular/core';
import { CanActivate, NavigationStart, Router } from '@angular/router';

import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: "root"
})
export class AdminGuard implements CanActivate {
    destroyed$: Subject<void> = new Subject();
    pageReloaded: boolean = true;

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
        this.router.events
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => {
                if (x instanceof NavigationStart) {
                    this.pageReloaded = !this.router.navigated;
                }
            })
    }

    // Prevents a regular user from accessing admin page which requires the Admin role
    canActivate() {
        if (this.pageReloaded === true) {
            return this.authService.verifyUser()
                .pipe(takeUntil(this.destroyed$))
                .pipe(
                    catchError(x => {
                        this.messageService.setMessage(x);
                        this.router.navigateByUrl("/login", {
                            state: {
                                from: undefined
                            }
                        });

                        return of({ userName: "", id: "", accessToken: "", refreshToken: "", roles: [] })
                    }),
                    switchMap(x => {
                        this.authService.setAuth(x);

                        if (x?.accessToken && (x?.roles.some(x => x === "Admin") === false)) {
                            this.router.navigateByUrl("/tasks");
                            return of(false);
                        }

                        return of(true);
                    })
                );
        }

        const isAuth = this.authService.getCurrentAuth();
        if (isAuth?.accessToken && (isAuth?.roles.some(x => x === "Admin") === false)) {
            this.router.navigateByUrl("/tasks");
            return false;
        }

        return true;
    }
} 
