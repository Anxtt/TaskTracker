export interface TaskResponseModel {
    id: number;
    name: string;
    createdOn: Date;
    deadline: Date;
    isCompleted: boolean;
    user: string;
}