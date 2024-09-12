import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService implements OnDestroy {
    private message$: BehaviorSubject<any> = new BehaviorSubject({ message: "", show: false, type: "" });

    constructor() { }

    ngOnDestroy(): void {
        this.message$.complete();
    }

    getMessage() {
        return this.message$.asObservable();
    }

    getCurrentMessage() {
        return this.message$.getValue();
    }

    setMessage(state: any) {
        if (state.status === 500) {
            this.message$.next({ message: state.error.message, show: true, type: "error" });
        }
        else if (state.status === 400 || state.status === 401 ||  state.status === 404) {
            this.message$.next({ message: state.error, show: true, type: "error" });
        }
        else if (state.status === 429) {
            this.message$.next({ message: "You have exceeded the API quota for this action. Try again later.", show: true, type: "error" });
        }
        else if (state.status === 204) {
            this.message$.next({ message: "No tasks could be retrieved.", show: true, type: "success" });
        }
        else {
            this.message$.next({ message: state.body, show: true, type: "success" });
        }
    }
}
