import {Component, Injector, Input, OnInit} from '@angular/core';
import {ScheduleService} from '../../../services/schedule.service';
import {Schedule} from '../../../models/schedule.model';

@Component({
    selector: 'schedule-list',
    templateUrl: './schedule-list.component.html',
    styleUrls: ['./schedule-list.component.css']
})
export class ScheduleListComponent implements OnInit {

    @Input()
    public onClose: Function;

    @Input()
    public onDismiss: Function;

    @Input()
    public scheduleType: number;

    public schedules: Array<Schedule>;

    constructor(private injector: Injector, private scheduleService: ScheduleService) {
        this.onClose = this.injector.get('onClose');
        this.onDismiss = this.injector.get('onDismiss');
        this.scheduleType = this.injector.get('scheduleType');
    }

    async ngOnInit() {
        this.schedules = await this.scheduleService.listByType(this.scheduleType);
    }

    public cancel() {
        this.onDismiss();
    }

    public remove(dataItem: Schedule) {

    }
}
