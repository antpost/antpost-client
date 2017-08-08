import {IScheduleEngine, BaseEngine} from "./baseEngine";
import {JobStatus, PostType} from '../../models/enums';
import {Schedule} from '../../models/schedule.model';
import {IResNextData} from '../jobs/iJob';
import {Post} from '../../models/post.model';
import {PostService} from '../../services/post.service';
import {ServiceLocator} from '../serviceLocator';

export class GroupPostingEngine extends BaseEngine implements IScheduleEngine {
    public static ENGINE_KEY = 'POSTENGINE';

    public post: Post;
    private isFirst: boolean = true;

    private postService: PostService;

    constructor(schedule: Schedule) {
        super(schedule);

        this.postService = ServiceLocator.injector.get(PostService);
    }

    public getId() {
        return GroupPostingEngine.ENGINE_KEY + this.schedule.id;
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
                let group = await this.postGroup();
                resolve({
                    id: group.id,
                    name: group.name,
                    done: true,
                    message: group.fbPostId ? 'Thành công' : group.error
                } as IResNextData);

            }, this.isFirst ? 0 : this.schedule.delay * 1000);
        });
    }

    /**
     * Post next group
     * @returns {Promise<void>}
     */
    private postGroup(): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            let group = this.getNextGroup();

            if(!this.post) {
                this.post = await this.postService.get(this.schedule.meta.postId);
            }

            let promise = null;
            switch (this.post.type) {
                case PostType.Message:
                case PostType.Link:
                    promise = this.facebookService.postToNode(this.account, this.post, group.id);
                    break;

                case PostType.Sale:
                    promise = this.facebookService.publishPost(this.account, this.post, group.id);
                    break;
            }

            promise.then(async (result) => {
                group.status = 1;
                group.fbPostId = result.id;
                group.error = result.error;

                resolve(group);
            });
        });
    }

    private getNextGroup() {
        return this.schedule.meta.groups.find(group => !group.status);
    }
}
