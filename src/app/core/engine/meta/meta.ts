export interface IScheduleMeta {
    validate(): IScheduleMetaValidationResult;
}

export interface IScheduleMetaValidationResult {
    status: boolean;
    message: string;
}
