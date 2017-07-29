import {IJob} from "./iJob";
import {IScheduleEngine} from "../scheduleEngine/baseScheduleEngine";
import {Observable, Subject} from 'rxjs';
import {JobEmitType, JobStatus} from "../../models/enums";

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

    public async start(onFinish: Function) {
        this.onFinish = onFinish;
        await this.engine.init();
        this.engine.schedule.status = JobStatus.Running;
        this.subject.next({
            data: JobStatus.Running,
            type: JobEmitType.OnUpdateStatus
        });
        this.process();
    }

    public async pause() {
        this.engine.schedule.status = JobStatus.Paused;
        this.subject.next({
            data: JobStatus.Paused,
            type: JobEmitType.OnUpdateStatus
        });
    }

    public async resume() {
        this.engine.schedule.status = JobStatus.Running;
        this.subject.next({
            data: JobStatus.Running,
            type: JobEmitType.OnUpdateStatus
        });
        this.process();
    }

    public async stop() {
        this.engine.schedule.status = JobStatus.Stopped;
        this.subject.next({
            data: JobStatus.Stopped,
            type: JobEmitType.OnUpdateStatus
        });
    }

    public observe() {
        if(this.subject) {
            return this.subject;
        }

        this.subject = new Subject();
    }

    private async process() {
        let nextData = this.engine.getNext();
        if(nextData) {
            this.subject.next({
                data: nextData,
                type: JobEmitType.OnProcessData
            });
            let res = await this.engine.doNext();
            this.subject.next({
                type: res.status !== undefined ? JobEmitType.OnUpdateStatus : JobEmitType.OnDone,
                data: res.status !== undefined ? res.status : res.data
            });
            this.process();
        } else {
            this.engine.schedule.status = JobStatus.Stopped;
            this.subject.next({
                data: JobStatus.Stopped,
                type: JobEmitType.OnUpdateStatus
            });

            this.onFinish();
        }
    }

    private next(event: any) {
        this.subject.next(event);
    }
}
