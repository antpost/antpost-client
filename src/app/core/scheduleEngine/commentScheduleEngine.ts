import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {FacebookService} from "../../services/facebook.service";
import {ServiceLocator} from "../serviceLocator";
import {JobStatus, PostType} from '../../models/enums';
import {AutomationService} from '../../services/automation.service';
import {Schedule} from '../../models/schedule.model';
import {FbAccount} from '../../models/fbaccount.model';
import {FbAccountService} from '../../services/fbaccount.service';

export class CommentScheduleEngine extends BaseScheduleEngine implements IScheduleEngine {
    public static ENGINE_KEY = 'COMMENTENGINE';

    private isFirst: boolean = true;

    constructor(schedule: Schedule) {
        super(schedule);
    }

    public getId() {
        return CommentScheduleEngine.ENGINE_KEY + (this.schedule.id || 0);
    }

    public getNext(): any {
        if(this.schedule.isStatus(JobStatus.Stopped)) {
            return null;
        }

        let groupId = this.getNextGroupId();
        return groupId ? {id: groupId} : null;
    }

    public doNext(): Promise<any> {
        if(!this.schedule.isStatus(JobStatus.Running)) {
            this.schedule.status = JobStatus.Running;
            return Promise.resolve({
                status: this.schedule.status
            });
        }

        return new Promise<any>((resolve) => {
            setTimeout(async () => {
                if(this.schedule.isStatus(JobStatus.Running)) {
                    let data = await this.commentUp();
                    resolve({
                        data: data
                    });
                }
            }, this.isFirst ? 0 : this.schedule.delay * 1000);
        });
    }

    public delay(callback: Function): void {
        return null;
    }

    private commentUp(): Promise<any> {
        // find group to comment
        let groupId = this.getNextGroupId();
        let group = this.getGroupData(groupId);

        return new Promise<any>(async (resolve, reject) => {
            if(!group) {
                let posts = await this.facebookService.getLastedPostsOfGroup(groupId, this.account, this.schedule.meta.numberOfPosts);
                group = {
                    id: groupId,
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

    private getNextGroupId() {
        if(!this.schedule.results) {
            return this.schedule.meta.groupIds[0];
        }

        return this.schedule.meta.groupIds.find(id => {
            let groupItem = this.schedule.results.find(g => g.id == id);
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
