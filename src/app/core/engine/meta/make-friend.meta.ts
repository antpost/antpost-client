import {IScheduleMeta, IScheduleMetaValidationResult} from './meta';

export class MakeFriendMeta implements IScheduleMeta {
    public targetGroupId: number;
    public gender: string;
    public age: number;
    public relationships: number[];
    public friendCount: number;
    public lastPostTime: number;

    public validate(): IScheduleMetaValidationResult {
        let res = {
            status: true
        } as IScheduleMetaValidationResult;

        if (!this.targetGroupId) {
            res.message = 'Vui lòng chọn nhóm mục tiêu!';
            res.status = false;
        }

        return res;
    }
}
