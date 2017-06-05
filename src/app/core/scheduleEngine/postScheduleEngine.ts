import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {SchedulePost} from "../../models/schedulePost.model";
import {FacebookService} from "../../services/facebook.service";
import {ServiceLocator} from "../serviceLocator";

export class PostScheduleEngine extends BaseScheduleEngine implements IScheduleEngine{
    private facebookService: FacebookService;

    constructor(private schedule: SchedulePost) {
        super();

        this.init();
    }

    public hasNext(): boolean {
        return false;
    }

    public doSchedule(doneCallback: Function): void {
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
    }
}
