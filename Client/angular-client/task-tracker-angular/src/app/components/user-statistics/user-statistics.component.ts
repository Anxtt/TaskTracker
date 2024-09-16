import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, lastValueFrom, take, takeUntil } from 'rxjs';

import { DxBulletModule, DxTemplateModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

@Component({
    selector: 'app-user-statistics',
    standalone: true,
    imports: [DxBulletModule, DxTemplateModule, DxDataGridModule],
    templateUrl: './user-statistics.component.html',
    styleUrl: './user-statistics.component.css'
})
export class UserStatisticsComponent implements OnInit, OnDestroy {
    private email: string = "";
    private userName: string = "";

    destroyed$: Subject<void> = new Subject();

    users: any[] = [];
    usernameErrorMessage: string = "";
    emailErrorMessage: string = "";
    visible: boolean = false;

    dataSource: DataSource = new DataSource({
        store: new CustomStore({
            key: "id",
            load: (options) => {
                if (this.users?.length > 0) {
                    return Promise.resolve(this.users);
                }

                return lastValueFrom(this.authService.getUsers()).then((x: any) => {
                    console.log(x);
                    this.users = x;
                    return x;
                });
            },
            update: (key, values) => {
                return lastValueFrom(this.authService.editUser(values)).then(x => {
                    this.users = this.users.map((u: any) => {
                        if (u.id !== values.id) {
                            return u;
                        }

                        return values;
                    })

                    this.messageService.setMessage({ body: x, show: true })
                });
            },
            remove: (key) => {
                return lastValueFrom(this.authService.deleteUser(key)).then((x: any) => {
                    this.users = this.users.filter(x => x.id !== key);
                });
            },
            // insert: () => {}
        })
    });

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void { }

    getData(model: DxDataGridTypes.EditingStartEvent) {
        console.log("something");
        console.log(model);

        this.email = model.data.email;
        this.userName = model.data.userName;
        this.visible = true;
    }

    async editUser(data: DxDataGridTypes.RowUpdatingEvent) {
        console.log(data);

        for (let prop of Object.keys(data.oldData)) {
            // проверява дали пропъртито съществува в новия обект
            if (!data.newData.hasOwnProperty(prop)) {
                // присвоява липсващите пропъртита към новия обект, за да се получи целия обект в dataSource update
                data.newData[prop] = data.oldData[prop];
            }
        }
    }

    emailCheck = (async ({ value, data }: any) => {
        return new Promise<void>((resolve, reject) => {
            if (value === this.email) {
                return resolve();
            }

            this.authService.doesExistByEmail(value)
                .pipe(take(1))
                .subscribe((x: any) => {
                    if (x?.slowDown) {
                        this.messageService.setMessage(x);
                        this.emailErrorMessage = "You have exceeded the API quota for this action. Try again later.";
                        return reject();
                    }
                    else if (x !== null) {
                        this.emailErrorMessage = "E-mail already exists.";
                        return reject();
                    }

                    return resolve();
                })
        })
    }).bind(this);

    usernameCheck = (async ({ value }: any) => {
        return new Promise<void>((resolve, reject) => {
            if (value === this.userName) {
                return resolve();
            }

            this.authService.doesExistByUserName(value)
                .pipe(take(1))
                .subscribe((x: any) => {
                    if (x?.slowDown) {
                        this.messageService.setMessage(x);
                        this.usernameErrorMessage = "You have exceeded the API quota for this action. Try again later.";
                        return reject();
                    }
                    else if (x !== null) {
                        this.usernameErrorMessage = "Username already exists.";
                        return reject();
                    }

                    return resolve();
                })
        })
    }).bind(this);
}
