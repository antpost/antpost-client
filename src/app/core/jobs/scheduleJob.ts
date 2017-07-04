import {IJob} from "./iJob";
import {IScheduleEngine} from "../scheduleEngine/baseScheduleEngine";
import {Observable, Subject} from 'rxjs';

export class ScheduleJob implements IJob {
    public static JOB_KEY = 'SCHEDULE';
    private engine: IScheduleEngine;
    private onFinish: Function;
    private subject: Subject<any>;

    constructor(engine: IScheduleEngine) {
        this.engine = engine;
        this.subject = new Subject();
    }

    public getId() {
        return ScheduleJob.JOB_KEY + this.engine.getId();
    }

    public start(onFinish: Function) {
        this.onFinish = onFinish;
        this.process();
    }

    public async pause() {
        await this.engine.pause();
    }

    public async stop() {
        await this.engine.stop();
    }

    public observe() {
        if(this.subject) {
            return this.subject;
        }

        this.subject = new Subject();
    }

    private async process() {
        if(this.engine.hasNext()) {
            this.engine.doNext((res) => {
                this.subject.next(res);
                this.process();
            });
        } else {
            await this.engine.stop();
            this.subject.next({
                status: 'stop'
            });

            this.onFinish();
        }
    }

    private next(event: any) {
        this.subject.next(event);
    }
}
