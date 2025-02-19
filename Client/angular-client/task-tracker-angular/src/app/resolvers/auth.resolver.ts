import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable, take } from 'rxjs';

import { AuthService } from '../services/auth.service';

import { IdentityResponseModel } from '../models/IdentityResponseModel';

@Injectable({ providedIn: 'root' })
export class AuthResolver implements Resolve<IdentityResponseModel | boolean> {
    constructor(private authService: AuthService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
        : Observable<IdentityResponseModel> |
        Promise<IdentityResponseModel> |
        IdentityResponseModel |
        Observable<boolean> |
        Promise<boolean> |
        boolean {
        const isAuth = this.authService.getCurrentAuth();

        if (isAuth.accessToken === "") {
            this.authService.verifyUser()
            .pipe(take(1))
            .subscribe(x => {
                this.authService.setAuth(x);
            })
        }

        return true;
    }
}
