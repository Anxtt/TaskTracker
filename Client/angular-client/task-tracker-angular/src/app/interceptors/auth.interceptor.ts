import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';

import { Observable, catchError, mergeMap, of, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';

import { IdentityResponseModel } from '../models/IdentityResponseModel';
import { AUTHORIZE } from '../services/task.service';

@Injectable()
export class authInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.context.has(AUTHORIZE)) {
            return of(req).pipe(
                switchMap(() => {
                    return this.authService.refreshToken()
                }),
                switchMap((x: IdentityResponseModel) => {
                    if (x.accessToken !== "") {
                        console.log(x);
                        this.authService.setAuth(x);
                    }

                    return next.handle(req).pipe(
                        catchError((error: HttpErrorResponse) => {
                            console.log(error);
                            console.log(typeof (error));
                            console.log(error instanceof HttpResponse);
                            return of();
                        })
                    )
                })
            )
        }

        return next.handle(req);
    }
}
