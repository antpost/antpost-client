import {BaseScheduleEngine, IScheduleEngine} from "./baseScheduleEngine";
import {SchedulePost} from "../../models/schedulePost.model";
export class PostScheduleEngine extends BaseScheduleEngine implements IScheduleEngine{

    constructor(private schedule: SchedulePost) {

    }

    public next(): Promise<any> {
        return null;
    }

    public act(): Promise<any> {
        return null;
    }

    public stop(): Promise<any> {
        return null;
    }

    public delay(callback: Function): void {
        return null;
    }
}
