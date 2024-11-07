import { Component, OnDestroy, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, lastValueFrom, take, takeUntil } from 'rxjs';

import { DxBulletModule, DxTemplateModule, DxTileViewModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';

import { DetailGridComponent } from '../detail-grid/detail-grid.component';

import { AuthService } from '../../services/auth.service';
import { MessageService } from '../../services/message.service';

import { TaskResponseModel } from '../../models/TaskResponseModel';
import { UserStatisticsResponseModel } from '../../models/UserStatisticsResponseModel';

@Component({
    selector: 'app-user-statistics',
    standalone: true,
    imports: [DxBulletModule, DxTemplateModule, DxDataGridModule, DxTileViewModule, DetailGridComponent],
    templateUrl: './user-statistics.component.html',
    styleUrl: './user-statistics.component.css'
})
export class UserStatisticsComponent implements OnInit, OnDestroy {
    private email: string = "";
    private userName: string = "";

    destroyed$: Subject<void> = new Subject();

    users: UserStatisticsResponseModel[] = [];
    usernameErrorMessage: string = "";
    emailErrorMessage: string = "";
    visible: boolean = false;

    dataSource: DataSource = new DataSource({
        store: new CustomStore({
            key: "id",
            load: async (options) => {
                console.log(options);
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
        })
    });

    constructor(private authService: AuthService, private messageService: MessageService, private router: Router) { }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void { }

    onEditingStart(model: DxDataGridTypes.EditingStartEvent) {
        this.email = model.data.email;
        this.userName = model.data.userName;
        this.visible = true;
    }

    onRowUpdating(data: DxDataGridTypes.RowUpdatingEvent) {
        for (let prop of Object.keys(data.oldData)) {
            // проверява дали пропъртито съществува в новия обект
            if (!data.newData.hasOwnProperty(prop)) {
                // присвоява липсващите пропъртита към новия обект, за да се получи целия обект в dataSource update
                data.newData[prop] = data.oldData[prop];
            }
        }
    }

    async onTaskUpdated(e: TaskResponseModel) {
        let user = this.users.find(x => x.id === e.userId);

        if (!user) {
            return;
        }

        user.tasks = user.tasks.map((t: TaskResponseModel) => {
            if (t.id !== e.id) {
                return t;
            }

            return e;
        })

        this.updateTaskCount(user);

        await this.dataSource.reload();
    }

    async onTaskDeleted(e: { taskId: number; userId: string; }) {
        let user = this.users.find(x => x.id === e.userId);

        if (!user) {
            return;
        }

        user.tasks = user.tasks.filter((x: TaskResponseModel) => x.id !== e.taskId);

        this.updateTaskCount(user);

        await this.dataSource.reload();
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
                        this.emailErrorMessage = x?.["error"];
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
                .subscribe((x: ValidationErrors | null) => {
                    if (x?.["error"]) {
                        this.usernameErrorMessage = x?.["error"];
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

    private updateTaskCount(user: UserStatisticsResponseModel) {
        user.taskCount = user.tasks.length;
        user.taskCompleteCount = user.tasks.filter((x: TaskResponseModel) => x.isCompleted === true).length;
        user.taskCompletePercent = (user.taskCompleteCount / user.taskCount * 100).toFixed(2);
        user.taskIncompleteCount = user.tasks.filter((x: TaskResponseModel) => x.isCompleted === false).length;
        user.taskIncompletePercent = (user.taskIncompleteCount / user.taskCount * 100).toFixed(2);
    }
}
