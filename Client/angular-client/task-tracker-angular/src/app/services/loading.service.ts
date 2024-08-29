import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

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

    constructor() { }
}
