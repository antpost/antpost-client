import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {SchedulePost} from "../../models/schedulePost.model";
import {FacebookService} from "../../services/facebook.service";
import {ServiceLocator} from "../serviceLocator";
import {SchedulePostService} from "../../services/schedulePost.service";

export class PostScheduleEngine extends BaseScheduleEngine implements IScheduleEngine{
    private facebookService: FacebookService;
    private schedulePostService: SchedulePostService;

    constructor(private schedule: SchedulePost) {
        super();

        this.init();
    }

    public hasNext(): boolean {
        return this.schedule.hasAvailable();
    }

    public doNext(doneCallback: Function): void {
        return null;
    }

    public stop(): Promise<any> {
        return null;
    }

    public delay(callback: Function): void {
        return null;
    }

    private init() {
        // get injectors
        this.facebookService = ServiceLocator.injector.get(FacebookService);
        this.schedulePostService = ServiceLocator.injector.get(SchedulePostService);
    }
}
