import { CommonModule } from '@angular/common';

import { Component, OnInit, OnDestroy } from '@angular/core';

import { RouterLink, RouterOutlet } from '@angular/router';

import { DxDataGridModule, DxListModule, DxTemplateModule, DxTileViewModule } from "devextreme-angular";

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

import { AuthService } from './services/auth.service';
import { UserActivityService } from './services/user-activity.service';

import { IdentityResponseModel } from './models/IdentityResponseModel';
import { MessageService } from './services/message.service';
import { TaskResponseModel } from './models/TaskResponseModel';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterLink,
        RouterOutlet,
        FooterComponent,
        HeaderComponent,
        CommonModule,
        DxTileViewModule,
        DxListModule,
        DxDataGridModule,
        DxTemplateModule
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css', 'styles/form.css']
})
export class AppComponent implements OnInit, OnDestroy {
    title = 'no';
    isActive: boolean;
    isAuth: IdentityResponseModel;
    errorMessage: { message: string, show: boolean };
    successMessage: { message: string, show: boolean };
    tasks: TaskResponseModel[] = [
        {
            id: 1,
            isCompleted: true,
            createdOn: "a",
            deadline: "a",
            name: "a",
            user: "a",
        },
        {
            id: 2,
            isCompleted: false,
            createdOn: "b",
            deadline: "b",
            name: "b",
            user: "b",
        },
        {
            id: 3,
            isCompleted: true,
            createdOn: "c",
            deadline: "c",
            name: "c",
            user: "c",
        },
        {
            id: 4,
            isCompleted: false,
            createdOn: "d",
            deadline: "d",
            name: "d",
            user: "d",
        },
        {
            id: 5,
            isCompleted: true,
            createdOn: "e",
            deadline: "e",
            name: "e",
            user: "e",
        },
        {
            id: 6,
            isCompleted: false,
            createdOn: "f",
            deadline: "f",
            name: "f",
            user: "f",
        }
    ]
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
            this.errorMessage = x;
            this.showErrorMessage();
        });

        this.messageService.getSuccessMessage().subscribe(x => {
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