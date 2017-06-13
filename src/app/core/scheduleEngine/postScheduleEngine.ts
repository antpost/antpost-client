import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {SchedulePost} from "../../models/schedulePost.model";
import {FacebookService} from "../../services/facebook.service";
import {ServiceLocator} from "../serviceLocator";
import {SchedulePostService} from "../../services/schedulePost.service";
import {PostSettings} from '../settings/postSettings';
import {NodePost} from '../../models/nodePost.model';
import {NodePostService} from '../../services/nodePost.service';
import {SchedulePostStatus} from '../../models/enums';

export class PostScheduleEngine extends BaseScheduleEngine implements IScheduleEngine {
    private schedule: SchedulePost;

    private facebookService: FacebookService;
    private schedulePostService: SchedulePostService;
    private nodePostService: NodePostService;

    private postSettings: PostSettings;
    private isFirst: boolean = true;

    constructor(schedule: SchedulePost) {
        super();

        this.schedule = schedule;

        this.init();
    }

    public hasNext(): boolean {
        return this.schedule.status == SchedulePostStatus.Stopped || this.schedule.hasUnposted();
    }

    public doNext(doneCallback: Function): void {
        setTimeout(() => {
            this.postGroup().then(() => {
                doneCallback();
            })
        }, this.isFirst ? 0 : this.postSettings.delay * 1000);
    }

    public async stop() {
        this.schedule.status = SchedulePostStatus.Stopped;

        await this.schedulePostService.update(this.schedule.id, {
            status: this.schedule.status
        });

        return true;
    }

    public delay(callback: Function): void {
        return null;
    }

    private init() {
        // get injectors
        this.facebookService = ServiceLocator.injector.get(FacebookService);
        this.schedulePostService = ServiceLocator.injector.get(SchedulePostService);
        this.nodePostService = ServiceLocator.injector.get(NodePostService);

        this.postSettings = {
            delay: 120
        };
    }

    /**
     * Post next group
     * @returns {Promise<void>}
     */
    private postGroup(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let group = this.schedule.findUnposted();

            if(group) {
                this.facebookService.postToNode(group.id, this.schedule.post).subscribe(async (result) => {
                    console.log(result);
                    this.isFirst = false;

                    let nodePost = {
                        scheduleId: this.schedule.id,
                        nodeId: group.id,
                        postId: this.schedule.postId,
                        fbPostId: result.id
                    } as NodePost;

                    this.schedule.nodePosts = this.schedule.nodePosts || [];
                    this.schedule.nodePosts.push(nodePost);

                    await this.nodePostService.add(nodePost);

                    resolve();
                });
            }
        });
    }
}
