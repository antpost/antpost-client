import {IScheduleMeta, IScheduleMetaValidationResult} from './meta';

export class CommentUpMeta implements IScheduleMeta{
    public message: string;
    public numberOfPosts: number;
    public like: boolean;
    public commentOnTop: boolean;
    public delay: number;
    public groups: Array<any>;

    public validate(): IScheduleMetaValidationResult {
        let res = {
            status: true
        } as IScheduleMetaValidationResult;

        if(!this.message || !this.message.trim()) {
            res.message = 'Nội dung bình luận không được bỏ trống';
            res.status = false;
        } else if(!this.groups || this.groups.length == 0) {
            res.message = 'Vui lòng chọn danh sách nhóm!';
            res.status = false;
        }

        return res;
    }
}
