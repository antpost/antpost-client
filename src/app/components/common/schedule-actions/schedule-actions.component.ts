import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Schedule} from '../../../models/schedule.model';
import {FbAccount} from '../../../models/fbaccount.model';
import {JobStatus, ScheduleAction} from '../../../models/enums';

@Component({
    selector: 'schedule-actions',
    templateUrl: './schedule-actions.component.html',
    styleUrls: ['./schedule-actions.component.css']
})
export class ScheduleActionsComponent implements OnInit {

    @Input()
    public meta: any;

    @Input()
    public options: any;

    @Input()
    public account: FbAccount;

    @Output()
    public onAction = new EventEmitter<number>();

    public schedule: Schedule;
    public delayList: Array<any>;
    public repeatList: Array<any>;
    public enableSchedule: boolean = false;
    public status: number = JobStatus.Stopped;
    public jobStatus;

    constructor() {
    }

    ngOnInit() {
        this.jobStatus = JobStatus;
        this.schedule = Object.assign(new Schedule(), {
            uid: this.account.id,
            scheduleType: this.options.scheduleType,
            delay: 5,
            startTime: new Date(),
            endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
        });

        this.delayList = [
            {text: '5 giây', value: 5},
            {text: '10 giây', value: 10},
            {text: '30 giây', value: 30},
            {text: '1 phút', value: 60},
            {text: '10 phút', value: 600}
        ];

        this.repeatList = [];
        for(let i = 1; i <= 24; i ++) {
            this.repeatList.push({text: `${i} giờ`, value: i * 60 * 60});
        }
    }

    public start() {
        this.status = JobStatus.Running;
        this.onAction.emit(ScheduleAction.Start);
    }

    public stop() {
        this.status = JobStatus.Stopped;
        this.onAction.emit(ScheduleAction.Stop);
    }

    public pause() {
        this.status = JobStatus.Paused;
        this.onAction.emit(ScheduleAction.Pause);
    }

    public resume() {
        this.status = JobStatus.Running;
        this.onAction.emit(ScheduleAction.Resume);
    }

    public openSchedule() {
        this.enableSchedule = true;
    }

    public hideSchedule() {
        this.enableSchedule = false;
    }

}
