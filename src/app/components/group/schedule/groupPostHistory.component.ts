import {
    Component,
    OnInit, ViewEncapsulation
} from '@angular/core';
import {SchedulePost} from '../../../models/schedulePost.model';

@Component({
    selector: 'group-post-history',
    providers: [],
    styleUrls: [],
    templateUrl: 'groupPostHistory.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GroupPostHistoryComponent implements OnInit {

    public schedules: Array<SchedulePost>;

    constructor() {

    }

    public async ngOnInit() {
        //this.schedules = await this.schedulePostService.all();
    }
}
