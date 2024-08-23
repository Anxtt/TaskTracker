import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
    private successMessage$: BehaviorSubject<any> = new BehaviorSubject({ message: "", show: false });
    private errorMessage$: BehaviorSubject<any> = new BehaviorSubject({ message: "", show: false });

    getSuccessMessage() {
        return this.successMessage$.asObservable();
    }

    getCurrentSuccessMessage() {
        return this.successMessage$.getValue();
    }

    setSuccessMessage(state: any) {
        this.successMessage$.next({ message: state.body, show: true });
    }

    getErrorMessage() {
        return this.errorMessage$.asObservable();
    }

    getCurrentErrorMessage() {
        return this.errorMessage$.getValue();
    }

    setErrorMessage(state: any) {
        if (state.status === 500) {
            this.errorMessage$.next({ message: state.error.message, show: true });
        }
        else if (state.status === 400 || state.status === 401 ||  state.status === 404) {
            this.errorMessage$.next({ message: state.error, show: true });
        }
        else if (state.status === 429) {
            this.errorMessage$.next({ message: "You have exceeded the API quota for this action. Try again later.", show: true });
        }
        else if (state.status === 204) {
            this.errorMessage$.next({ message: "No tasks could be retrieved.", show: true });
        }
    }

  constructor() { }
}
