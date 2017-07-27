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

    public hasNext(): boolean {
        return this.getNextGroupId();
    }

    public doNext(doneCallback: Function): void {
        if(!this.schedule.isStatus(JobStatus.Running)) {
            this.schedule.status = JobStatus.Running;
            doneCallback({
                status: this.schedule.status
            });
            return;
        }

        setTimeout(() => {
            if(this.schedule.isStatus(JobStatus.Running)) {
                this.commentUp().then((data) => {
                    doneCallback({
                        data: data
                    });
                })
            }
        }, this.isFirst ? 0 : this.schedule.delay * 1000);
    }

    public async stop() {
        this.schedule.status = JobStatus.Stopped;

        /*await this.schedulePostService.update(this.schedule.id, {
            status: this.schedule.status
        });*/

        return true;
    }

    public async pause() {
        this.schedule.status = JobStatus.Paused;

        /*await this.schedulePostService.update(this.schedule.id, {
            status: this.schedule.status
        });*/

        return true;
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

            let post = group.posts.find(p => !post.status);
            if(post) {
                // comment on this post
                this.facebookService.comment(this.account, post, this.schedule.meta.message, this.schedule.meta.like, this.schedule.meta.commentOnTop);

                resolve(group);
            } else {
                resolve(group);
            }
        });
    }

    private getNextGroupId() {
        if(!this.schedule.results) {
            return this.schedule.meta.groups[0];
        }

        return this.schedule.meta.groups.find(id => {
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
