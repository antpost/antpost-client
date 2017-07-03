import {IJob} from "./iJob";
export class JobPool {
    // maximum jobs that pool holds
    private poolSize: number;
    private jobs: Array<IJob>;

    constructor(poolSize: number) {
        this.poolSize = poolSize || 5;
        this.jobs = [];
    }

    public isFull(): boolean {
        return this.jobs.length >= this.poolSize;
    }

    /**
     * Add job
     * @param job
     * @returns {boolean}
     */
    public add(job: IJob): boolean {
        if(this.isFull()) {
            return false;
        }

        this.jobs.push(job);
        job.start(() => {
            let index = this.jobs.indexOf(job);
            this.jobs.splice(index, 1);
        });

        return true;
    }

    /**
     * remove job
     * @param jobId
     * @returns {any}
     */
    public remove(jobId: string): IJob {
        const index = this.jobs.findIndex((jobItem) => jobItem.getId() == jobId);
        if(index) {
            const job = this.jobs[index];
            this.jobs.splice(index, 1);
            return job;
        }

        return null;
    }

    /**
     * Find job
     * @param jobId
     * @returns {undefined|IJob}
     */
    public findJob(jobId: string): IJob {
        return this.jobs.find((jobItem) => jobItem.getId() == jobId);
    }
}
