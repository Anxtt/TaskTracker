import { Component, inject } from '@angular/core';

import { UserDataGridComponent } from '../user-data-grid/user-data-grid.component';
import { UserTreeListComponent } from '../user-tree-list/user-tree-list.component';
import { UserPivotGridComponent } from '../user-pivot-grid/user-pivot-grid.component';

import { UserStoreService } from '../../services/user-store.service';

@Component({
    selector: 'app-user-statistics',
    standalone: true,
    imports: [UserDataGridComponent, UserTreeListComponent, UserPivotGridComponent],
    templateUrl: './user-statistics.component.html',
    styleUrl: './user-statistics.component.css'
})
export class UserStatisticsComponent {
    userSourceService = inject(UserStoreService);
    
    constructor() { }
}
