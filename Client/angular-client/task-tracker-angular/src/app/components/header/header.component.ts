import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { Observable, Subject, take, takeUntil } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

import { IdentityResponseModel } from '../../models/IdentityResponseModel';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterOutlet, AsyncPipe],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
    isAuth$: Observable<IdentityResponseModel>;
    destroyed$: Subject<void> = new Subject();
    // isAuth: IdentityResponseModel;

    isLightTheme: boolean = localStorage.getItem("theme") === "dark" ? false : true;

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) {
        this.isAuth$ = this.authService.getAuth();
        // this.isAuth = this.authService.getCurrentAuth();
    }
    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        // this.something();
        // this.authService.getAuth().subscribe(x => this.isAuth$ = x);    
        document.body.setAttribute(
            'data-theme',
            this.isLightTheme ? 'light' : 'dark'
        );
    }

    // async something() {
    //     const isAuth = await lastValueFrom(this.authService.getAuth());
    //     console.log(isAuth);
    // }

    logOut() {
        this.authService.logout()
            .pipe(take(1))
            .subscribe(() => {
                this.authService.setAuth({ accessToken: "", userName: "", refreshToken: "", roles: [] });
                this.router.navigateByUrl('/');
                this.messageService.setMessage({ body: "Logged out successfully." });
            })
    }

    isAdmin(e: IdentityResponseModel | null) {
        return e?.roles.some(r => r === "Admin");
    }

    onThemeSwitchChange() {
        this.isLightTheme = !this.isLightTheme;

        localStorage.setItem("theme", this.isLightTheme === true ? "light" : "dark");

        document.body.setAttribute(
            'data-theme',
            this.isLightTheme ? 'light' : 'dark'
        );
    }
}
