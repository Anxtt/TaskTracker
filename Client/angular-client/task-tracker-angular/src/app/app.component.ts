import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { DxToastModule } from "devextreme-angular";
import { DxoPositionModule } from 'devextreme-angular/ui/nested';
import notify from 'devextreme/ui/notify';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';

import { MessageService } from './services/message.service';
import { UserActivityService } from './services/user-activity.service';

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
    destroyed$: Subject<void> = new Subject();

    constructor(
        private userActivityService: UserActivityService,
        private messageService: MessageService) {}

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void {
        this.messageService.getMessage()
            .pipe(takeUntil(this.destroyed$))
            .subscribe(x => {
                notify({
                    maxWidth: 400,
                    displayTime: 2000,
                    visible: x.show,
                    type: x.type,
                    message: x.message,
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
}