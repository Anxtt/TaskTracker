import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { Observable, catchError, map, of } from 'rxjs';

import { environment } from '../environments/environment';

import { AuthService } from './auth.service';
import { MessageService } from './message.service';

import { TaskResponseModel } from '../models/TaskResponseModel';

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
                withCredentials: true
            })
        // .subscribe({
        //     next: x => {
        //         if (x.ok === true) {
        //             x.body?.forEach(t => {
        //                 tasks.push(t);
        //             })

        //             tasks = x.body!;
        //         }
        //     },
        // направи таймер 
        //     error: x => {
        //         console.log(x);
        //         if (x.status === 401) {
        //             this.authService.refreshToken().subscribe();
        //         }
        //     }
        // });
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
                    withCredentials: true
                })
    }

    createTask(createForm: any) {
        return this.http.post(`${this.apiUrl}Chore/Create`, {
            name: createForm.value.taskName,
            deadline: createForm.value.deadline
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
    }

    deleteTask(id: number) {
        return this.http.delete(`${this.apiUrl}Chore/Delete/${id}`, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
    }

    doesExistByName(name: string): Observable<ValidationErrors | null> {
        return this.http.get(`${this.apiUrl}Chore/DoesExistByName/${name}`, {
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
                if (x.status === 429) {
                    this.messageService.setErrorMessage(x);
                    return of({ slowDown: "Too many requests. You have exceeded your quota of 5 requests per 10 minutes." });
                }

                this.messageService.setErrorMessage(x);

                return of();
            }),
        );
        // .pipe(
        //     map(() => null),
        //     catchError(() => of({ isUnique: false })),
        // );
    }

    editTask(id: number, name: string, deadline: string, isCompleted: boolean) {
        return this.http.put(`${this.apiUrl}Chore/Edit/${id}`, {
            name: name,
            deadline: deadline,
            isCompleted: isCompleted
        }, {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
    }
}
