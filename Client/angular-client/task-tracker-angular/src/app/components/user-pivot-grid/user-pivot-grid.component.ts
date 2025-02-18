import { Component, inject, AfterViewInit, ViewChild } from '@angular/core';

import { DxChartModule, DxPivotGridModule, DxScrollViewModule, DxChartComponent, DxPivotGridComponent  } from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import { UserStoreService } from '../../services/user-store.service';

@Component({
  selector: 'app-user-pivot-grid',
  standalone: true,
  imports: [DxChartModule, DxPivotGridModule, DxScrollViewModule],
  templateUrl: './user-pivot-grid.component.html',
  styleUrl: './user-pivot-grid.component.css'
})
export class UserPivotGridComponent implements AfterViewInit {
    userStoreService = inject(UserStoreService);

    dataSource: PivotGridDataSource;
    
    @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid!: DxPivotGridComponent;
    @ViewChild(DxChartComponent, { static: false }) chart!: DxChartComponent;

    constructor() {
        this.dataSource = new PivotGridDataSource({
            fields: [
                {
                    caption: "Username",
                    dataField: "userName",
                    dataType: "string",
                    area: "row"
                },
                {
                    caption: "E-mail",
                    dataField: "email",
                    dataType: "string",
                    area: "column"
                },
                {
                    caption: "Task Complete Count",
                    dataField: "taskCompleteCount",
                    dataType: "number",
                    area: "data",
                    summaryType: "custom",
                    calculateCustomSummary: (options) => {
                        // let value;
                        switch(options.summaryProcess) {
                            case "start":
                                // Initializing "totalValue" here
                                break;
                            case "calculate":
                                // Modifying "totalValue" here
                                options.totalValue = options.value;
                                // value = options.value;
                                break;
                            case "finalize":
                                // Assigning the final value to "totalValue" here
                                // options.totalValue = value;
                                break;
                        }
                    }
                },
                {
                    caption: "Task Incomplete Count",
                    dataField: "taskIncompleteCount",
                    dataType: "number",
                    area: "data",
                    summaryType: "custom",
                    calculateCustomSummary: (options) => {
                        // let value;
                        switch(options.summaryProcess) {
                            case "start":
                                // Initializing "totalValue" here
                                break;
                            case "calculate":
                                // Modifying "totalValue" here
                                options.totalValue = options.value;
                                // value = options.value;
                                break;
                            case "finalize":
                                // Assigning the final value to "totalValue" here
                                // options.totalValue = value;
                                break;
                        }
                    }
                },
                {
                    caption: "Task Count",
                    dataField: "taskCount",
                    dataType: "number",
                    area: "data",
                    summaryType: "custom",
                    calculateCustomSummary: (options) => {
                        // let value;
                        switch(options.summaryProcess) {
                            case "start":
                                // Initializing "totalValue" here
                                break;
                            case "calculate":
                                // Modifying "totalValue" here
                                options.totalValue = options.value;
                                // value = options.value;
                                break;
                            case "finalize":
                                // Assigning the final value to "totalValue" here
                                // options.totalValue = value;
                                break;
                        }
                    }
                },
                // {
                //     caption: "Task Complete %",
                //     dataField: "taskCompletePercent",
                //     dataType: "string",
                //     area: "data",
                //     summaryType: "custom",
                //     calculateCustomSummary: (options) => {
                //         let value;
                //         switch(options.summaryProcess) {
                //             case "start":
                //                 // Initializing "totalValue" here
                //                 break;
                //             case "calculate":
                //                 // Modifying "totalValue" here
                //                 break;
                //             case "finalize":
                //                 // Assigning the final value to "totalValue" here
                //                 break;
                //         }
                //     }
                // },
                // {
                //     caption: "Task Incomplete %",
                //     dataField: "taskIncompletePercent",
                //     dataType: "string",
                //     area: "data",
                //     summaryType: "custom",
                //     calculateCustomSummary: (options) => {
                //         switch(options.summaryProcess) {
                //             case "start":
                //                 // Initializing "totalValue" here
                //                 break;
                //             case "calculate":
                //                 // Modifying "totalValue" here
                //                 break;
                //             case "finalize":
                //                 // Assigning the final value to "totalValue" here
                //                 break;
                //         }
                //     }
                // }
            ],
            store: this.userStoreService.store
        });
        this.customizeTooltip = this.customizeTooltip.bind(this);
    }

    ngAfterViewInit(): void {
        this.pivotGrid.instance.bindChart(this.chart.instance, {
            dataFieldsDisplayMode: "singleAxis",
            alternateDataFields: true,
            // customizeSeries: (seriesName:any, seriesOptions:any) => {},
            // customizeChart: (options: any) => {},
            // inverted: true
            putDataFieldsInto: "series"
        })
    }

    customizeTooltip(args: any) {
        return {
          html: `${args.seriesName} | <div>${args.valueText}</div>`,
        };
      }
}
