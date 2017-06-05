import {IJob} from "./iJob";
import {IScheduleEngine} from "../scheduleEngine/baseScheduleEngine";

export class ScheduleJob implements IJob {
    private engine: IScheduleEngine;

    constructor(engine: IScheduleEngine) {
        this.engine = engine;
    }

    public start() {
        this.process();
    }

    private process() {
        while(this.engine.hasNext()) {
            this.engine.doNext(() => {
                this.process();
            });
        }
    }
}
