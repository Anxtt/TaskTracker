import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { DxToastModule } from "devextreme-angular";
import { DxoPositionModule } from 'devextreme-angular/ui/nested';
import { ToastType } from 'devextreme/ui/toast';

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
    errorMessage: { message: string, show: boolean };
    successMessage: { message: string, show: boolean };
    messageType: ToastType = 'custom';
    destroyed$: Subject<void> = new Subject();

    constructor(
        private userActivityService: UserActivityService,
        private authService: AuthService,
        private messageService: MessageService) {
        this.isActive = true;
        this.isAuth = { accessToken: "", userName: "", refreshToken: "" };
        this.errorMessage = { message: "", show: false };
        this.successMessage = { message: "", show: false };
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this.authService.getAuth().subscribe(x => this.isAuth = x);

        this.userActivityService.isActive.subscribe(x => this.isActive = x);

        this.messageService.getErrorMessage()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => {
                this.messageType = "error";
                this.errorMessage = x;
                this.showErrorMessage();
            });

        this.messageService.getSuccessMessage()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => {
                this.messageType = "success";
                this.successMessage = x;
                this.showSuccessMessage();
            })
    }

    showErrorMessage() {
        setTimeout(() => {
            this.messageService.setErrorMessage({ message: "", show: false });
            this.errorMessage = { message: "", show: false };
        }, 8000);
    }

    showSuccessMessage() {
        setTimeout(() => {
            this.messageService.setSuccessMessage({ message: "", show: false });
            this.successMessage = { message: "", show: false };
        }, 8000);
    }

    reset() {
        console.log("Reset idle timer");
        this.isActive = true;
        this.userActivityService.reset();
    }
}