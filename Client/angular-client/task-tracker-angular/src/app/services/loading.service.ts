import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService implements OnDestroy {
    private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor() { }
    
    ngOnDestroy(): void {
        this.isLoading$.complete();
    }

    getIsLoading() {
        return this.isLoading$.asObservable();
    }

    getCurrentIsLoading() {
        return this.isLoading$.getValue();
    }

    setLoadingOn() {
        this.isLoading$.next(true);
    }

    setLoadingOff() {
        this.isLoading$.next(false);
    }
}
