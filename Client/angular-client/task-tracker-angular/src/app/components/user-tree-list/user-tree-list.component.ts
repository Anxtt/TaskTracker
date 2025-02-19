import { Component, inject } from '@angular/core';

import { DxTreeListModule } from 'devextreme-angular';
import { DxoMasterDetailModule } from 'devextreme-angular/ui/nested';
import { DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import DataSource from 'devextreme/data/data_source';

import { UserStoreService } from '../../services/user-store.service';

import { TaskResponseModel } from '../../models/TaskResponseModel';

@Component({
    selector: 'app-user-tree-list',
    standalone: true,
    imports: [DxTreeListModule, DxoMasterDetailModule],
    templateUrl: './user-tree-list.component.html',
    styleUrl: './user-tree-list.component.css'
})
export class UserTreeListComponent {
    userStoreService = inject(UserStoreService);
    dataSource: DataSource;

    tasks: TaskResponseModel[] = [];

    constructor() {
        this.dataSource = new DataSource(this.userStoreService.store);
    }

    onRowUpdating(data: DxTreeListTypes.RowUpdatingEvent) {
        for (let props of Object.keys(data.oldData)) {
            if (!data.newData.hasOwnProperty(props)) {
                data.newData[props] = data.oldData[props];
            }
        }

        data.newData["tasks"] = this.tasks;
    }

    onEditingStart(model: DxTreeListTypes.EditingStartEvent) {
        this.userStoreService.email = model.data.email;
        this.userStoreService.userName = model.data.userName;
    }

    onEditorPreparing(event: DxTreeListTypes.EditorPreparingEvent) {
        if (!event.row?.data.name && (event.dataField === "createdOn" || event.dataField === "deadline" || event.dataField === "name")) {
            event.editorOptions.disabled = false;
        }
        // else if (!event.row?.data.userName && (event.dataField === "userName" || event.dataField === "email")) {
        //     event.editorOptions.disabled = true;
        // }
    }

    onEditorPrepared(event: DxTreeListTypes.EditorPreparedEvent) {
        // if (event.row?.node.hasChildren === true && this.tasks.length === 0) {
        //     for (let task of event.row?.node.children!) {
        //         this.tasks.push(task.data);
        //     }
        // }
    }
    
    allowUpdating(event: any) {
        if (event.row.data?.userName === undefined) {
            return false;
        }
        
        return true;
    }

    formatDate(data: DxTreeListTypes.ColumnCustomizeTextArg) {
        const options = { year: "numeric", month: "long", day: "numeric" }
        return data?.value?.toLocaleDateString("en-GB", options);
    }
}
