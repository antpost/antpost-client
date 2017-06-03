import {Schedule} from "./baseSchedule";

export class SchedulePost extends Schedule {
    public id: number;
    public postId: number;
    public nodes: string;
    public status: number;
}
