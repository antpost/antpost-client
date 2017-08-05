import {ScheduleType} from "../../models/enums";
import {IScheduleEngine} from "../engine/baseEngine";
import {ScheduleJob} from "./scheduleJob";
import {IJob} from "./iJob";
import {GroupPostingEngine} from '../engine/groupPostingEngine';
import {CommentEngine} from '../engine/commentEngine';

export class JobFactory {

    /**
     * Create schedule job
     * @param schedule
     * @param type
     * @returns {ScheduleJob}
     */
    public static createScheduleJob (schedule: any, type: number): IJob {
        let types = {
            PostGroup: GroupPostingEngine,
            Comment: CommentEngine
        };

        let key = ScheduleType[type];
        let engine = Object.create(types[key].prototype) as IScheduleEngine;
        engine.constructor.apply(engine, [schedule]);

        return new ScheduleJob(engine);
    }
}
