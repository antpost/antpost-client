import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {SchedulePost} from "../../models/schedulePost.model";
import {FacebookService} from "../../services/facebook.service";
import {ServiceLocator} from "../serviceLocator";
import {SchedulePostService} from "../../services/schedulePost.service";
import {PostSettings} from '../settings/postSettings';
import {NodePost} from '../../models/nodePost.model';
import {NodePostService} from '../../services/nodePost.service';
import {SchedulePostStatus, PostType} from '../../models/enums';
import {AutomationService} from '../../services/automation.service';

export class PostScheduleEngine extends BaseScheduleEngine implements IScheduleEngine {
    private schedule: SchedulePost;
    public static ENGINE_KEY = 'POSTENGINE';

    private facebookService: FacebookService;
    private schedulePostService: SchedulePostService;
    private nodePostService: NodePostService;
    private automationService: AutomationService;

    private postSettings: PostSettings;
    private isFirst: boolean = true;

    constructor(schedule: SchedulePost) {
        super();

        this.schedule = schedule;

        this.init();
    }

    public getId() {
        return PostScheduleEngine.ENGINE_KEY + this.schedule.id;
    }

    public hasNext(): boolean {
        return this.schedule.status == SchedulePostStatus.Stopped || this.schedule.hasUnposted();
    }

    public doNext(doneCallback: Function): void {
        if(this.schedule.status != SchedulePostStatus.Running) {
            this.schedule.status = SchedulePostStatus.Running;
            doneCallback(this.schedule.status);
        }

        setTimeout(() => {
            this.postGroup().then((data) => {
                doneCallback(data);
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

    public async pause() {
        this.schedule.status = SchedulePostStatus.Paused;

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
        this.automationService = ServiceLocator.injector.get(AutomationService);

        this.postSettings = {
            delay: 120
        };
    }

    /**
     * Post next group
     * @returns {Promise<void>}
     */
    private postGroup(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let group = this.schedule.findUnposted();

            if(group) {

                let observable = null;
                switch (this.schedule.post.type) {
                    case PostType.Message, PostType.Link:
                        observable = this.facebookService.postToNode(group.id, this.schedule.post);
                        break;

                    case PostType.Sale:
                        observable = this.automationService.publishPost(this.schedule.post, group.id);
                        break;
                }

                observable.subscribe(async (result) => {
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

                    resolve(nodePost);
                });
            }
        });
    }
}
