import {
    Component,
    OnInit, ViewEncapsulation
} from '@angular/core';
import {SchedulePostService} from '../../../services/schedulePost.service';
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

    constructor(private schedulePostService: SchedulePostService) {

    }

    public async ngOnInit() {
        this.schedules = await this.schedulePostService.all();
    }
}
