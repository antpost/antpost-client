import {
    Component,
    OnInit, ViewEncapsulation, Input
} from '@angular/core';
import {SchedulePost} from '../../../models/schedulePost.model';

@Component({
    selector: 'group-post-detail',
    template: `
      <kendo-grid
          [data]="list"
        >
      <kendo-grid-column field="name" title="Nhóm" [width]="250">
      </kendo-grid-column>
      <kendo-grid-column field="timePosted" title="Ngày đăng" [width]="150">
            <ng-template kendoGridCellTemplate let-dataItem>
                {{dataItem.timePosted | date: 'short' }}
            </ng-template>
        </kendo-grid-column>
      <kendo-grid-column title="Kết quả">
            <ng-template kendoGridCellTemplate let-dataItem>
                <span *ngIf="dataItem.fbPostId"><a target="_blank" href="https://facebook.com/{{dataItem.fbPostId}}">
                    <i class="fa fa-facebook-square"></i> Click xem
                </a></span>
                <span *ngIf="dataItem.error">{{dataItem.error}}</span>
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

    constructor() {

    }

    public ngOnInit() {
        // build list node-posts from schedule actions

        this.refresh();
    }

    public refresh() {
        this.list = this.schedule.groups;

        if (this.schedule.nodePosts) {
            this.list.forEach((group: any) => {
                // find post on facebook item
                let post = this.schedule.nodePosts.find((item) => item.nodeId == group.id);
                if (post) {
                    group.fbPostId = post.fbPostId;
                    group.error = post.error;
                    group.timePosted = post.timePosted;
                }
            });
        }
    }
}
