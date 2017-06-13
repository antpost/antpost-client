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

    public add(job: IJob): boolean {
        if(this.isFull()) {
            return false;
        }

        this.jobs.push(job);
        job.start(() => {
            let index = this.jobs.indexOf(job);
            this.jobs.splice(index, 1);
        });
    }
}
