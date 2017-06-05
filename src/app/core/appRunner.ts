import {Injectable} from "@angular/core";
import {SchedulePostService} from "../services/schedulePost.service";
import {JobQueue} from "./jobs/jobQueue";
import {JobFactory} from './jobs/jobFactory';
import {ScheduleType} from '../models/enums';

@Injectable()
export class AppRunner {
    constructor(private jobQueue: JobQueue,
                private schedulePostService: SchedulePostService) {

    }

    public run() {
        this.jobQueue.start();

        this.buildSchedulePostJobs();
    }

    public async buildSchedulePostJobs() {
        // get schedules that status is open or running or paused
        let schedules = await this.schedulePostService.getActiveSchedules();
        if(schedules) {
            schedules.forEach((schedule) => {
                let job = JobFactory.createScheduleJob(schedule, ScheduleType.Post);
                this.jobQueue.push(job);
            });
        }
    }
}
