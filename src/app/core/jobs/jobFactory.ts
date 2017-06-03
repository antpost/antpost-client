import {Schedule} from "../../models/baseSchedule";
import {PostScheduleEngine} from "../scheduleEngine/postScheduleEngine";
import {ScheduleType} from "../../models/enums";
import {IScheduleEngine} from "../scheduleEngine/baseScheduleEngine";
import {ScheduleJob} from "./scheduleJob";

export class JobFactory {

    /**
     * Create schedule job
     * @param schedule
     * @param type
     * @returns {ScheduleJob}
     */
    public static createScheduleJob (schedule: Schedule, type: number) {
        let types = {
            'Post': PostScheduleEngine
        };

        let key = ScheduleType[type];
        let engine = Object.create(types[key].prototype) as IScheduleEngine;
        engine.constructor.apply(engine, [schedule]);

        return new ScheduleJob(engine);
    }
}
