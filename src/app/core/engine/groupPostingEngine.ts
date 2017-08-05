import {IScheduleEngine, BaseEngine} from "./baseEngine";
import {PostSettings} from '../settings/postSettings';
import {NodePost} from '../../models/nodePost.model';
import {JobStatus, PostType} from '../../models/enums';
import {Schedule} from '../../models/schedule.model';
import {IResNextData} from '../jobs/iJob';
import {Post} from '../../models/post.model';

export class GroupPostingEngine extends BaseEngine implements IScheduleEngine {
    public static ENGINE_KEY = 'POSTENGINE';

    private isFirst: boolean = true;

    constructor(schedule: Schedule) {
        super(schedule);
    }

    public getId() {
        return GroupPostingEngine.ENGINE_KEY + this.schedule.id;
    }

    public getTotal(): number {
        return this.schedule.meta.groups.length;
    }

    public getNext(): any {
        let group = null;
        return group ? {
            id: group.id,
            name: group.name,
        } as IResNextData : null;
    }

    public doNext(): Promise<any> {
        return new Promise<IResNextData>((resolve) => {
            setTimeout(async () => {
                this.isFirst = false;
                let group = await this.postGroup();
                resolve({
                    id: group.id,
                    name: group.name,
                    done: true,
                    message: "ok"
                } as IResNextData);

            }, this.isFirst ? 0 : this.schedule.delay * 1000);
        });
    }

    /**
     * Post next group
     * @returns {Promise<void>}
     */
    private postGroup(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            //let group = this.schedule.findUnposted();
            let group;

            if(group) {
                let post: Post;
                let observable = null;
                switch (post.type) {
                    case PostType.Message, PostType.Link:
                        observable = this.facebookService.postToNode(group.id, post);
                        break;

                    case PostType.Sale:
                        //observable = this.facebookService.publishPost(post, group.id);
                        break;
                }

                observable.subscribe(async (result) => {
                    this.isFirst = false;

                    let nodePost = {
                        scheduleId: this.schedule.id,
                        nodeId: group.id,
                        postId: this.schedule.meta.postId,
                        fbPostId: result.id,
                        error: result.error,
                        timePosted: new Date()
                    } as NodePost;

                    //this.schedule.nodePosts = this.schedule.nodePosts || [];
                    //this.schedule.nodePosts.push(nodePost);

                    //await this.nodePostService.add(nodePost);

                    resolve(nodePost);
                });
            }
        });
    }
}
