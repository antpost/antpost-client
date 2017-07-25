import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {FacebookService} from "../../services/facebook.service";
import {ServiceLocator} from "../serviceLocator";
import {JobStatus, PostType} from '../../models/enums';
import {AutomationService} from '../../services/automation.service';
import {Schedule} from '../../models/schedule.model';

export class CommentScheduleEngine extends BaseScheduleEngine implements IScheduleEngine {
    private schedule: Schedule;
    public static ENGINE_KEY = 'COMMENTENGINE';

    private facebookService: FacebookService;
    private automationService: AutomationService;

    private isFirst: boolean = true;

    constructor(schedule: Schedule) {
        super();

        this.schedule = schedule;

        this.init();
    }

    public getId() {
        return CommentScheduleEngine.ENGINE_KEY + (this.schedule.id || 0);
    }

    public hasNext(): boolean {
        return this.schedule.status == JobStatus.Stopped;
    }

    public doNext(doneCallback: Function): void {
        if(this.schedule.status != JobStatus.Running) {
            this.schedule.status = JobStatus.Running;
            doneCallback({
                status: this.schedule.status
            });
        }

        setTimeout(() => {
            if(this.schedule.status == JobStatus.Running) {
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

    private init() {
        // get injectors
        this.facebookService = ServiceLocator.injector.get(FacebookService);
    }

    private commentUp(): Promise<any> {
        return new Promise<any>((resolve, reject) => {

        });
    }
}
