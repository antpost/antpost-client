import {IScheduleMeta, IScheduleMetaValidationResult} from './meta';

export class GroupJoiningMeta implements IScheduleMeta {
    public groups: any[];
    public members: number;
    public privacy: any[];
    public noPendingPost: boolean;

    public validate(): IScheduleMetaValidationResult {
        let res = {
            status: true
        } as IScheduleMetaValidationResult;

        if (!this.groups || this.groups.length == 0) {
            res.message = 'Vui lòng chọn danh sách nhóm!';
            res.status = false;
        } else if(!this.members){
            res.message = 'Vui lòng nhập số thành viên từ!';
            res.status = false;
        }

        return res;
    }
}
