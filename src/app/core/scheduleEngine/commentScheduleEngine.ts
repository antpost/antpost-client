import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {Schedule} from '../../models/schedule.model';
import {IResNextData} from '../jobs/iJob';

export class CommentScheduleEngine extends BaseScheduleEngine implements IScheduleEngine {
    public static ENGINE_KEY = 'COMMENTENGINE';

    private isFirst: boolean = true;

    constructor(schedule: Schedule) {
        super(schedule);
    }

    public getId() {
        return CommentScheduleEngine.ENGINE_KEY + (this.schedule.id || 0);
    }

    public getTotal(): number {
        return this.schedule.meta.groups.length;
    }

    public getNext(): IResNextData {
        let group = this.getNextGroup();
        return group ? {
            id: group.id,
            name: group.name,
        } as IResNextData : null;
    }

    public doNext(): Promise<IResNextData> {
        return new Promise<IResNextData>((resolve) => {
            setTimeout(async () => {
                this.isFirst = false;
                let group = await this.commentUp();

                const isDone = (group) => {
                    return !group.posts || group.posts.length == 0 || !group.posts.find(p => !p.status)
                };

                const getMessage = (group) => {
                    if(isDone(group)) {
                        if(!group.posts || group.posts.length == 0) {
                            this.isFirst = true;
                            return 'Không tìm thấy bài viết';
                        } else {
                            return `Thành công: ${group.posts.length}/${group.posts.length}`
                        }
                    } else {
                        let count = group.posts.filter(p => p.status).length;
                        return `Thành công: ${count}/${group.posts.length}`
                    }
                };

                resolve({
                    id: group.id,
                    name: group.name,
                    done: isDone(group),
                    message: getMessage(group)
                } as IResNextData);
            }, this.isFirst ? 0 : this.schedule.delay * 1000);
        });
    }

    public delay(callback: Function): void {
        return null;
    }

    private commentUp(): Promise<any> {
        // find group to comment
        let groupId = this.getNextGroup().id;
        let group = this.getGroupData(groupId);

        return new Promise<any>(async (resolve, reject) => {
            if(!group) {
                let posts = await this.facebookService.getLastedPostsOfGroup(groupId, this.account, this.schedule.meta.numberOfPosts);
                group = {
                    id: groupId,
                    name: this.schedule.meta.groups.find(g => g.id == groupId).name,
                    posts: posts || []
                }
                this.schedule.results = this.schedule.results || [];
                this.schedule.results.push(group);
            }

            let post = group.posts.find(p => !p.status);
            if(post) {
                // comment on this post
                post.status = await this.facebookService.comment(this.account, post, this.schedule.meta.message, this.schedule.meta.like, this.schedule.meta.commentOnTop);

                resolve(group);
            } else {
                resolve(group);
            }
        });
    }

    private getNextGroup() {
        if(!this.schedule.results) {
            return this.schedule.meta.groups[0];
        }

        return this.schedule.meta.groups.find(group => {
            let groupItem = this.schedule.results.find(g => g.id == group.id);
            if(!groupItem) {
                return true;
            } else {
                return !groupItem.posts || groupItem.posts.find(p => !p.status);
            }
        });
    }

    private getGroupData(groupId: string) {
        if(!this.schedule.results) {
            return null;
        }

        let groupItem = this.schedule.results.find(g => g.id == groupId);
        return groupItem;
    }
}
