import {IScheduleEngine, BaseEngine} from "./baseEngine";
import {Schedule} from '../../models/schedule.model';
import {IResNextData} from '../jobs/iJob';
import {PostService} from '../../services/post.service';

export class GroupJoiningEngine extends BaseEngine implements IScheduleEngine {
    public static ENGINE_KEY = 'GROUP_JOINING_ENGINE';

    private isFirst: boolean = true;

    private postService: PostService;

    constructor(schedule: Schedule) {
        super(schedule);
    }

    public getId() {
        return GroupJoiningEngine.ENGINE_KEY + this.schedule.id;
    }

    public getTotal(): number {
        return this.schedule.meta.groups.length;
    }

    public getNext(): any {
        let group = this.getNextGroup();
        return group ? {
            id: group.id,
            name: group.name,
        } as IResNextData : null;
    }

    public doNext(): Promise<any> {
        return new Promise<IResNextData>((resolve) => {
            setTimeout(async () => {
                this.isFirst = false;
                let group = await this.joinNextGroup();
                resolve({
                    id: group.id,
                    name: group.name,
                    done: true,
                    message: group.message
                } as IResNextData);

            }, this.isFirst ? 0 : this.schedule.delay * 1000);
        });
    }

    /**
     * Join next group
     * @returns {Promise<void>}
     */
    private joinNextGroup(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let group = this.getNextGroup();
            let meta = this.schedule.meta;

            if(meta.privacy.indexOf(group.privacy) < 0) {
                group.message = "Không thuộc loại nhóm đã chọn";
                group.status = true;
                resolve(group);
                return;
            }

            let groupInfo = await this.facebookService.viewGroupInfo(this.account, group.id);

            // check if group has sent joining request
            if(groupInfo.requested) {
                group.message = "Đã gửi yêu cầu tham gia";
                group.status = true;
                resolve(group);
                return;
            } else if(meta.members > groupInfo.members) {
                group.message = `Số thành viên (${groupInfo.members}) không đạt yêu cầu`;
                group.status = true;
                resolve(group);
                return;
            }

            // check group has any pending post
            if(meta.noPendingPost) {
                let hasPendingPost = await this.facebookService.checkPendingPost(this.account, group.id);
                if(hasPendingPost) {
                    group.message = `Nhóm sẽ duyệt bài khi đăng`;
                    group.status = true;
                    resolve(group);
                    return;
                }
            }

            // do joining
            let status = await this.facebookService.joinGroup(this.account, group.id);
            if(status) {
                group.message = `Gửi yêu cầu gia nhập thành công`;
                group.status = true;
                resolve(group);
            } else {
                group.message = `Gửi yêu cầu gia nhập thất bại`;
                group.status = true;
                resolve(group);
            }
        });
    }

    private getNextGroup() {
        return this.schedule.meta.groups.find(group => !group.status);
    }
}
