import {Injectable} from "@angular/core";
import {IJob} from "./iJob";
import {JobPool} from "./jobPool";

@Injectable()
export class JobQueue {
    private pool: JobPool;
    private queue: Array<IJob>;
    private isRunning: boolean;
    private interval: number = 30 * 1000;

    constructor() {
        this.isRunning = false;
        this.queue = [];
        this.pool = new JobPool(5);
    }

    public start() {
        console.log('Job start!');
        this.isRunning = true;

        this.loop(1000);
    }

    public push(job: IJob) {
        this.queue.push(job);
    }

    /**
     * Stop job by id
     * @param jobId
     * @returns {any}
     */
    public remove(jobId: string) {
        const index = this.queue.findIndex((jobItem) => jobItem.getId() == jobId);
        if(index) {
            const job = this.queue[index];
            this.queue.splice(index, 1);
            return job;
        }

        return this.pool.remove(jobId);
    }

    /**
     * Find job by id
     * @param jobId
     * @returns {any}
     */
    public findJob(jobId) {
        const index = this.queue.findIndex((jobItem) => jobItem.getId() == jobId);
        if(index) {
            return this.queue[index];
        }

        return this.pool.findJob(jobId);
    }

    private loop(timeout: number) {
        setTimeout(() => {
            if(this.queue.length > 0) {
                let check = this.pool.add(this.queue[0]);
                if(check) {
                    this.queue.splice(0, 1);
                }
            }

            this.loop(this.interval);
        }, timeout);
    }
}
