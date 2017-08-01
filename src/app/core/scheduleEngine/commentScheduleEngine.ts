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
        return this.getNextGroup();
    }

    public doNext(): Promise<any> {
        return new Promise<any>((resolve) => {
            setTimeout(async () => {
                let data = await this.commentUp();
                resolve({
                    data: data
                });
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
