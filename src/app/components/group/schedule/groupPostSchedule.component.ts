import {
    Component,
    OnInit, ViewChild, ViewEncapsulation
} from '@angular/core';
import {PostService} from '../../../services/post.service';
import {ModalService} from '../../../core/modal/modal.service';
import {PostSelectorComponent} from '../../post/postSelector.component';
import {Post} from '../../../models/post.model';
import {Toastr} from '../../../core/helpers/toastr';
import {Group} from '../../../models/group.model';
import {JoinedGroupComponent} from '../joinedGroup/joinedGroup.component';
import {SchedulePost} from '../../../models/schedulePost.model';
import {SchedulePostStatus, ScheduleType} from "../../../models/enums";
import {SchedulePostService} from "../../../services/schedulePost.service";
import {JobQueue} from "../../../core/jobs/jobQueue";
import {JobFactory} from "../../../core/jobs/jobFactory";

@Component({
    selector: 'group-post-schedule',
    providers: [],
    styleUrls: [],
    templateUrl: 'groupPostSchedule.component.html',
    encapsulation: ViewEncapsulation.None
})
export class GroupPostScheduleComponent implements OnInit {

    @ViewChild(JoinedGroupComponent)
    public joinedGroupComponent: JoinedGroupComponent;

    public post: Post = new Post();

    constructor(private postService: PostService,
                private schedulePostService: SchedulePostService,
                private modal: ModalService,
                private jobQueue: JobQueue) {

    }

    public ngOnInit() {

    }

    public selectPost() {
        let dialog = this.modal.open({
            component: PostSelectorComponent,
            title: 'Chọn bài viết'
        });

        dialog.then((result: any) => {
            this.post = result;
        });
    }

    public async start() {
        if (!this.post.id) {
            Toastr.error('Bạn hãy chọn 1 bài viết đã lưu trước.');
            return;
        }

        // check no groups selected
        let groups = this.joinedGroupComponent.getSelectedGroups();
        if(groups.length == 0) {
            Toastr.error('Bạn phải chọn ít nhất 1 nhóm để đăng.');
            return;
        }

        // save schedule
        let schedule = new SchedulePost();
        schedule.postId = this.post.id;
        schedule.status = SchedulePostStatus.Opened;
        schedule.nodes = groups.map(group => group.id).join(',');
        schedule.createdAt = new Date();

        let id = await this.schedulePostService.add(schedule);

        schedule.post = this.post;
        schedule.groups = groups;

        this.jobQueue.push(JobFactory.createScheduleJob(schedule, ScheduleType.Post));
    }
}
