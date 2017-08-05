import {IScheduleMeta, IScheduleMetaValidationResult} from './meta';

export class GroupPostingMeta implements IScheduleMeta{
    public postId: number;
    public groups: Array<any>;

    public validate(): IScheduleMetaValidationResult {
        let res = {
            status: true
        } as IScheduleMetaValidationResult;

        return res;
    }
}
