import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';
import { Subject, catchError, of, switchMap, takeUntil } from 'rxjs';
import { MessageService } from '../services/message.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, OnDestroy {
    destroyed$: Subject<void> = new Subject();

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    // Prevents the user from accessing tasks and addTask when not authenticated
    canActivate() {
        const isAuth = this.authService.getCurrentAuth();
        
        if (isAuth?.accessToken === "") {
            this.router.navigateByUrl("/login", {
                state: {
                    from: "unauthorized"
                }
            });
            return false;
        }
        
        return this.authService.verifyUser()
            .pipe(takeUntil(this.destroyed$))
            .pipe(
                catchError(x => {
                    this.messageService.setMessage(x);
                    return of({ userName: "", accessToken: "", refreshToken: "", roles: [] })
                }),
                switchMap(x => {
                    this.authService.setAuth(x);

                    if (x?.accessToken === "") {
                        this.router.navigateByUrl("/login", {
                            state: {
                                from: "unauthorized"
                            }
                        });
                        return of(false);
                    }
                    
                    return of(true);
                })
            );
    }
}
