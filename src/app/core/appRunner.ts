import {Injectable} from "@angular/core";
import {JobQueue} from "./jobs/jobQueue";

@Injectable()
export class AppRunner {
    constructor(private jobQueue: JobQueue) {

    }

    public run() {
        this.jobQueue.start();

        this.buildSchedulePostJobs();
    }

    public async buildSchedulePostJobs() {
        // get schedules that status is open or running or paused

    }
}
