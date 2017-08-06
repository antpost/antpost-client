import {IScheduleMeta, IScheduleMetaValidationResult} from './meta';

export class GroupPostingMeta implements IScheduleMeta {
    public postId: number;
    public groups: Array<any>;

    public validate(): IScheduleMetaValidationResult {
        let res = {
            status: true
        } as IScheduleMetaValidationResult;

        if (!this.groups || this.groups.length == 0) {
            res.message = 'Vui lòng chọn danh sách nhóm!';
            res.status = false;
        } else if (!this.postId) {
            res.message = 'Vui lòng chọn một bài đăng mẫu';
            res.status = false;
        }

        return res;
    }
}
