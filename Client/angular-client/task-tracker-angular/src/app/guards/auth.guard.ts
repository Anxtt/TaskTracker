import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, NavigationStart, Router } from '@angular/router';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {
    destroyed$: Subject<void> = new Subject();
    pageReloaded: boolean = true;

    constructor(private authService: AuthService,
        private messageService: MessageService,
        private router: Router) {
        this.router.events
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => {
                if (x instanceof NavigationStart) {
                    this.pageReloaded = !this.router.navigated
                }
            });
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    // Prevents the user from accessing tasks and addTask when not authenticated
    canActivate() {
        const isAuth = this.authService.getCurrentAuth();

        if (this.pageReloaded === true && isAuth.accessToken === "") {
            return this.authService.verifyUser()
            .pipe(takeUntil(this.destroyed$))
            .pipe(
                catchError(x => {
                    this.messageService.setMessage(x);
                    return of({ userName: "", accessToken: "", refreshToken: "", roles: [] });
                }),
                switchMap(x => {
                    if (x?.accessToken === "") {
                        this.router.navigateByUrl("/login", {
                            state: {
                                from: "unauthorized"
                            }
                        });
                        return of(false);
                    }

                    this.authService.setAuth(x);
                    return of(true);
                })
            );
        }

        if (isAuth?.accessToken === "") {
            this.router.navigateByUrl("/login", {
                state: {
                    from: "unauthorized"
                }
            });
            return false;
        }
        else if (isAuth?.accessToken !== "" && this.pageReloaded === false) {
            return true;
        }
    
        return true;
    }
}
