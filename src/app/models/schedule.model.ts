/**
 * Created by Nguyen Manh Cuong on 7/25/2017.
 */

export class Schedule {
    public id: number;
    public uid: string;
    public delay: number;
    public startTime: Date;
    public endTime: Date;
    public status: number;
    public createdAt: Date;
    public updatedAt: Date;
    public scheduleType: number;
    public meta: any;
}
