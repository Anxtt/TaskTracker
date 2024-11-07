import { Component, Input, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { lastValueFrom, take } from 'rxjs';

import { DxDataGridModule } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';

import { TaskService } from '../../services/task.service';
import { MessageService } from '../../services/message.service';

import { TaskResponseModel } from '../../models/TaskResponseModel';

@Component({
    selector: 'app-detail-grid',
    standalone: true,
    imports: [DxDataGridModule],
    templateUrl: './detail-grid.component.html',
    styleUrl: './detail-grid.component.css'
})
export class DetailGridComponent implements AfterViewInit {
    private taskName: string = "";

    @Input() tasks: TaskResponseModel[] = [];

    @Output() taskUpdated: EventEmitter<TaskResponseModel> = new EventEmitter<TaskResponseModel>();
    @Output() taskDeleted: EventEmitter<{ taskId: number, userId: string }> = new EventEmitter<{ taskId: number, userId: string }>();

    taskDataSource: DataSource | null = null;

    minDate: string = new Date().toISOString().slice(0, 10);
    taskNameErrorMessage: string = "";

    constructor(private taskService: TaskService, private messageService: MessageService) { }

    ngAfterViewInit(): void {
        this.taskDataSource = new DataSource({
            store: new CustomStore({
                key: "id",
                load: async (options) => {
                    return this.tasks;
                },
                update: async (key, values) => {
                    return lastValueFrom(this.taskService.editTask(values)).then(() => {
                        this.tasks = this.tasks.map(t => {
                            if (t.id !== values.id) {
                                return t;
                            }

                            this.taskUpdated.emit(values);
                            return values;
                        })
                        
                        this.messageService.setMessage({ body: "Task was updated successfully." });
                    });
                },
                remove: async (key) => {
                    let userId = this.tasks?.find(x => x.id === key)!.userId;

                    return lastValueFrom(this.taskService.deleteTask(key, userId)).then(() => {
                        this.tasks = this.tasks.filter(x => x.id !== key);

                        this.taskDeleted.emit({ taskId: key, userId: userId });
                        this.messageService.setMessage({ body: "Task was deleted successfully." });
                    });
                }
            })
        })
    }

    onRowUpdating(data: DxDataGridTypes.RowUpdatingEvent) {
        for (let prop of Object.keys(data.oldData)) {
            if (!data.newData.hasOwnProperty(prop)) {
                data.newData[prop] = data.oldData[prop];
            }
        }
    }

    onEditingStart(e: DxDataGridTypes.EditingStartEvent) {
        this.taskName = e.data.name;
    }

    formatDate(e: DxDataGridTypes.ColumnCustomizeTextArg) {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return e.value.toLocaleDateString("en-GB", options);
    }

    taskNameCheck = (async ({ value }: any) => {
        return new Promise<void>((resolve, reject) => {
            if (value === this.taskName) {
                return resolve();
            }

            // send userId in a queryParam
            this.taskService.doesExistByName(value)
                .pipe(take(1))
                .subscribe((x: ValidationErrors | null) => {
                    if (x?.["error"]) {
                        this.taskNameErrorMessage = x?.["error"];
                        return reject();
                    }
                    else if (x !== null) {
                        this.taskNameErrorMessage = "Task Name already exists.";
                        return reject();
                    }

                    return resolve();
                })
        })
    }).bind(this);
}
