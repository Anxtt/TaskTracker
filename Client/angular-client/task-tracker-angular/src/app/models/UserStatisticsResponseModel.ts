import { TaskResponseModel } from "./TaskResponseModel";

export interface UserStatisticsResponseModel {
    id: string;
    userName: string;
    email: string;
    taskCount: number;
    taskCompleteCount: number;
    taskCompletePercent: string;
    taskIncompleteCount: number;
    taskIncompletePercent: string;
    tasks: TaskResponseModel[];
}