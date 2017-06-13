import {IJob} from "./iJob";
import {IScheduleEngine} from "../scheduleEngine/baseScheduleEngine";

export class ScheduleJob implements IJob {
    private engine: IScheduleEngine;
    private onFinish: Function;

    constructor(engine: IScheduleEngine) {
        this.engine = engine;
    }

    public start(onFinish: Function) {
        this.onFinish = onFinish;
        this.process();
    }

    private async process() {
        if(this.engine.hasNext()) {
            this.engine.doNext(() => {
                this.process();
            });
        } else {
            await this.engine.stop();

            this.onFinish();
        }
    }
}
