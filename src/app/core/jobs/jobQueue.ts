import {Inject} from "@angular/core";
import {IJob} from "./iJob";
import {JobPool} from "./jobPool";
import List = _.List;

@Inject()
export class JobQueue {
    private pool: JobPool;
    private queue: List<IJob>;
    private isRunning: boolean;

    constructor() {
        this.isRunning = false;
        this.queue = [];
    }

    public start() {
        this.isRunning = true;
    }

    public add(job: IJob) {

    }
}
