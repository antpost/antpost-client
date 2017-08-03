import {IJob, IResNextData} from "./iJob";
import {IScheduleEngine} from "../scheduleEngine/baseScheduleEngine";
import {Observable, Subject} from 'rxjs';
import {JobEmitType, JobStatus} from "../../models/enums";

export class ScheduleJob implements IJob {
    public static JOB_KEY = 'SCHEDULE';
    public status: JobStatus;
    public logs: Array<IResNextData>;
    public total: number = 0;
    public doneCount: number = 0;

    private engine: IScheduleEngine;
    private onFinish: Function;
    private subject: Subject<any>;

    constructor(engine: IScheduleEngine) {
        this.engine = engine;
        this.logs = [];
        this.subject = new Subject();
    }

    public getId() {
        return ScheduleJob.JOB_KEY + this.engine.getId();
    }

    public async start(onFinish?: Function) {
        this.onFinish = onFinish;

        await this.engine.init();

        this.total = this.engine.getTotal();
        this.doneCount = 0;
        this.logs = [];

        this.status = JobStatus.Running;
        this.subject.next({
            data: JobStatus.Running,
            type: JobEmitType.OnUpdateStatus
        });
        this.process();
    }

    public async pause() {
        this.status = JobStatus.Paused;
        this.subject.next({
            data: JobStatus.Paused,
            type: JobEmitType.OnUpdateStatus
        });
    }

    public async resume() {
        this.status = JobStatus.Running;
        this.subject.next({
            data: JobStatus.Running,
            type: JobEmitType.OnUpdateStatus
        });
        this.process();
    }

    public async stop() {
        this.status = JobStatus.Stopped;
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
        if(this.status != JobStatus.Running) {
            return;
        }
        // find next data to do action
        let nextData = this.engine.getNext();

        if(nextData) {
            this.subject.next({
                data: nextData,
                type: JobEmitType.OnProcessData
            });

            // execute
            let res = await this.engine.doNext();
            if(res.done) {
                this.doneCount ++;
            }

            // finish next item
            this.logs.push(res);
            this.subject.next({
                type: JobEmitType.OnDone,
                data: res
            });

            // call again to execute next data
            this.process();
        } else {
            // there is nothing to do action, update job status to stop
            this.status = JobStatus.Stopped;
            this.subject.next({
                data: JobStatus.Stopped,
                type: JobEmitType.OnUpdateStatus
            });

            // done job
            this.subject.next({
                data: JobStatus.Stopped,
                type: JobEmitType.Finished
            });
        }
    }
}
