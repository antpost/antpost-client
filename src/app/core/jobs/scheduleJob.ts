import {IJob} from "./iJob";
import {IScheduleEngine} from "../scheduleEngine/baseScheduleEngine";

export class ScheduleJob implements IJob {
    private engine: IScheduleEngine;

    constructor(engine: IScheduleEngine) {
        this.engine = engine;
    }
}
