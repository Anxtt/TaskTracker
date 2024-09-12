import { Injectable, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';

import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';

import { AuthService } from './auth.service';
import { MessageService } from './message.service';

export enum IdleUserTimes {
    // IdleTime = 10000,
    IdleTime = 60000 * 20,
    CountDownTime = 5
}

@Injectable(
    { providedIn: 'root' }
)
export class UserActivityService implements OnDestroy {
    private timeOutId: any;
    private countDownId: any;
    private countDownValue: number = IdleUserTimes.CountDownTime;

    isActive$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    destroyed$: Subject<void> = new Subject();

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
        this.reset();
        this.initListener();
    }

    ngOnDestroy(): void {
        this.isActive$.complete();

        this.destroyed$.next();
        this.destroyed$.complete();
    }

    initListener() {
        window.addEventListener("blur", () => this.reset());
        window.addEventListener("zoom", () => this.reset());
        window.addEventListener("focus", () => this.reset());
        window.addEventListener("click", () => this.reset());
        window.addEventListener("keydown", () => this.reset());
        window.addEventListener("keypress", () => this.reset());
        window.addEventListener("mousemove", () => this.reset());
        window.addEventListener("mousedown", () => this.reset());
        window.addEventListener("mousewheel", () => this.reset());
        window.addEventListener("DOMMouseScroll", () => this.reset());
        window.addEventListener("touchmove", () => this.reset());
        window.addEventListener("touchstart", () => this.reset());
        window.addEventListener("touchcancel", () => this.reset());
        window.addEventListener("MSPointerMove", () => this.reset());
    }

    reset() {
        clearTimeout(this.timeOutId);
        clearTimeout(this.countDownId);

        if (this.authService.getCurrentAuth()?.accessToken !== "") {
            this.startIdleTimer();
        }
    }

    startIdleTimer() {
        this.timeOutId = setInterval(() => {
            console.log(`You have been idle for ${IdleUserTimes.IdleTime / 1000 / 60} minutes.`);
            this.startCountdown();
        }, IdleUserTimes.IdleTime);
    }

    startCountdown() {
        this.countDownValue = IdleUserTimes.CountDownTime;

        this.countDownId = setInterval(() => {
            this.countDownValue--;
            console.log(`You will log out in: ${this.countDownValue} seconds`);

            if (this.countDownValue <= 0) {
                clearInterval(this.countDownId);
                clearInterval(this.timeOutId);

                console.log("User is inactive");

                this.isActive$.next(false);

                this.authService.setAuth({ accessToken: "", userName: "", refreshToken: "" });

                this.authService.logout()
                .pipe(take(1))
                .subscribe({
                    next: () => this.router.navigateByUrl("/login"),
                    error: () => this.router.navigateByUrl("/login"),
                    complete: () => this.router.navigateByUrl("/login")
                });

                this.messageService.setMessage({ body: "You have been logged out due to inactivity.", show: true });
            }
        }, 1000)
    }
}
