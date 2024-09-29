import { Injectable, OnDestroy } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';

import { MessageService } from './message.service';

import { IdentityResponseModel } from '../models/IdentityResponseModel';
import { UserStatisticsResponseModel } from '../models/UserStatisticsResponseModel';

import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {
    private apiUrl = environment.apiUrl;
    private checkAuth$ = new BehaviorSubject<IdentityResponseModel>({ accessToken: "", userName: "", refreshToken: "", roles: [] });

    constructor(private http: HttpClient, private messageService: MessageService) { }

    ngOnDestroy(): void {
        this.checkAuth$.complete();
    }

    getAuth(): Observable<IdentityResponseModel> {
        return this.checkAuth$.asObservable();
    }

    getCurrentAuth(): IdentityResponseModel {
        return this.checkAuth$.getValue();
    }

    setAuth(state: IdentityResponseModel) {
        this.checkAuth$.next(state);
    }

    login(loginForm: any): Observable<HttpResponse<IdentityResponseModel>> {
        return this.http.post<IdentityResponseModel>(`${this.apiUrl}Identity/Login`, loginForm,
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
        return this.http.post(`${this.apiUrl}Identity/Register`, registerForm,
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            }
        );
    }

    deleteUser(id: string) {
        return this.http.delete(`${this.apiUrl}Identity/Delete/${id}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
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
            catchError(x => {
                this.messageService.setMessage(x);

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
            catchError((x => {
                this.messageService.setMessage(x);

                if (x.status === 429) {
                    return of({ error: "Too many requests. You have exceeded your quota of 8 requests per 10 minutes." })
                }

                return of({ error: x.error });
            }))
        );
    }

    editUser(userEditModel: UserStatisticsResponseModel) {
        return this.http.put(`${this.apiUrl}Identity/Edit/${userEditModel.id}`, userEditModel, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
    }

    refreshToken() {
        return this.http.get<IdentityResponseModel>(`${this.apiUrl}Identity/RefreshToken`, {
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

    getUsers() {
        return this.http.get<UserStatisticsResponseModel[]>(`${this.apiUrl}Identity/GetUsers`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true,
        })
    }
}
