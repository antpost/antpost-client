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
import {ScheduleJob} from "../../../core/jobs/scheduleJob";

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
    public schedule: SchedulePost = new SchedulePost();
    public scheduleStatus = SchedulePostStatus;
    public job: ScheduleJob;

    constructor(private postService: PostService,
                private schedulePostService: SchedulePostService,
                private modal: ModalService,
                private jobQueue: JobQueue) {
        this.schedule.status = SchedulePostStatus.Opened;
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
        this.schedule = new SchedulePost();
        this.schedule.postId = this.post.id;
        this.schedule.status = SchedulePostStatus.Running;
        this.schedule.nodes = groups.map(group => group.id).join(',');
        this.schedule.createdAt = new Date();

        let id = await this.schedulePostService.add(this.schedule);

        this.schedule.post = this.post;
        this.schedule.groups = groups;

        this.job = <ScheduleJob>JobFactory.createScheduleJob(this.schedule, ScheduleType.Post);

        this.jobQueue.push(this.job);

        this.job.observe().subscribe((result) => {
            console.log(result);
        });
    }
}
