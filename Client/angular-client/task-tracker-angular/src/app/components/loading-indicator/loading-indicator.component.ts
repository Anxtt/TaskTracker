import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';

import { Observable, tap } from 'rxjs';

import { DxLoadIndicatorModule } from 'devextreme-angular';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [AsyncPipe, DxLoadIndicatorModule],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.css'
})
export class LoadingIndicatorComponent implements OnInit {
    loading$: Observable<boolean>;

    @Input() detectTransitions = false;

    constructor(private loadingService: LoadingService, private router: Router) {
        this.loading$ = this.loadingService.getIsLoading();
    }

    ngOnInit(): void {
        if (this.detectTransitions === true) {
            this.router.events
            .pipe(
                tap(e => {
                    if (e instanceof RouteConfigLoadStart) {
                        this.loadingService.setLoadingOn();
                    }
                    else if (e instanceof RouteConfigLoadEnd) {
                        this.loadingService.setLoadingOff();
                    }
                })
            ).subscribe();
        }
    }
}
