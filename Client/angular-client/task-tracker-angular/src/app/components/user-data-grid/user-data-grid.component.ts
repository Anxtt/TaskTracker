import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { Subject } from 'rxjs';

import { DxBulletModule, DxTemplateModule, DxTileViewModule, DxButtonModule } from 'devextreme-angular';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import DataSource from 'devextreme/data/data_source';

import { TaskDetailGridComponent } from '../task-detail-grid/task-detail-grid.component';

import { UserStoreService } from '../../services/user-store.service';

import { TaskResponseModel } from '../../models/TaskResponseModel';
import { UserStatisticsResponseModel } from '../../models/UserStatisticsResponseModel';

@Component({
    selector: 'app-user-data-grid',
    standalone: true,
    imports: [DxBulletModule, DxTemplateModule, DxDataGridModule, DxTileViewModule, DxButtonModule, TaskDetailGridComponent],
    templateUrl: './user-data-grid.component.html',
    styleUrl: './user-data-grid.component.css'
})
export class UserDataGridComponent implements OnInit, OnDestroy {
    userStoreService = inject(UserStoreService);
    dataSource: DataSource;
    destroyed$: Subject<void> = new Subject();

    visible: boolean = false;

    constructor() {
        this.dataSource = new DataSource(this.userStoreService.store);
    }

    ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    ngOnInit(): void { }

    onEditingStart(model: DxDataGridTypes.EditingStartEvent) {
        this.userStoreService.email = model.data.email;
        this.userStoreService.userName = model.data.userName;
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
        let user = this.userStoreService.users.find(x => x.id === e.userId);

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

    async onTaskDeleted(e: { taskId: number, userId: string }) {
        let user = this.userStoreService.users.find(x => x.id === e.userId);

        if (!user) {
            return;
        }

        user.tasks = user.tasks.filter((x: TaskResponseModel) => x.id !== e.taskId);

        this.updateTaskCount(user);

        await this.dataSource.reload();
    }

    private updateTaskCount(user: UserStatisticsResponseModel) {
        user.taskCount = user.tasks.length;
        user.taskCompleteCount = user.tasks.filter((x: TaskResponseModel) => x.isCompleted === true).length;
        user.taskCompletePercent = (user.taskCompleteCount / user.taskCount * 100).toFixed(2);
        user.taskIncompleteCount = user.tasks.filter((x: TaskResponseModel) => x.isCompleted === false).length;
        user.taskIncompletePercent = (user.taskIncompleteCount / user.taskCount * 100).toFixed(2);
    }
}
