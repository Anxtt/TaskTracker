import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

import { lastValueFrom, take } from 'rxjs';

import CustomStore from 'devextreme/data/custom_store';

import { AuthService } from './auth.service';
import { MessageService } from './message.service';

import { UserStatisticsResponseModel } from '../models/UserStatisticsResponseModel';

@Injectable({
    providedIn: 'root'
})
export class UserStoreService {
    userName!: string;
    email!: string;

    type: string = "treeList";
    users!: UserStatisticsResponseModel[];
    store: CustomStore;

    constructor(private authService: AuthService, private messageService: MessageService) {
        this.store = new CustomStore({
            key: "id",
            load: async (options) => {
                // console.log(options);
                if (this.users?.length > 0) {
                    return Promise.resolve(this.users);
                }
                
                return lastValueFrom(this.authService.getUsers()).then((x: UserStatisticsResponseModel[]) => {
                    console.log(x);
                    this.users = x;
                    return x;
                });
            },
            update: async (key, values: UserStatisticsResponseModel) => {
                return lastValueFrom(this.authService.editUser(values)).then(x => {
                    this.users = this.users.map((u: UserStatisticsResponseModel) => {
                        if (u.id !== values.id) {
                            return u;
                        }

                        return values;
                    })

                    this.messageService.setMessage({ body: x })
                });
            },
            remove: async (key: string) => {
                return lastValueFrom(this.authService.deleteUser(key)).then((x: any) => {
                    this.users = this.users.filter(x => x.id !== key);
                    this.messageService.setMessage({ body: x });
                });
            },
            // insert: () => {},
            // byKey: (key) => {
            //     if (this.users?.length > 0) {
            //         return this.users.find(x => x.id === key);
            //     }
            // }
        });
    }

    setType(type: string) {
        this.type = type;
    }

    emailCheck = (async ({ value, data }: any) => {
        return new Promise<void>((resolve, reject) => {
            if (value === this.email) {
                return resolve();
            }

            this.authService.doesExistByEmail(value)
                .pipe(take(1))
                .subscribe((x: ValidationErrors | null) => {
                    if (x?.["error"]) {
                        return reject(x?.["error"]);
                    }
                    else if (x !== null) {
                        return reject("E-mail already exists.");
                    }

                    return resolve();
                })
        })
    }).bind(this);

    userNameCheck = (async ({ value }: any) => {
        return new Promise<void>((resolve, reject) => {
            if (value === this.userName) {
                return resolve();
            }

            this.authService.doesExistByUserName(value)
                .pipe(take(1))
                .subscribe((x: ValidationErrors | null) => {
                    if (x?.["error"]) {
                        return reject(x?.["error"]);
                    }
                    else if (x !== null) {
                        return reject("Username already exists.");
                    }

                    return resolve();
                })
        })
    }).bind(this);
}
