/**
 * Created by Nguyen Manh Cuong on 7/25/2017.
 */

export class Schedule {
    public id: number;
    public name: string;
    public uid: string;
    public accountName: string;
    public delay: number;
    public startTime: Date;
    public endTime: Date;
    public status: number;
    public active: boolean;
    public createdAt: Date;
    public updatedAt: Date;
    public scheduleType: number;
    public meta: any;
    public lastRun: Date;
    public results: Array<any>;

    public isStatus(status: number) {
        return this.status == status;
    }
}
