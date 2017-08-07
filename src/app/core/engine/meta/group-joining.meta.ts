import {IScheduleMeta, IScheduleMetaValidationResult} from './meta';

export class GroupJoiningMeta implements IScheduleMeta {
    public groups: Array<any>;

    public validate(): IScheduleMetaValidationResult {
        let res = {
            status: true
        } as IScheduleMetaValidationResult;

        if (!this.groups || this.groups.length == 0) {
            res.message = 'Vui lòng chọn danh sách nhóm!';
            res.status = false;
        }

        return res;
    }
}
