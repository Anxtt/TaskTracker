import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

import { IdentityResponseModel } from '../models/IdentityResponseModel';

import { environment } from '../environments/environment';
import { ValidationErrors } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private checkAuth$: BehaviorSubject<IdentityResponseModel> = new BehaviorSubject({ accessToken: "", userName: "", refreshToken: "" });

    getAuth(): Observable<IdentityResponseModel> {
        return this.checkAuth$.asObservable();
    }

    getCurrentAuth(): IdentityResponseModel {
        return this.checkAuth$.getValue();
    }

    setAuth(state: IdentityResponseModel) {
        this.checkAuth$.next(state);
    }

    constructor(private http: HttpClient) { }

    login(loginForm: any): Observable<HttpResponse<IdentityResponseModel>> {
        return this.http.post<IdentityResponseModel>(`${this.apiUrl}Identity/Login`, {
            "userName": loginForm.value.username,
            "password": loginForm.value.password
        },
            {
                observe: 'response',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
        );
    }

    logout() {
        return this.http.post(`${this.apiUrl}Identity/Logout`, null,
            {
                withCredentials: true
            }
        );
    }

    register(registerForm: any) {
        return this.http.post(`${this.apiUrl}Identity/Register`, {
            "userName": registerForm.value.username,
            "email": registerForm.value.email,
            "password": registerForm.value.password,
            "confirmPassword": registerForm.value.confirmPassword
        },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
        );
    }

    doesExistByEmail(email: string): Observable<ValidationErrors | null> {
        return this.http.get(`${this.apiUrl}Identity/DoesExistByEmail/${email}`, {
            observe: "response",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).pipe(
            map(x => {
                if (x.body === true) {
                    return { isUnique: false };
                }

                return null;
            }),
            catchError(x => 
                {
                    if (x.status === 429) {
                        return of({ error: "Too many requests. You have exceeded your quota of 5 requests per 10 minutes." })
                    }

                    return of({ error: x.error });
                })
            );
        // .pipe(
        //     map(() => null),
        //     catchError(() => of({ isUnique: false })),
        // );
    }

    doesExistByUserName(userName: string): Observable<ValidationErrors | null> {
        return this.http.get(`${this.apiUrl}Identity/DoesExistByUserName/${userName}`, {
            observe: "response",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        }).pipe(
            map(x => {
                if (x.body === true) {
                    return { isUnique: false };
                }

                return null;
            }),
            catchError((x => 
                {
                    if (x.status === 429) {
                        return of({ error: "Too many requests. You have exceeded your quota of 8 requests per 10 minutes." })
                    }

                    return of({ error: x.error });
                }))
        );
    }

    refreshToken() {
        return this.http.get(`${this.apiUrl}Identity/RefreshToken`, {
            observe: "response",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
    }

    verifyUser() {
        return this.http.get<IdentityResponseModel>(`${this.apiUrl}Identity/VerifyUser`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
    }
}
