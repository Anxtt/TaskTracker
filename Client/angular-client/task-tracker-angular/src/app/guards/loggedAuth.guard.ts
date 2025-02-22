import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, NavigationStart, Router } from '@angular/router';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class LoggedAuthGuard implements CanActivate, OnDestroy {
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

    // Prevents the user from accessing login and register when authenticated
    canActivate() {
        if (this.pageReloaded === true) {
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
                        return of({ userName: "", id: "", accessToken: "", refreshToken: "", roles: [] })
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

        const isAuth = this.authService.getCurrentAuth();
        if (isAuth?.accessToken) {
            this.router.navigateByUrl("/tasks");
            return false;
        }

        return true;
    }
}
