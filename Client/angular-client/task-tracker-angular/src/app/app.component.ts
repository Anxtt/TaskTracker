import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { DxToastModule } from "devextreme-angular";
import { DxoPositionModule } from 'devextreme-angular/ui/nested';
import { ToastType } from 'devextreme/ui/toast';
import notify from 'devextreme/ui/notify';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { AuthService } from './services/auth.service';
import { UserActivityService } from './services/user-activity.service';
import { MessageService } from './services/message.service';

import { IdentityResponseModel } from './models/IdentityResponseModel';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterLink,
        RouterOutlet,
        FooterComponent,
        HeaderComponent,
        LoadingIndicatorComponent,
        CommonModule,
        DxToastModule,
        DxoPositionModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css', 'styles/form.css']
})
export class AppComponent implements OnInit, OnDestroy {
    isActive: boolean;
    isAuth: IdentityResponseModel;
    message: { message: string, show: boolean, type: ToastType };
    destroyed$: Subject<void> = new Subject();

    constructor(
        private userActivityService: UserActivityService,
        private authService: AuthService,
        private messageService: MessageService) {
        this.isActive = true;
        this.isAuth = { accessToken: "", userName: "", refreshToken: "" };
        this.message = { message: "", show: false, type: "custom" };
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this.authService.getAuth()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => this.isAuth = x);

        this.userActivityService.isActive
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => this.isActive = x);

        this.messageService.getMessage()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => {
                this.message = x;
                console.log(x);
                notify({
                    maxWidth: 400,
                    displayTime: 2000,
                    visible: this.message.show,
                    type: this.message.type,
                    message: this.message.message,
                    show: {
                        type: 'fade', duration: 400, from: 0, to: 1
                    },
                    hide: {
                        type: 'fade', duration: 40, to: 0
                    },
                }, {
                    direction: 'down-push',
                    position: {
                        top: 78,
                        right: 10
                    }
                })
            });
    }

    reset() {
        console.log("Reset idle timer");
        this.isActive = true;
        this.userActivityService.reset();
    }
}