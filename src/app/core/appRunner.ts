import {Injectable} from "@angular/core";
import {SchedulePostService} from "../services/schedulePost.service";
import {JobQueue} from "./jobs/jobQueue";
import {ScheduleJob} from "./jobs/scheduleJob";

@Injectable()
export class AppRunner {
    constructor(private jobQueue: JobQueue,
                private schedulePostService: SchedulePostService) {
        this.jobQueue.start();
    }

    public run() {

    }

    public async buildSchedulePostJobs() {
        // get schedules that status is open or running or paused
        let schedules = await this.schedulePostService.getActiveSchedules();
        if(schedules) {
            schedules.forEach((schedule) => {
                let job = new ScheduleJob(schedule);
                this.jobQueue.push(job);
            });
        }
    }
}
