import {
    Component,
    OnInit, ViewEncapsulation, Input
} from '@angular/core';
import {SchedulePostService} from '../../../services/schedulePost.service';
import {SchedulePost} from '../../../models/schedulePost.model';
import {Group} from '../../../models/group.model';

@Component({
    selector: 'group-post-detail',
    template: `
      <kendo-grid
          [data]="list"
        >
      <kendo-grid-column field="name" title="Nhóm" width="300">
      </kendo-grid-column>
      <kendo-grid-column title="Kết quả">
            <ng-template kendoGridCellTemplate let-dataItem>
                <span *ngIf="dataItem.fbPostId"><a target="_blank" href="https://facebook.com/{{dataItem.fbPostId}}">
                    <i class="fa fa-facebook-square"></i> Click xem
                </a></span>
            </ng-template>
      </kendo-grid-column>
      </kendo-grid>
  `
})
export class GroupPostDetailComponent implements OnInit {

    /**
     * The schedule for which details are displayed
     */
    @Input()
    public schedule: SchedulePost;

    public list: any;

    constructor(private schedulePostService: SchedulePostService) {

    }

    public ngOnInit() {
        // build list node-posts from schedule actions
        this.list = this.schedule.groups;

        if (this.schedule.nodePosts) {
            this.list.forEach((group: any) => {
                // find post on facebook item
                let post = this.schedule.nodePosts.find((item) => item.nodeId == group.id);
                if (post) {
                    group.fbPostId = post.fbPostId;
                }
            });
        }

    }
}
