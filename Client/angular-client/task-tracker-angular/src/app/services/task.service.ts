import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../environments/environment';

import { AuthService } from './auth.service';
import { MessageService } from './message.service';

import { TaskResponseModel } from '../models/TaskResponseModel';

export const AUTHORIZE = new HttpContextToken<string>(() => "AUTHORIZE");

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = environment.apiUrl;


    constructor(private http: HttpClient, private authService: AuthService, private messageService: MessageService) { }

    all() {
        return this.http
            .get<TaskResponseModel[]>(`${this.apiUrl}Chore/All`, {
                observe: "response",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                withCredentials: true,
                context: new HttpContext().set(AUTHORIZE, "true")
            })
    }

    allFiltered(isCompletedStatus: boolean | string, sortStatus: string, filterStatus: string) {
        return this.http
            .get<TaskResponseModel[]>(
                `${this.apiUrl}Chore/AllFiltered?isCompletedStatus=${isCompletedStatus}&sortStatus=${sortStatus}&filterStatus=${filterStatus}`,
                {
                    observe: "response",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    withCredentials: true,
                    context: new HttpContext().set(AUTHORIZE, "true")
                })
    }

    createTask(createForm: any) {
        return this.http.post(`${this.apiUrl}Chore/Create`, createForm, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true,
            context: new HttpContext().set(AUTHORIZE, "true")
        })
    }

    deleteTask(id: number, userId: string) {
        return this.http.delete(`${this.apiUrl}Chore/Delete/${id}?userId=${userId}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true,
            context: new HttpContext().set(AUTHORIZE, "true")
        })
    }

    doesExistByName(name: string, userId: string): Observable<ValidationErrors | null> {
        return this.http.get(`${this.apiUrl}Chore/DoesExistByName/${name}?userId=${userId}`, {
            observe: "response",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true,
            context: new HttpContext().set(AUTHORIZE, "true")
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
                    return of({ error: "Too many requests. You have exceeded your quota of 5 requests per 10 minutes." });
                }
                
                return of();
            }),
        );
        // .pipe(
        //     map(() => null),
        //     catchError(() => of({ isUnique: false })),
        // );
    }

    editTask(editForm: TaskResponseModel | undefined | any) {
        return this.http.put(`${this.apiUrl}Chore/Edit/${editForm!.id}`, editForm, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true,
            context: new HttpContext().set(AUTHORIZE, "true")
        })
    }
}
