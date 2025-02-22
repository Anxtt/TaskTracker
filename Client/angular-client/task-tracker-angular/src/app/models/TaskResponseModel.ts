export interface TaskResponseModel {
    id: number;
    name: string;
    oldName: string;
    createdOn: Date;
    deadline: Date;
    isCompleted: boolean;
    user: string;
    userId: string;
}